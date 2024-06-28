<template>
  <div>
    <div v-for="pack in packs">
      <div class="mb-2 text-lg font-black text-rose-600">{{ pack.samplePackTitle }}</div>

      <ul class="text-rose-100" v-for="sample in Object.values(pack.samples)">
        <li class="ml-2">{{ sample.sampleTitle }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      samplesStore: useSamplesStore(),
    };
  },
  computed: {
    packs(): Pack[] {
      this.samplesStore.fetchSamplePacks();

      return this.samplesStore.packsArray;
    },
  },
});
</script>
