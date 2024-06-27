<template>
  <div class="px-6 py-2">
    <div class="flex flex-row font-poppins text-lg text-rose-100">
      <div class="text-rose-600 underline">Loops</div>
      <div class="ml-1">/ Melodies / Beats</div>
    </div>
    <div>
      <div class="ml mt-8 font-black text-rose-200" @click="addNewLoop">Add New Loop</div>
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
  methods: {
    addNewLoop() {
      this.loopsStore.addEmptyLoop("Drums", 8, 2);
    },
  },
});
</script>
