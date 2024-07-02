<template>
  <div class="grid grid-cols-3 items-center px-6 py-2">
    <div class="flex flex-row items-center justify-self-start">
      <MetaAnimateHover
        :animateOnStart="true"
        :loop="true"
        animation="animate__rubberBand"
        classList="animate__delay-init"
      >
        <div class="mr-4 cursor-default text-5xl font-black text-rose-600">JAM</div>
      </MetaAnimateHover>
      <MetaTextBox
        class="text-lg text-rose-100"
        :defaultText="projectTitle"
        @textValue="setProjectTitle"
        emptyValue="Untitled Project"
      />
    </div>
    <div class="justify-self-center text-rose-100">
      <div class="flex flex-row items-center">
        <div class="mr-2">Tempo</div>
        <MetaNumberAdjuster
          class="text-lg"
          :default-value="Number(controllerStore.tempo)"
          :min="0"
          :max="200"
          @number-value="setTempo"
        />

        <div class="ml-2">{{ playing ? "Playing" : "Paused" }}</div>
        <div @click="togglePlay" v-show="!playing" class="h-10">
          <Icon name="ic:round-play-arrow" class="h-10 w-10 text-rose-600" />
        </div>
        <div @click="togglePlay" v-show="playing" class="h-9">
          <Icon name="ic:round-pause" class="h-9 w-9 text-rose-600" />
        </div>

        <div class="ml-4 mr-2">Volume</div>
        <MetaSlider
          class="w-20"
          :min="0"
          :max="1"
          @slider-value="setVolume"
          :default-value="Number(controllerStore.volume)"
        />
      </div>
    </div>
    <div class="justify-self-end text-rose-700"></div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      controllerStore: useControllerStore(),
      projectStore: useProjectStore(),
    };
  },
  methods: {
    togglePlay() {
      this.playing = !this.playing;

      if (this.playing) return this.controllerStore.stop();
      this.controllerStore.play();
    },
    setProjectTitle(newTitle: string) {
      this.projectTitle = newTitle;
    },
    setTempo(newTempo: number) {
      this.controllerStore.tempo = newTempo;
      this.controllerStore.setBPM();
    },
    setVolume(newVolume: number) {
      this.controllerStore.volume = newVolume;
      this.controllerStore.setVolume();
    },
  },
  computed: {
    projectTitle: {
      get() {
        return this.projectStore.projectTitle;
      },
      set(newTitle: string) {
        this.projectStore.projectTitle = newTitle;
      },
    },
    playing: {
      get() {
        return this.controllerStore.playing;
      },
      set(playing: Boolean) {
        this.controllerStore.playing = this.playing;
      },
    },
  },
});
</script>
