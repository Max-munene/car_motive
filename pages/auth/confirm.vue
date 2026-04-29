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
import { watch } from 'vue';

definePageMeta({ layout: false });

const router = useRouter();
const user = useSupabaseUser();

watch(user, (u) => {
  // only redirect once Supabase has a confirmed user
  if (u?.email_confirmed_at) {
    router.push("/dashboard");
  }
});

// fallback (optional): if nothing happens after some time
setTimeout(() => {
  if (!user.value) {
    router.push("/auth/login");
  }
}, 5000);
</script>
