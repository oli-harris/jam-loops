<template>
  <div class="flex flex-col flex-wrap">
    <div class="text-rose-200" v-if="loopsEmpty">You appear to have no loops.<br /></div>
  </div>
  <AddLoop :empty="loopsEmpty" class="absolute bottom-6 right-6" />
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      loopsStore: useLoopsStore(),
      loopsEmpty: true,
    };
  },
  methods: {
    addNewLoop() {
      // this.loopsStore.addEmptyLoop("Drums", 8, 2);
    },
  },
});
</script>
