/** @format */

// server/api/listings/index.post.ts
import { createError } from 'nuxt/app';
import { useServerSupabase, getServerUser } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
	const supabase = useServerSupabase();
	const user = await getServerUser(event);

	if (!user) {
		throw createError({ statusCode: 401, message: 'Unauthorized' });
	}

	const body = await readBody(event);

	// Compute market score via DB function
	const { data: scoreData } = await supabase.rpc('compute_market_score', {
		p_make: body.make,
		p_model: body.model,
		p_year: body.year,
		p_price: body.price,
	});

	const payload = {
		seller_id: user.id,
		title: body.title,
		make: body.make,
		model: body.model,
		year: body.year,
		price: body.price,
		mileage: body.mileage,
		engine_size: body.engine_size ?? null,
		transmission: body.transmission,
		fuel_type: body.fuel_type,
		drive_type: body.drive_type ?? '2WD',
		color: body.color ?? null,
		body_type: body.body_type ?? null,
		condition: body.condition ?? 'foreign used',
		description: body.description ?? null,
		location: body.location ?? 'Nairobi',
		market_score: scoreData ?? 'fair_price',
		status: 'pending', // Always pending until admin approves
	};

	const { data, error } = await supabase
		.from('car_listings')
		.insert({
			payload,
			body,
			seller_id: user.id, // REQUIRED FIX
		})
		.select()
		.maybesingle();

	if (error) {
		throw createError({ statusCode: 500, message: error.message });
	}

	return { data, error: null };
});
