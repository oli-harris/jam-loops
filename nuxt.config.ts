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
  plugins: [
    { src: "~/plugins/rightClick-directive.client.ts", mode: "client" },
    { src: "~/plugins/rightClick-directive.server.ts", mode: "server" },
  ],
  modules: [
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon"
  ],
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