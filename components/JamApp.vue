<template>
  <div class="font-rubik relative flex h-screen select-none flex-col overflow-hidden font-medium">
    <header class="h-16 bg-stone-950">
      <ControlBar />
    </header>

    <div class="flex max-h-[calc(100vh-4rem)] flex-1">
      <aside class="overflow-y-auto border-r-2 border-rose-900 bg-stone-950">
        <SidebarMain />
      </aside>

      <main class="flex-1 overflow-y-auto border-t-2 border-rose-900 bg-stone-900">
        <LoopsWorkspace />
      </main>
    </div>

    <MutedPopup />
    <RightClick />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      loopsStore: useLoopsStore(),
      controlStore: useControllerStore(),
    };
  },
  mounted() {
    this.inititate();
  },
  methods: {
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
