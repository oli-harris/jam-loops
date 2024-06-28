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

  <MutedPopup />
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
      this.loopsStore.addEmptyLoop("Drums", 8, 3, [
        "2cffffa0-02bc-4fed-a2d9-16fedeebb8b5",
        "c67f7892-6f32-4add-a277-746bb72d549f",
        "260ed9ec-d6ca-4fea-be07-e2d467c05d95",
      ]);
      // this.loopsStore.addEmptyLoop("Hihats", 3, 3);
      // this.loopsStore.addEmptyLoop("Glorbs", 5, 1);
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
