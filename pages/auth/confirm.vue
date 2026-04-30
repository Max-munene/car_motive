<!-- pages/auth/confirm.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-ink-faint mx-auto mb-3 animate-spin"
      />
      <p class="font-body text-sm text-ink-muted">Confirming your account...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const router = useRouter();

onMounted(async () => {
  // Supabase handles the token in the URL automatically via @nuxtjs/supabase
  // Redirect after a short delay
  setTimeout(() => router.push("/dashboard"), 1500);
});
</script>