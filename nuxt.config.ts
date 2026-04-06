// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@vueuse/nuxt",
  ],

  // ── Supabase ──────────────────────────────────────────────
  // No useSsrCookies — session lives in localStorage on the client.
  // All profile/saved queries use useSupabaseClient() directly.
  // Server API routes use the service role key which bypasses auth entirely.
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/confirm",
      exclude: [
        "/",
        "/cars",
        "/cars/*",
        "/articles",
        "/articles/*",
        "/compare",
        "/privacy",
        "/terms",
        "/about",
        "/list-your-car",
        "/auth/register",
        "/auth/forgot-password",
      ],
    },
  },

  // ── Nuxt UI ───────────────────────────────────────────────
  ui: {
    colorMode: false,
    colors: {
      primary: "red",
      neutral: "stone",
    },
  },

  // ── CSS / Fonts ───────────────────────────────────────────
  css: ["~/assets/css/main.css"],

  // ── App Head ──────────────────────────────────────────────
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "BRIM Automotive — Buy & Sell Cars in Kenya",
      titleTemplate: "%s | BRIM Automotive",
      meta: [
        {
          name: "description",
          content:
            "Browse verified used cars for sale in Nairobi, Kenya. Compare vehicles, check market pricing, and buy or sell with confidence at BRIM Automotive.",
        },
        {
          name: "keywords",
          content:
            "cars for sale kenya, buy car nairobi, used cars kenya, toyota fielder kenya, car yard roysambu",
        },
        { name: "author", content: "BRIM Automotive" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "BRIM Automotive" },
        {
          property: "og:title",
          content: "BRIM Automotive — Buy & Sell Cars in Kenya",
        },
        {
          property: "og:description",
          content:
            "Browse verified used cars in Nairobi. Market Score tells you if a price is fair before you commit.",
        },
        { property: "og:image", content: "/og-image.jpg" },
        { property: "og:url", content: "https://brimautomotive.co.ke" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "BRIM Automotive" },
        {
          name: "twitter:description",
          content:
            "Buy and sell cars in Kenya — verified listings with Market Score pricing.",
        },
        { name: "twitter:image", content: "/og-image.jpg" },
        { name: "theme-color", content: "#1a1614" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap",
        },
      ],
    },
  },

  // ── Sitemap ───────────────────────────────────────────────
  sitemap: {
    hostname: "https://brimautomotive.co.ke",
    routes: [
      "/",
      "/cars",
      "/compare",
      "/articles",
      "/about",
      "/privacy",
      "/terms",
      "/list-your-car",
    ],
  },

  // ── Robots ────────────────────────────────────────────────
  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/auth"],
      },
    ],
    sitemap: "https://brimautomotive.co.ke/sitemap.xml",
  },

  // ── Runtime Config ────────────────────────────────────────
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      whatsappNumber: process.env.WHATSAPP_NUMBER || "254796314445",
      siteUrl: process.env.SITE_URL || "https://brimautomotive.co.ke",
    },
  },

  // ── TypeScript ────────────────────────────────────────────
  typescript: {
    strict: true,
    typeCheck: false,
  },
});
