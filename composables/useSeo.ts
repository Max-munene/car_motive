/** @format */

// composables/useSeo.ts

interface SeoOptions {
	title: string;
	description?: string;
	image?: string;
	url?: string;
	type?: 'website' | 'article';
	noIndex?: boolean;
}

export const useSeo = (options: SeoOptions) => {
	const config = useRuntimeConfig();
	const route = useRoute();

	const siteUrl = config.public.siteUrl as string;
	const defaultImage = `${siteUrl}/og-image.jpg`;
	const pageUrl = `${siteUrl}${route.path}`;

	const title = options.title.includes('BRIM')
		? options.title
		: `${options.title} | BRIM Automotive`;

	const description =
		options.description ??
		'Browse verified used cars for sale in Nairobi, Kenya. Market Score pricing on every listing.';

	const image = options.image ?? defaultImage;
	const url = options.url ?? pageUrl;

	useHead({
		title,
		meta: [
			{ name: 'description', content: description },
			// OG
			{ property: 'og:title', content: title },
			{ property: 'og:description', content: description },
			{ property: 'og:image', content: image },
			{ property: 'og:url', content: url },
			{ property: 'og:type', content: options.type ?? 'website' },
			// Twitter
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
			{ name: 'twitter:image', content: image },
			// Robots
			...(options.noIndex
				? [{ name: 'robots', content: 'noindex,nofollow' }]
				: []),
		],
		link: [{ rel: 'canonical', href: url }],
	});
};
