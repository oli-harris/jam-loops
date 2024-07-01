<template>
  <div class="relative flex min-h-full flex-col px-6 py-2">
    <!-- Navigation bar -->
    <div class="flex flex-row justify-center font-poppins text-lg text-rose-100 transition-all">
      <button
        class="hover:text-rose-400"
        :class="{ ['font-black !text-rose-600 underline']: viewName == 'SidebarTracks' }"
        @click="switchView('SidebarTracks')"
      >
        Tracks
      </button>
      <div class="mx-2">/</div>
      <button
        class="hover:text-rose-400"
        :class="{ ['font-black !text-rose-600 underline']: viewName == 'SidebarMelodies' }"
        @click="switchView('SidebarMelodies')"
      >
        Melodies
      </button>
      <div class="mx-2">/</div>
      <button
        class="hover:text-rose-400"
        :class="{ ['font-black !text-rose-600 underline']: viewName == 'SidebarLoops' }"
        @click="switchView('SidebarLoops')"
      >
        My Loops
      </button>
    </div>

    <!-- View -->
    <div class="mt-2 flex-1 py-4">
      <SidebarTracks v-if="viewName == 'SidebarTracks'" />
      <SidebarMelodies v-if="viewName == 'SidebarMelodies'" />
      <SidebarLoops v-if="viewName == 'SidebarLoops'" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      viewName: "SidebarTracks",
    };
  },
  methods: {
    switchView(this: any, view: string) {
      this.viewName = view;
    },
  },
});
</script>
