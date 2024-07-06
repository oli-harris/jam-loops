import type { Directive } from "vue";

const rightClickDirective: Directive = {
  mounted(el: HTMLElement, binding) {
    el.oncontextmenu = (event: MouseEvent) => {
      useRightClickStore().rightClick(event, binding.value);
    };
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("rightclick", rightClickDirective);
});
