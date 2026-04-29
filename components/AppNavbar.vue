<!-- @format -->

<!-- components/AppNavbar.vue -->
<template>
	<header
		class="fixed top-0 inset-x-0 z-50 h-16 bg-surface border-b border-surface-3 flex items-center"
		style="box-shadow: var(--shadow-nav)">
		<div class="container-brim w-full flex items-center justify-between gap-4">
			<!-- Logo -->
			<NuxtLink
				to="/"
				class="shrink-0">
				<span flex class="items-right gap-2 select-none"
					>
					<img
						src="/logo.svg"
						alt="Brim Automotive"
						class="w-20 h-20  flex items-center justify-center text-sm" style="border: 5pt; border-color: var(--color-brand); border-radius: 9999px;"
					 />

					
				</span>
			</NuxtLink>

			<!-- Desktop nav -->
			<nav class="hidden md:flex items-center gap-1">
				<NuxtLink
					v-for="link in navLinks"
					:key="link.to"
					:to="link.to"
					class="px-3 py-1.5 text-sm font-body font-400 text-ink-soft rounded-md transition-colors hover:text-ink hover:bg-surface-2"
					active-class="text-ink bg-surface-2">
					{{ link.label }}
				</NuxtLink>
			</nav>

			<!-- Right side -->
			<div class="flex items-center gap-2">
				<!-- Compare indicator -->
				<NuxtLink
					v-if="count > 0"
					to="/compare"
					class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-surface-3 text-sm font-body text-ink-soft hover:border-brand hover:text-brand transition-colors">
					<UIcon
						name="i-heroicons-squares-plus"
						class="w-4 h-4" />
					Compare ({{ count }})
				</NuxtLink>

				<!-- List your car CTA -->
				<UButton
					to="/list-your-car"
					size="sm"
					class="hidden sm:flex font-body font-400"
					style="background-color: var(--color-brand); color: white">
					List Your Car
				</UButton>

				<!-- Auth -->
				<template v-if="isAuthenticated">
					<UDropdownMenu :items="userMenuItems">
						<UButton
							variant="ghost"
							size="sm"
							class="gap-1.5 font-body">
							<UIcon
								name="i-heroicons-user-circle"
								class="w-5 h-5 text-ink-muted" />
							<span
								class="hidden sm:inline text-sm text-ink-soft max-w-24 truncate">
								{{ profile?.full_name?.split(' ')[0] ?? 'Account' }}
							</span>
							<UIcon
								name="i-heroicons-chevron-down"
								class="w-3 h-3 text-ink-faint" />
						</UButton>
					</UDropdownMenu>
				</template>
				<template v-else>
					<UButton
						to="/auth/login"
						variant="ghost"
						size="sm"
						class="font-body text-ink-soft">
						Sign In
					</UButton>
				</template>

				<!-- Mobile menu -->
				<UButton
					variant="ghost"
					size="sm"
					class="md:hidden"
					@click="mobileOpen = !mobileOpen">
					<UIcon
						:name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
						class="w-5 h-5" />
				</UButton>
			</div>
		</div>

		<!-- Mobile menu -->
		<Transition name="slide-down">
			<div
				v-if="mobileOpen"
				class="absolute top-16 inset-x-0 bg-surface border-b border-surface-3 md:hidden z-40">
				<nav class="container-brim py-4 flex flex-col gap-1">
					<NuxtLink
						v-for="link in navLinks"
						:key="link.to"
						:to="link.to"
						class="px-3 py-2.5 text-sm font-body text-ink-soft rounded-md hover:bg-surface-2 hover:text-ink transition-colors"
						@click="mobileOpen = false">
						{{ link.label }}
					</NuxtLink>
					<div class="border-t border-surface-3 my-2" />
					<UButton
						to="/list-your-car"
						block
						class="font-body font-400"
						style="background-color: var(--color-brand); color: white"
						@click="mobileOpen = false">
						List Your Car
					</UButton>
				</nav>
			</div>
		</Transition>
	</header>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { computed, ref, watch } from 'vue';

const { isAuthenticated, isAdmin, profile, signOut } = useAuth();
const { count } = useComparison();

const mobileOpen = ref(false);

const navLinks = [
	{ to: '/', label: 'Home' },
	{ to: '/cars', label: 'Cars' },
	{ to: '/compare', label: 'Compare' },
	{ to: '/articles', label: 'Guides' },
	{ to: '/about', label: 'About' },
];

const userMenuItems = computed(() => [
	[
		{
			label: profile.value?.full_name ?? 'My Account',
			slot: 'account',
			disabled: true,
		},
	],
	[
		...(isAdmin.value
			? [
					{
						label: 'Admin Panel',
						icon: 'i-heroicons-shield-check',
						to: '/admin',
					},
				]
			: [
					{
						label: 'Dashboard',
						icon: 'i-heroicons-squares-2x2',
						to: '/dashboard',
					},
				]),
		{
			label: 'My Listings',
			icon: 'i-heroicons-tag',
			to: '/dashboard/listings',
		},
		{ label: 'Saved Cars', icon: 'i-heroicons-heart', to: '/dashboard/saved' },
		{ label: 'Profile', icon: 'i-heroicons-user', to: '/dashboard/profile' },
	],
	[
		{
			label: 'Sign Out',
			icon: 'i-heroicons-arrow-right-on-rectangle',
			onSelect: signOut,
		},
	],
]);

// Close mobile on route change
const route = useRoute();
watch(
	() => route.path,
	() => {
		mobileOpen.value = false;
	},
);
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
	transition:
		opacity 0.15s ease,
		transform 0.15s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
