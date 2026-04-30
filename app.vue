<!-- app.vue -->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
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
</script>