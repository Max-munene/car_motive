/** @format */

import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

// middleware/admin.ts
export default defineNuxtRouteMiddleware(async () => {
	// Only run on client — Supabase session lives in localStorage, not available on server.
	// During SSR we let the page render; the page itself calls authFetch on mount
	// which will 401 if the user is not admin.
	if (import.meta.server) return;

	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const { profile, fetchProfile } = useAuth();

	// 1. Not logged in at all → send to login
	if (!user.value) {
		return navigateTo('/auth/login');
	}

	// 2. Profile already loaded → check role immediately
	if (profile.value) {
		if (profile.value.role !== 'admin') {
			return navigateTo('/');
		}
		return; // ✅ admin — allow
	}

	// 3. Profile not loaded yet — fetch it from Supabase now.
	//    This handles a hard refresh on an /admin page where useState is empty.
	await fetchProfile();

	if (!profile.value || profile.value.role !== 'admin') {
		return navigateTo('/');
	}

	// ✅ Confirmed admin — allow navigation
});
function useSupabaseUser() {
	throw new Error('Function not implemented.');
}

function useAuth(): { profile: any; fetchProfile: any } {
	throw new Error('Function not implemented.');
}

function useSupabaseClient() {
	throw new Error('Function not implemented.');
}
