/** @format */

// server/api/user/listings.get.ts
import { createError } from 'nuxt/app';
import { useServerSupabase, getServerUser } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
	const supabase = useServerSupabase();
	const user = await getServerUser(event);
	if (!user?.id)
		throw createError({ statusCode: 401, message: 'Unauthorized' });

	const { data, error } = await supabase
		.from('car_listings')
		.select(`*, car_images ( id, url, is_primary, sort_order )`)
		.eq('seller_id', user.id)
		.order('created_at', { ascending: false });

	if (error) throw createError({ statusCode: 500, message: error.message });

	const listings = (data ?? []).map((l: any) => {
		const images = l.car_images ?? [];
		const primary = images.find((i: any) => i.is_primary) ?? images[0];
		return { ...l, primary_image: primary?.url ?? null };
	});

	return { data: listings, error: null };
});
