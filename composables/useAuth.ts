/** @format */

// composables/useAuth.ts
// Profile is always fetched directly from Supabase client — never via server API.
// Server API routes are only used for writes (POST, PATCH, DELETE).
import type { Profile, UserRole } from '~/types';

export const useAuth = () => {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();

	const profile = useState<Profile | null>('auth:profile', () => null);
	const profileLoading = useState<boolean>('auth:profileLoading', () => false);

	const isAuthenticated = computed(() => !!user.value);
	const isAdmin = computed(() => profile.value?.role === 'admin');
	const isSeller = computed(
		() => !!user.value && profile.value?.role !== 'guest',
	);

	// Direct Supabase client query — session is in localStorage, always available.
	const fetchProfile = async () => {
		if (!user.value?.id) {
			profile.value = null;
			return;
		}
		profileLoading.value = true;
		try {
			const { data } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.value.id)
				.single();
			if (data) profile.value = data as Profile;
		} catch {
			profile.value = null;
		} finally {
			profileLoading.value = false;
		}
	};

	// Returns the current access token for passing to server API routes
	const getAccessToken = async (): Promise<string | null> => {
		const { data } = await supabase.auth.getSession();
		return data.session?.access_token ?? null;
	};

	// Authenticated $fetch — passes Bearer token so server routes can verify user
	const authFetch = async <T>(url: string, options: any = {}): Promise<T> => {
		const token = await getAccessToken();
		return $fetch<T>(url, {
			...options,
			headers: {
				...options.headers,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		});
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
		if (data.user) {
			const { data: prof } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', data.user.id)
				.single();
			if (prof) profile.value = prof as Profile;
		}
		return { session: data.session, profile: profile.value };
	};

	const signUp = async (email: string, password: string, fullName: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName } },
		});
		if (error) throw error;
		return data;
	};

	const signOut = async () => {
		await supabase.auth.signOut();
		profile.value = null;
		await navigateTo('/');
	};

	const resetPassword = async (email: string) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${useRuntimeConfig().public.siteUrl}/auth/reset-password`,
		});
		if (error) throw error;
	};

	const updatePassword = async (newPassword: string) => {
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		if (error) throw error;
	};

	const requireAuth = async (role?: UserRole) => {
		if (!user.value) {
			await navigateTo('/auth/login');
			return false;
		}
		if (role === 'admin' && !isAdmin.value) {
			await navigateTo('/');
			return false;
		}
		return true;
	};

	return {
		user,
		profile,
		profileLoading,
		isAuthenticated,
		isAdmin,
		isSeller,
		fetchProfile,
		getAccessToken,
		authFetch,
		signIn,
		signUp,
		signOut,
		resetPassword,
		updatePassword,
		requireAuth,
	};
};
