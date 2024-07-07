<template>
  <div v-for="pack in packs" class="flex flex-col flex-wrap items-start">
    <MetaAnimateHover animation="animate__headShake">
      <div
        class="animate__animated animate__fast animate__rollIn mb-2 select-auto text-xl font-extrabold text-rose-600"
      >
        {{ pack.samplePackTitle }}
      </div>
    </MetaAnimateHover>

    <ul
      class="animate__animated animate__fast animate__delay-500ms animate__fadeInLeft text-rose-100"
      v-for="[uuid, sample] in Object.entries(pack.samples)"
    >
      <li
        class="box-border px-3 transition-transform hover:scale-125"
        @dragstart="dragTrack($event, uuid)"
        @drackend="dropTrack"
        draggable="true"
        @click="useControllerStore().previewNote(uuid)"
        :uuid="uuid"
      >
        {{ sample.sampleTitle }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      samplesStore: useSamplesStore(),
      appStore: useAppStore(),
    };
  },
  methods: {
    dragTrack(event: DragEvent, sampleUuid: string) {
      if (!event.dataTransfer) return;

      event.dataTransfer.dropEffect = "copy";
      event.dataTransfer.effectAllowed = "copy";

      this.appStore.addingTrack = true;
      this.appStore.trackSample = sampleUuid;
    },
    dropTrack(event: DragEvent) {
      useAppStore().addingTrack = false;
    },
  },
  computed: {
    packs(): Pack[] {
      this.samplesStore.fetchSamplePacks();

      return this.samplesStore.packsArray;
    },
  },
});
</script>
