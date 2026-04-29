<!-- pages/index.vue -->
<template>
  <div>
    <!-- Search hero -->
    <section class="bg-surface border-b border-surface-3 py-8">
      <div class="container-brim">
        <div class="max-w-2xl">
          <h1 class="font-display text-3xl sm:text-4xl text-ink leading-tight">
            Buy Cars With Confidence,<br />
            <span style="color: var(--color-brand)">not Guesswork.</span>
          </h1>
          <p class="font-body text-ink-muted mt-2 text-base">
            {{ total }} verified listings — with Market Score pricing on every
            car.
          </p>
        </div>

        <!-- Search bar -->
        <div class="mt-6 flex gap-2 max-w-xl">
          <div class="flex-1 relative">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint pointer-events-none"
            />
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search make, model, colour..."
              class="w-full pl-9 pr-4 py-2.5 text-sm font-body bg-surface border border-surface-3 rounded-md focus:outline-none focus:border-brand text-ink placeholder:text-ink-faint transition-colors"
              @keydown.enter="applySearch"
            />
          </div>
          <UButton
            size="md"
            class="font-body font-400 shrink-0"
            style="background-color: var(--color-brand); color: white"
            @click="applySearch"
          >
            Search
          </UButton>
        </div>

        <!-- Active filter chips -->
        <div
          v-if="activeFilterChips.length > 0"
          class="flex flex-wrap gap-2 mt-4"
        >
          <span
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-surface-3 text-xs font-body text-ink-soft bg-surface"
          >
            {{ chip.label }}
            <button
              @click="removeChip(chip.key)"
              class="hover:text-brand transition-colors"
            >
              <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
            </button>
          </span>
          <button
            class="text-xs font-body text-ink-faint hover:text-brand transition-colors"
            @click="clearAllFilters"
          >
            Clear all
          </button>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <div class="container-brim py-8">
      <div class="flex gap-8">
        <!-- Filters sidebar - desktop -->
        <aside class="hidden lg:block w-56 shrink-0">
          <div class="sticky top-20">
            <ListingFilters v-model="filters" />
          </div>
        </aside>

        <!-- Listings grid -->
        <div class="flex-1 min-w-0">
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-5 gap-4">
            <p class="text-sm font-body text-ink-muted">
              <span v-if="!pending"
                >{{ total }} car{{ total !== 1 ? "s" : "" }} found</span
              >
              <span v-else>Loading...</span>
            </p>
            <div class="flex items-center gap-3">
              <!-- Mobile filters -->
              <UButton
                variant="outline"
                size="sm"
                class="lg:hidden font-body"
                @click="mobileFiltersOpen = true"
              >
                <UIcon name="i-heroicons-funnel" class="w-4 h-4" />
                Filters
              </UButton>

              <!-- Sort -->
              <USelect
                v-model="filters.sort"
                :items="sortOptions"
                size="sm"
                class="font-body w-40"
              />
            </div>
          </div>

          <!-- Grid -->
          <div
            v-if="pending"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <div
              v-for="i in 6"
              :key="i"
              class="bg-surface-2 rounded-lg aspect-[4/5] img-shimmer"
            />
          </div>

          <div
            v-else-if="listings.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <CarCard
              v-for="listing in listings"
              :key="listing.id"
              :listing="listing"
            />
          </div>

          <div v-else class="text-center py-20">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-10 h-10 text-ink-faint mx-auto mb-3"
            />
            <p class="font-display text-xl text-ink-soft">No cars found</p>
            <p class="font-body text-sm text-ink-faint mt-1">
              Try adjusting your search or filters.
            </p>
            <UButton
              variant="ghost"
              class="mt-4 font-body text-brand"
              @click="clearAllFilters"
            >
              Clear filters
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile filters drawer -->
    <USlideover
      v-model:open="mobileFiltersOpen"
      side="left"
      :ui="{ width: 'max-w-xs' }"
    >
      <template #content>
        <div class="p-6 overflow-y-auto h-full">
          <ListingFilters
            v-model="filters"
            @apply="mobileFiltersOpen = false"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { ListingFilters, CarListingCard } from "~/types";

useSeo({
  title: "BRIM Automotive — Buy & Sell Cars in Nairobi, Kenya",
  description:
    "Browse verified used cars for sale in Nairobi. Market Score shows if a price is fair before you buy.",
});

const filters = ref<ListingFilters>({ sort: "newest", page: 1, limit: 12 });
const searchInput = ref("");
const mobileFiltersOpen = ref(false);
const total = ref(0);

// Native debounce — no VueUse dependency needed
const queryParams = ref<Record<string, any>>({});

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const buildQuery = (f: ListingFilters): Record<string, any> => {
  const q: Record<string, any> = {};
  if (f.search) q.search = f.search;
  if (f.make) q.make = f.make;
  if (f.model) q.model = f.model;
  if (f.body_type) q.body_type = f.body_type;
  if (f.transmission) q.transmission = f.transmission;
  if (f.fuel_type) q.fuel_type = f.fuel_type;
  if (f.market_score) q.market_score = f.market_score;
  if (f.price_min) q.price_min = f.price_min;
  if (f.price_max) q.price_max = f.price_max;
  if (f.year_min) q.year_min = f.year_min;
  if (f.year_max) q.year_max = f.year_max;
  if (f.sort) q.sort = f.sort;
  q.page = f.page ?? 1;
  q.limit = f.limit ?? 12;
  return q;
};

// Initialise query params immediately
queryParams.value = buildQuery(filters.value);

watch(
  filters,
  (f) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      queryParams.value = buildQuery(f);
    }, 350);
  },
  { deep: true },
);

const { data: res, pending } = await useLazyFetch("/api/listings", {
  query: queryParams,
});

const listings = computed<CarListingCard[]>(
  () => (res.value as any)?.data ?? [],
);
watch(res, (v) => {
  if (v) total.value = (v as any).total ?? listings.value.length;
});

// Search
const applySearch = () => {
  filters.value = { ...filters.value, search: searchInput.value, page: 1 };
};

// Filter chips
const activeFilterChips = computed(() => {
  const chips: { key: string; label: string }[] = [];
  const f = filters.value;
  if (f.search) chips.push({ key: "search", label: `"${f.search}"` });
  if (f.make) chips.push({ key: "make", label: f.make! });
  if (f.body_type) chips.push({ key: "body_type", label: f.body_type! });
  if (f.transmission)
    chips.push({ key: "transmission", label: f.transmission! });
  if (f.fuel_type) chips.push({ key: "fuel_type", label: f.fuel_type! });
  if (f.market_score)
    chips.push({
      key: "market_score",
      label: f.market_score!.replace("_", " "),
    });
  if (f.price_min || f.price_max)
    chips.push({
      key: "price",
      label: `KES ${f.price_min ?? 0}–${f.price_max ?? "∞"}`,
    });
  if (f.year_min || f.year_max)
    chips.push({
      key: "year",
      label: `${f.year_min ?? ""}–${f.year_max ?? ""}`,
    });
  return chips;
});

const removeChip = (key: string) => {
  const f = { ...filters.value } as any;
  if (key === "price") {
    f.price_min = undefined;
    f.price_max = undefined;
  } else if (key === "year") {
    f.year_min = undefined;
    f.year_max = undefined;
  } else f[key] = "";
  f.page = 1;
  filters.value = f;
};

const clearAllFilters = () => {
  filters.value = { sort: "newest", page: 1, limit: 12 };
  searchInput.value = "";
};

const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Price: Low to high", value: "price_asc" },
  { label: "Price: High to low", value: "price_desc" },
  { label: "Lowest mileage", value: "mileage_asc" },
];
</script>
