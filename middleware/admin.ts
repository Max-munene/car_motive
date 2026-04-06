// middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  // Only run on client — Supabase session lives in localStorage, not available on server.
  // During SSR we let the page render; the page itself calls authFetch on mount
  // which will 401 if the user is not admin.
  if (import.meta.server) return;

  const user = useSupabaseUser();
  const { profile } = useAuth();

  if (!user.value) {
    return navigateTo("/auth/login");
  }

  // Profile loaded and not admin — redirect away
  if (profile.value && profile.value.role !== "admin") {
    return navigateTo("/");
  }

  // Profile not loaded yet — let the page render and mount.
  // The page's onMounted + authFetch will handle auth naturally.
});
