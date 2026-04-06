<!-- pages/about.vue -->
<template>
  <div class="container-brim py-12 max-w-2xl">
    <h1 class="font-display text-4xl text-ink mb-2">About BRIM</h1>
    <p class="font-body text-ink-muted mb-10">Roysambu, Nairobi · Est. 2024</p>

    <div class="space-y-8 font-body text-sm text-ink-soft leading-relaxed">
      <div>
        <h2 class="font-display text-xl text-ink mb-2">Who we are</h2>
        <p>
          BRIM Automotive is a Nairobi-based car dealership operating from
          Roysambu. We stock a curated selection of quality used vehicles — from
          reliable daily drives to premium SUVs — and sell them through both our
          physical yard and this online platform.
        </p>
      </div>

      <div>
        <h2 class="font-display text-xl text-ink mb-2">
          What makes us different
        </h2>
        <p>
          Every listing on BRIM includes a
          <strong class="text-ink">Market Score</strong> — a transparent pricing
          indicator that tells you whether a car is a good deal, fairly priced,
          or overpriced relative to the Nairobi market. No more guessing.
        </p>
      </div>

      <div>
        <h2 class="font-display text-xl text-ink mb-2">List your car</h2>
        <p>
          We also accept listings from private sellers. Create a free account,
          submit your car, and we'll review and publish it within 24 hours. Your
          Market Score will help you price it right from day one.
        </p>
      </div>

      <div class="p-5 bg-surface-2 rounded-lg border border-surface-3">
        <h3 class="font-display text-base text-ink mb-3">Get in touch</h3>
        <div class="space-y-2">
          <p class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-map-pin"
              class="w-4 h-4 text-ink-faint shrink-0"
            />
            Roysambu, Nairobi, Kenya
          </p>
          <a
            :href="`https://wa.me/${whatsapp}`"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 text-success hover:underline"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left-ellipsis"
              class="w-4 h-4 shrink-0"
            />
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "About BRIM Automotive",
  description:
    "BRIM is a Nairobi car dealership in Roysambu offering verified used vehicles with transparent Market Score pricing.",
});

const config = useRuntimeConfig();
const whatsapp = config.public.whatsappNumber;
</script>
