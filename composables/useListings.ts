/** @format */

// composables/useListings.ts
import type {
	CarListing,
	CarListingCard,
	ListingFilters,
	ApiResponse,
} from '~/types';

export const useListings = () => {
	// ── Fetch listings with filters ──────────────────────────
	const fetchListings = async (filters: ListingFilters = {}) => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([k, v]) => {
			if (v !== undefined && v !== '' && v !== null) params.set(k, String(v));
		});
		return await $fetch<ApiResponse<CarListingCard[]>>(
			`/api/listings?${params.toString()}`,
		);
	};

	// ── Fetch single listing ──────────────────────────────────
	const fetchListing = async (id: string) => {
		return await $fetch<ApiResponse<CarListing>>(`/api/listings/${id}`);
	};

	// ── Create listing ────────────────────────────────────────
	const createListing = async (payload: Partial<CarListing>) => {
		return await $fetch<ApiResponse<CarListing>>('/api/listings', {
			method: 'POST',
			body: payload,
		});
	};

	// ── Update listing ────────────────────────────────────────
	const updateListing = async (id: string, payload: Partial<CarListing>) => {
		return await $fetch<ApiResponse<CarListing>>(`/api/listings/${id}`, {
			method: 'PATCH',
			body: payload,
		});
	};

	// ── Delete listing ────────────────────────────────────────
	const deleteListing = async (id: string) => {
		return await $fetch<ApiResponse<null>>(`/api/listings/${id}`, {
			method: 'DELETE',
		});
	};

	// ── Format helpers ────────────────────────────────────────
	const formatPrice = (price: number): string => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	const formatMileage = (km: number): string => {
		return new Intl.NumberFormat('en-KE').format(km) + ' km';
	};

	const marketScoreLabel = (score: string | null): string => {
		const map: Record<string, string> = {
			good_deal: 'Good Deal',
			fair_price: 'Fair Price',
			overpriced: 'Overpriced',
		};
		return score ? (map[score] ?? '') : '';
	};

	const marketScoreClass = (score: string | null): string => {
		const map: Record<string, string> = {
			good_deal: 'badge-good-deal',
			fair_price: 'badge-fair-price',
			overpriced: 'badge-overpriced',
		};
		return score ? (map[score] ?? '') : '';
	};

	const primaryImage = (listing: CarListingCard | CarListing): string => {
		if ('primary_image' in listing && listing.primary_image)
			return listing.primary_image;
		if (listing.car_images && listing.car_images.length > 0) {
			const primary = listing.car_images.find((i) => i.is_primary);
			return (
				primary?.url ?? listing.car_images[0]?.url ?? '/placeholder-car.jpg'
			);
		}
		return '/placeholder-car.jpg';
	};

	return {
		fetchListings,
		fetchListing,
		createListing,
		updateListing,
		deleteListing,
		formatPrice,
		formatMileage,
		marketScoreLabel,
		marketScoreClass,
		primaryImage,
	};
};
