<template>
  <div>
    <div class="ml mt-8 font-black text-rose-200" @click="addNewLoop">Add New Loop</div>
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
