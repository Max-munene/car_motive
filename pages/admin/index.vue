<!-- pages/admin/index.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl text-ink">Admin Overview</h1>
      <p class="font-body text-sm text-ink-muted mt-0.5">
        BRIM X Auto management panel.
      </p>
    </div>

    <div v-if="!stats" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="i in 8"
        :key="i"
        class="bg-surface-2 rounded-lg h-20 img-shimmer"
      />
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="bg-surface rounded-lg border border-surface-3 p-4 shadow-card"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-body text-ink-faint uppercase tracking-wide">
            {{ card.label }}
          </p>
          <UIcon :name="card.icon" class="w-4 h-4 text-ink-faint" />
        </div>
        <p class="font-display text-2xl text-ink">{{ card.value }}</p>
      </div>
    </div>

    <!-- Pending listings -->
    <div
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-surface-3 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <h2 class="font-display text-base text-ink">Pending Review</h2>
          <UBadge
            v-if="pendingListings.length"
            :label="String(pendingListings.length)"
            color="warning"
            variant="soft"
            size="xs"
          />
        </div>
        <NuxtLink
          to="/admin/listings?status=pending"
          class="text-xs font-body text-brand hover:underline"
          >View all</NuxtLink
        >
      </div>
      <div v-if="pendingListings.length === 0" class="px-5 py-8 text-center">
        <p class="font-body text-sm text-ink-muted">
          No listings pending review.
        </p>
      </div>
      <div v-else>
        <div
          v-for="listing in pendingListings.slice(0, 6)"
          :key="listing.id"
          class="flex items-center gap-4 px-5 py-3 border-b border-surface-3 last:border-0 hover:bg-surface-2 transition-colors"
        >
          <div class="w-14 h-10 rounded bg-surface-2 overflow-hidden shrink-0">
            <img
              v-if="listing.primary_image"
              :src="listing.primary_image"
              :alt="listing.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-body font-500 text-ink truncate">
              {{ listing.title }}
            </p>
            <p class="text-xs font-body text-ink-faint">
              {{ formatPrice(listing.price) }} ·
              {{ listing.profiles?.full_name ?? "Unknown" }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              size="xs"
              color="success"
              variant="soft"
              class="font-body"
              :loading="approvingId === listing.id"
              @click="approveListing(listing.id)"
              >Approve</UButton
            >
            <UButton
              size="xs"
              color="error"
              variant="soft"
              class="font-body"
              @click="rejectListing(listing.id)"
              >Reject</UButton
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Recent inquiries -->
    <div
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-surface-3 flex items-center justify-between"
      >
        <h2 class="font-display text-base text-ink">Recent Inquiries</h2>
        <NuxtLink
          to="/admin/inquiries"
          class="text-xs font-body text-brand hover:underline"
          >View all</NuxtLink
        >
      </div>
      <div v-if="recentInquiries.length === 0" class="px-5 py-8 text-center">
        <p class="font-body text-sm text-ink-muted">No inquiries yet.</p>
      </div>
      <div v-else>
        <div
          v-for="inq in recentInquiries.slice(0, 5)"
          :key="inq.id"
          class="flex items-start gap-3 px-5 py-3 border-b border-surface-3 last:border-0"
        >
          <div
            class="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center shrink-0 mt-0.5"
          >
            <span class="text-xs font-body font-500 text-ink-muted uppercase">{{
              inq.name?.[0] ?? "?"
            }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-body font-500 text-ink">{{ inq.name }}</p>
            <p class="text-xs font-body text-ink-muted line-clamp-1">
              {{ inq.message }}
            </p>
          </div>
          <UBadge
            :label="inq.status"
            :color="inq.status === 'new' ? 'error' : 'neutral'"
            variant="soft"
            size="xs"
            class="font-body shrink-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "admin" });
useSeo({ title: "Admin Overview", noIndex: true });

const { formatPrice } = useListings();
const { authFetch } = useAuth();

const stats = ref<any>(null);
const pendingListings = ref<any[]>([]);
const recentInquiries = ref<any[]>([]);
const approvingId = ref<string | null>(null);

onMounted(async () => {
  const [s, l, i] = await Promise.all([
    authFetch<any>("/api/admin/stats"),
    authFetch<any>("/api/admin/listings", { query: { status: "pending" } }),
    authFetch<any>("/api/admin/inquiries"),
  ]);
  stats.value = s?.data;
  pendingListings.value = l?.data ?? [];
  recentInquiries.value = i?.data ?? [];
});

const statCards = computed(() => [
  {
    label: "Total Listings",
    value: stats.value?.total_listings ?? 0,
    icon: "i-heroicons-tag",
  },
  {
    label: "Active",
    value: stats.value?.active_listings ?? 0,
    icon: "i-heroicons-check-circle",
  },
  {
    label: "Pending",
    value: stats.value?.pending_listings ?? 0,
    icon: "i-heroicons-clock",
  },
  {
    label: "Sold",
    value: stats.value?.sold_listings ?? 0,
    icon: "i-heroicons-banknotes",
  },
  {
    label: "Inquiries",
    value: stats.value?.total_inquiries ?? 0,
    icon: "i-heroicons-chat-bubble-left-ellipsis",
  },
  {
    label: "New Inquiries",
    value: stats.value?.new_inquiries ?? 0,
    icon: "i-heroicons-bell-alert",
  },
  {
    label: "Users",
    value: stats.value?.total_users ?? 0,
    icon: "i-heroicons-users",
  },
  {
    label: "Est. Revenue",
    value: formatPrice(stats.value?.total_revenue_est ?? 0),
    icon: "i-heroicons-banknotes",
  },
]);

const refreshListings = async () => {
  const l = await authFetch<any>("/api/admin/listings", {
    query: { status: "pending" },
  });
  pendingListings.value = l?.data ?? [];
};

const approveListing = async (id: string) => {
  approvingId.value = id;
  try {
    await authFetch(`/api/listings/${id}`, {
      method: "PATCH",
      body: { status: "active" },
    });
    await refreshListings();
  } finally {
    approvingId.value = null;
  }
};

const rejectListing = async (id: string) => {
  await authFetch(`/api/listings/${id}`, {
    method: "PATCH",
    body: { status: "rejected" },
  });
  await refreshListings();
};
</script>
