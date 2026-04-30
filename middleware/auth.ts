/** @format */

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
	// Only run on client — same reason as admin middleware
	if (import.meta.server) return;

	const user = useSupabaseUser();

	if (!user.value) {
		return navigateTo(`/auth/login?redirect=${to.path}`);
	}
});
