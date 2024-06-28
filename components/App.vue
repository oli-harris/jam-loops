<template>
  <div class="flex h-screen select-none flex-col overflow-hidden font-poppins">
    <header class="bg-stone-950">
      <ControlBar />
    </header>

    <div class="flex h-full flex-1">
      <aside class="w-[66] border-r-2 border-rose-950 bg-stone-950">
        <SidebarMain />
      </aside>

      <main class="flex-1 border-t-2 border-rose-950 bg-stone-900">
        <LoopsViewer />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Tone } from "tone/build/esm/core/Tone";

export default defineComponent({
  data() {
    return {
      loopsStore: useLoopsStore(),
      controlStore: useControllerStore(),
    };
  },
  mounted() {
    this.saturateLoops();
    this.inititate();
  },
  methods: {
    saturateLoops() {
      this.loopsStore.addEmptyLoop("Drums", 8, 2);
      this.loopsStore.addEmptyLoop("Hihats", 3, 3);
      this.loopsStore.addEmptyLoop("Glorbs", 5, 1);
    },
    inititate() {
      // On play
      watch(
        () => this.controlStore.playing,
        (newValue: boolean, oldValue: boolean) => {
          if (newValue && newValue != oldValue) this.controlStore.play();
          if (!newValue && newValue != oldValue) this.controlStore.stop();
        },
      );
    },
  },
});
</script>
