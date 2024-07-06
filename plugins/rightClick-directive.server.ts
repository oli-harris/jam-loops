import type { Directive } from "vue";

const rightClickDirective: Directive = {};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("rightclick", rightClickDirective);
});
