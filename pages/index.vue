<template>
  <div class="bg-background min-h-screen">
    <Navbar />

    <section class="relative min-h-[95vh] flex items-center overflow-hidden border-b border-surface-3">
      <div class="absolute inset-0 ">
        <img :src="heroImage"
          alt="Luxury car"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-linear-to-b from-black/50 via-black/70 to-white/100" />
      </div>

      <div class="relative z-10 container mx-auto px-6 py-24 text-center">
        <div class="max-w-4xl mx-auto space-y-8">
          <h1 class="font-display text-4xl md:text-7xl font-700 tracking-tight " style="color: white;">
            Buy Cars With 
            <span :style="{ color: 'var(--color-brand)' }">Confidence</span>, Not Guesswork
          </h1>


          <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <UButton
              to="/cars"
              size="xl"
              class="font-body font-500 px-8 flex items-center justify-center"
              :style="{ backgroundColor: 'var(--color-brand)', color: 'white' }"
            >
              Explore Listings
              <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5" />
            </UButton>

           
          </div>
          
          <p class="font-body text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Verified listings, real market pricing, and tools built for smart car buyers across Nairobi.
          </p>
        </div>
      </div>
    </section>

    <section class="py-24 bg-surface-2/50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="font-display text-3xl md:text-4xl text-ink">Why BrimXAuto?</h2>
          <p class="font-body text-ink-muted max-w-xl mx-auto mt-3">
            A modern car marketplace built on transparency and trust.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(prop, idx) in valueProps"
            :key="idx"
            class="group rounded-xl border border-surface-3 bg-surface p-8 shadow-card transition-all hover:-translate-y-1"
          >
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
              :style="{ backgroundColor: 'rgba(var(--color-brand-rgb), 0.1)' }"
            >
              <UIcon :name="prop.icon" class="w-6 h-6" :style="{ color: 'var(--color-brand)' }" />
            </div>
            <h3 class="font-display text-lg text-ink mb-2">{{ prop.title }}</h3>
            <p class="font-body text-sm text-ink-muted leading-relaxed">
              {{ prop.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24">
      <div class="container mx-auto px-6">
        <div class="flex items-end justify-between mb-12 gap-4">
          <div>
            <h2 class="font-display text-3xl md:text-4xl text-ink">Featured Listings</h2>
            <p class="font-body text-ink-muted mt-2">
              Cars with strong value and excellent market positioning
            </p>
          </div>

          <UButton
            to="/cars"
            variant="ghost"
            class="font-body text-ink-muted hover:text-brand"
          >
            View all <UIcon name="i-heroicons-chevron-right" class="ml-1 w-4 h-4" />
          </UButton>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="h-64 bg-surface-2 rounded-xl img-shimmer" />
        </div>

        <div v-else-if="featuredListings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CarCard
            v-for="car in featuredListings"
            :key="car.id"
            :car="car"
          />
        </div>

       
      </div>
    </section>

    <Newsletter />
    <Footer />

   
  </div>
</template>

<script setup lang="ts">
import { useFetch } from "nuxt/app";
import { computed, ref } from "vue";
// import { sampleCars } from "@/data/sampleCars";

// Nuxt 3 auto-imports ref, computed, and useSeo
useSeo({ title: "BrimXAuto - Buy Cars with Confidence" });

const heroImage = 'hero-car.jpg';

const featuredQuery = ref({
  sort: 'newest',
  limit: 6,
  page: 1
});

const { data: res, pending } = await useFetch('/api/listings', {
  query: featuredQuery,
});

const featuredListings = computed(() => (res.value as any)?.data ?? []);


// const isSignupOpen = ref(false);
const loading = ref(false); // Simulate loading if needed

const valueProps = [
  {
    icon: "i-heroicons-shield-check",
    title: "Verified Listings",
    description: "Every vehicle is reviewed for accuracy, history, and legitimacy.",
  },
  {
    icon: "i-heroicons-chart-bar",
    title: "Market Reality Scores",
    description: "Instant price intelligence based on similar cars in your area.",
  },
  {
    icon: "i-heroicons-map-pin",
    title: "Local & Import Ready",
    description: "Browse local inventory or explore clean import options transparently.",
  },
  {
    icon: "i-heroicons-bell",
    title: "Smart Deal Alerts",
    description: "Be first to know when high-value deals hit the market.",
  },
];
</script>