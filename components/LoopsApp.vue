<template>
  <div class="flex h-screen flex-col overflow-hidden">
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
      <!-- <aside class="w-64 bg-stone-900 border-t-2 border-l-2 border-rose-950">
        <TimelineSideview />
      </aside> -->
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {};
  },
  methods: {},
});
</script>
