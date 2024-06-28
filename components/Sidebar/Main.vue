<template>
  <div class="flex h-full flex-col px-6 py-2">
    <!-- Navigation bar -->
    <div class="flex flex-row justify-center font-poppins text-lg text-rose-100">
      <button
        :class="{ ['font-black text-rose-600 underline']: viewName == 'SidebarTracks' }"
        @click="switchView('SidebarTracks')"
      >
        Tracks
      </button>
      <div class="mx-2">/</div>
      <button
        :class="{ ['font-black text-rose-600 underline']: viewName == 'SidebarMelodies' }"
        @click="switchView('SidebarMelodies')"
      >
        Melodies
      </button>
      <div class="mx-2">/</div>
      <button
        :class="{ ['font-black text-rose-600 underline']: viewName == 'SidebarLoops' }"
        @click="switchView('SidebarLoops')"
      >
        My Loops
      </button>
    </div>

    <!-- View -->
    <div class="flex-1 py-4">
      <component :is="viewSelected" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    // Bad way to do it, causes reactivity errors
    return {
      viewName: "SidebarTracks",
      viewSelected: resolveComponent("SidebarTracks"),
      views: {
        SidebarTracks: resolveComponent("SidebarTracks"),
        SidebarMelodies: resolveComponent("SidebarMelodies"),
        SidebarLoops: resolveComponent("SidebarLoops"),
      },
    };
  },
  methods: {
    switchView(this: any, view: string) {
      this.viewName = view;
      this.viewSelected = this.views[view];
    },
  },
});
</script>
