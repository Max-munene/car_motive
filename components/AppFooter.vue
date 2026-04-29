<!-- components/AppFooter.vue -->
<template>
  <footer class="bg-surface-inv text-white mt-16">
    <div class="container-brim py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <NuxtLink to="/" class="inline-block mb-4">
            <<span class="flex items-center gap-2">
              <BrimLogo  />
              <span class="font-display text-xl text-white tracking-tight"
                >BRIM x Auto</span
              >
            </span>
          </NuxtLink>
          <p class="text-sm font-body text-white/60 leading-relaxed max-w-xs">
            Nairobi's trusted car marketplace. Buy verified vehicles or list
            yours and reach thousands of buyers.
          </p>
          <div class="flex items-center gap-3 mt-5">
            <a
              :href="`https://wa.me/${whatsapp}`"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 text-sm font-body text-white/70 hover:text-white transition-colors"
            >
              <UIcon name="i-heroicons-phone" class="w-4 h-4 text-green-400" />
              WhatsApp Us
            </a>
            <span class="text-white/20">•</span>
            <span class="text-sm font-body text-white/50"
              >Roysambu, Nairobi</span
            >
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4
            class="font-body font-500 text-sm text-white/40 uppercase tracking-wider mb-4"
          >
            Browse
          </h4>
          <ul class="space-y-2">
            <li v-for="link in browseLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm font-body text-white/70 hover:text-white transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4
            class="font-body font-500 text-sm text-white/40 uppercase tracking-wider mb-4"
          >
            Company
          </h4>
          <ul class="space-y-2">
            <li v-for="link in companyLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-sm font-body text-white/70 hover:text-white transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3"
      >
        <p class="text-xs font-body text-white/30">
          &copy; {{ new Date().getFullYear() }} BRIM x Auto. All rights
          reserved.
        </p>
        <p class="text-xs font-body text-white/20">Roysambu, Nairobi, Kenya</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import BrimLogo from './BrimLogo.vue';

const config = useRuntimeConfig();
const whatsapp = config.public.whatsappNumber;

const browseLinks = [
  { to: "/", label: "All Cars" },
  { to: "/compare", label: "Compare Cars" },
  { to: "/list-your-car", label: "List Your Car" },
  { to: "/articles", label: "Car Guides" },
];

const companyLinks = [
  { to: "/about", label: "About BRIM" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
];
</script>
