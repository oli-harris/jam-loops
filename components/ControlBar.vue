<template>
  <div class="grid grid-cols-3 items-center px-6 py-3 font-poppins">
    <div class="flex flex-row items-center justify-self-start">
      <MetaAnimateHover :animateOnStart="true" :loop="true" animation="animate__rubberBand">
        <div class="mr-4 cursor-default text-5xl font-black text-rose-600">JAM</div>
      </MetaAnimateHover>
      <div class="text-lg text-rose-600">My Project</div>
    </div>
    <div class="justify-self-center text-rose-100">
      <div class="flex flex-row gap-3">
        <div>120bpm</div>
        <div>Metranome</div>
        <div>|</div>
        <div @click="togglePlay">Play</div>
        <div>Volume</div>
      </div>
    </div>
    <div class="justify-self-end text-rose-700">Saved ✓</div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      playing: false,
      controllerStore: useControllerStore(),
    };
  },
  methods: {
    togglePlay() {
      if (this.controllerStore.playing) return this.controllerStore.stop();

      this.controllerStore.play();
    },
  },
});
</script>
