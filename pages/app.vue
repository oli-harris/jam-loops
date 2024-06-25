<template>
  <!-- Warning if not viewed on a widescreen -->
  <div
    class="absolute left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-stone-950"
    :class="{ hidden: isOnDesktop }"
  >
    <div class="font-poppins text-xl text-rose-700">
      This app is desktop only.
    </div>
  </div>

  <LoopsApp />
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
      this.isOnDesktop = window.innerWidth / window.innerHeight > 1;
    },
    beat() {},
  },
});
</script>
