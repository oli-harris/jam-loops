<template>
  <div class="flex h-screen select-none flex-col overflow-hidden font-poppins">
    <header class="bg-stone-950">
      <Toolbar />
    </header>

    <div class="flex h-full flex-1">
      <aside class="w-[66] border-r-2 border-rose-950 bg-stone-950">
        <LoopsSideview />
      </aside>

      <main class="flex-1 border-t-2 border-rose-950 bg-stone-900">
        <LoopsViewer />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { useLoopsStore } from "#imports";

export default defineComponent({
  data() {
    return {
      loopsStore: useLoopsStore(),
    };
  },
  mounted() {
    this.saturateLoops();
  },
  methods: {
    saturateLoops() {
      this.loopsStore.addEmptyLoop("Drums", 8, 2);
      this.loopsStore.addEmptyLoop("Hihats", 3, 3);
      this.loopsStore.addEmptyLoop("Glorbs", 5, 1);
    },
  },
});
</script>
