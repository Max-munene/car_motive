/** @format */

// /** @format */

// // server/utils/supabase.ts
// import { createClient } from '@supabase/supabase-js';
// import { serverSupabaseUser } from '#supabase/server';

// // Service-role client — bypasses RLS entirely.
// // Used for all server-side DB operations.
// export const useServerSupabase = () => {
// 	const config = useRuntimeConfig();
// 	return createClient(config.public.supabaseUrl, config.supabaseServiceKey, {
// 		auth: { persistSession: false },
// 	});
// };

// // Read authenticated user from the request.
// // Works for browser-initiated requests (button clicks, form submits)
// // where the browser sends the Supabase auth cookie automatically.
// // NOT reliable for $fetch calls during SSR — avoid those entirely.
// export const getServerUser = async (event: any) => {
// 	try {
// 		const user = await serverSupabaseUser(event);
// 		if (user?.id) return user;
// 	} catch {}

// 	// Fallback: read JWT from Authorization header (sent by $fetch on client)
// 	try {
// 		const supabase = useServerSupabase();
// 		const authHeader = getRequestHeader(event, 'authorization') ?? '';
// 		const token = authHeader.replace('Bearer ', '').trim();
// 		if (!token) return null;
// 		const {
// 			data: { user },
// 		} = await supabase.auth.getUser(token);
// 		if (user?.id) return user;
// 	} catch {}

// 	return null;
// };

// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export const useServerSupabase = (event: any) => {
	const config = useRuntimeConfig(event);

	return createClient(config.public.supabaseUrl, config.supabaseServiceKey, {
		auth: { persistSession: false },
	});
};

export const getServerUser = async (event: any) => {
	try {
		const user = await serverSupabaseUser(event);
		if (user?.id) return user;
	} catch {}

	try {
		const supabase = useServerSupabase(event); // ✅ pass event
		const authHeader = getRequestHeader(event, 'authorization') ?? '';
		const token = authHeader.replace('Bearer ', '').trim();
		if (!token) return null;

		const {
			data: { user },
		} = await supabase.auth.getUser(token);

		if (user?.id) return user;
	} catch {}

	return null;
};
