// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@nuxtjs/google-fonts", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  googleFonts: {
    families: {
      Kanit: true,
      Poppins: true,
      Raleway: true,
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.URL,
    },
  },
});
