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
import { useRouter } from 'nuxt/app';
import { onMounted, ref } from 'vue';

definePageMeta({ layout: false });

const supabase = useSupabaseClient();
const { fetchProfile } = useAuth();
const router = useRouter();
 
const status = ref<'loading' | 'success' | 'error'>('loading');
const errorMessage = ref('The confirmation link may have expired. Please try again.');
 
onMounted(async () => {
  // @nuxtjs/supabase exchanges the token from the URL hash automatically.
  // We poll for the session to confirm the exchange completed successfully.
  const MAX_WAIT_MS = 8000;
  const POLL_INTERVAL_MS = 200;
  const start = Date.now();
 
  const waitForSession = async (): Promise<void> => {
    const { data: { session }, error } = await supabase.auth.getSession();
 
    if (error) {
      status.value = 'error';
      errorMessage.value = error.message;
      return;
    }
 
    if (session?.user) {
      // Session confirmed — fetch the profile so isAdmin etc. are available
      await fetchProfile();
      status.value = 'success';
 
      // Small delay so the user sees the success state
      setTimeout(() => router.push('/dashboard'), 1000);
      return;
    }
 
    if (Date.now() - start > MAX_WAIT_MS) {
      status.value = 'error';
      return;
    }
 
    // Not ready yet — poll again
    setTimeout(waitForSession, POLL_INTERVAL_MS);
  };
 
  await waitForSession();
});
</script>
