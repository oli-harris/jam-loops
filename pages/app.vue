<template>
  <!-- Warning if not viewed on a widescreen -->
  <div class="absolute z-50 top-0 left-0 h-screen w-screen flex justify-center items-center bg-stone-950" :class="{hidden: isOnDesktop}">
    <div class="text-xl text-rose-700 font-poppins">This app is desktop only.</div>
  </div>

  <LoopsApp />
</template>

<script lang="ts">
  export default defineComponent({
    data() {
      return {
        isOnDesktop: true,
      }
    },
    mounted() {
      window.addEventListener("resize", this.handleResize);
    },
    methods: {
      handleResize() {
        this.isOnDesktop = (window.innerWidth / window.innerHeight > 1)
      },
      beat() {
        
      }
    }
  });
</script>
