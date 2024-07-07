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
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  plugins: [
    { src: "~/plugins/rightClick-directive.client.ts", mode: "client" },
    { src: "~/plugins/rightClick-directive.server.ts", mode: "server" },
  ],
  modules: [
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon",
  ],
  googleFonts: {
    families: {
      "Rubik Mono One": true, // Bug with google-fonts, { text: "JAM" } gives 400
      Rubik: [300, 400, 500, 600, 700, 800, 900],
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.URL,
    },
  },
  ssr: false,
});
