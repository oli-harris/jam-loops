<template>
  <div class="loopviewer grid gap-8 p-4">
    <div v-for="(loop, position) in positionedLoops" :key="position">
      <Loop :uuid="loop.uuid" />
    </div>
  </div>
</template>

<style>
.loopviewer {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(20rem, 1fr));
}
</style>

<script lang="ts">
import { useLoopsStore } from "#imports";

export default defineComponent({
  data() {
    return {
      loopsStore: useLoopsStore(),
    };
  },
  methods: {
    addLoops() {},
    addLoop(
      uuid: String,
      beatCount: number,
      trackCount: number,
      position: number,
      loopData: boolean[],
    ) {},
  },
  computed: {
    positionedLoops(): Loop[] {
      return this.loopsStore.positionedLoops;
    },
  },
});
</script>
