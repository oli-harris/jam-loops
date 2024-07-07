<template>
  <!-- Warning if not viewed on a widescreen -->
  <div
    class="absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-stone-950"
    :class="{ hidden: isOnDesktop }"
  >
    <div class="font-poppins text-xl text-rose-700">This app is desktop only.</div>
  </div>

  <JamApp />
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      isOnDesktop: true,
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      // this.isOnDesktop = window.innerWidth / window.innerHeight > 1;
    },
    beat() {},
  },
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
