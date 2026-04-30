<!-- app.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useAuth } from './composables/useAuth';
import { se } from 'date-fns/locale';

const { user, fetchProfile } = useAuth();
const { fetchSavedIds } = useSavedCars();

if (import.meta.client) {
  onMounted( () => {
    const supabase = useSupabaseClient(); 
    supabase.auth.onAuthStateChange(async(_: any, session: { user: any; }) => {
      if (session?.user) {
        await fetchProfile();
        await fetchSavedIds();
      }
    });
   
  });

  watch(user, async (u) => {
    if (u) {
      await fetchProfile();
      await fetchSavedIds();
    }
  });
}
</script>

<!-- <script setup lang="ts">
const { user, fetchProfile } = useAuth();
const { fetchSavedIds } = useSavedCars();

// Run only on client — avoids SSR hydration race where user.value is undefined
onMounted(async () => {
  if (user.value) {
    await fetchProfile();
    await fetchSavedIds();
  }
});

// Re-fetch whenever auth state changes (after login or logout)
watch(user, async (u) => {
  if (u) {
    await fetchProfile();
    await fetchSavedIds();
  }
});
</script> -->
