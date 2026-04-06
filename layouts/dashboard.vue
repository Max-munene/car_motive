<!-- layouts/dashboard.vue -->
<template>
  <div class="min-h-screen bg-surface-2 flex flex-col">
    <AppNavbar />
    <div class="flex-1 pt-nav">
      <div class="container-brim py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar -->
          <aside class="w-full lg:w-56 shrink-0">
            <nav
              class="bg-surface rounded-lg border border-surface-3 overflow-hidden"
            >
              <div class="px-4 py-4 border-b border-surface-3">
                <p
                  class="text-xs font-body font-500 uppercase tracking-wider text-ink-faint"
                >
                  {{ inAdminSection ? "Admin Panel" : "My Account" }}
                </p>
              </div>
              <ul class="py-2">
                <li v-for="link in navLinks" :key="link.to">
                  <NuxtLink
                    :to="link.to"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
                    active-class="bg-brand-subtle text-brand font-500"
                  >
                    <UIcon :name="link.icon" class="w-4 h-4 shrink-0" />
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </aside>
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAdmin } = useAuth();
const route = useRoute();

// Use current route path to determine which sidebar to show.
// This is reliable even before profile loads, because admins
// are always on /admin/* routes and sellers on /dashboard/*.
const inAdminSection = computed(() => route.path.startsWith("/admin"));

const sellerLinks = [
  { to: "/dashboard", icon: "i-heroicons-squares-2x2", label: "Overview" },
  { to: "/dashboard/listings", icon: "i-heroicons-tag", label: "My Listings" },
  {
    to: "/dashboard/inquiries",
    icon: "i-heroicons-chat-bubble-left-ellipsis",
    label: "Inquiries",
  },
  { to: "/dashboard/saved", icon: "i-heroicons-heart", label: "Saved Cars" },
  { to: "/dashboard/profile", icon: "i-heroicons-user", label: "Profile" },
];

const adminLinks = [
  { to: "/admin", icon: "i-heroicons-squares-2x2", label: "Overview" },
  { to: "/admin/listings", icon: "i-heroicons-tag", label: "All Listings" },
  {
    to: "/admin/inquiries",
    icon: "i-heroicons-chat-bubble-left-ellipsis",
    label: "Inquiries",
  },
  { to: "/admin/users", icon: "i-heroicons-users", label: "Users" },
  {
    to: "/admin/articles",
    icon: "i-heroicons-document-text",
    label: "Articles",
  },
];

// Route-based: if on /admin/*, show admin links regardless of profile load state
const navLinks = computed(() =>
  inAdminSection.value ? adminLinks : sellerLinks,
);
</script>
