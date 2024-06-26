<template>
  <div class="loopviewer grid h-full gap-8 overflow-y-auto p-4">
    <div v-for="(loop, position) in positionedLoops" :key="position">
      <Loop
        :uuid="loop.uuid"
        :beats="loop.beatCount"
        :tracks="loop.trackCount"
        :loopTitle="loop.loopTitle"
      />
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
