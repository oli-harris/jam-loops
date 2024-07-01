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
        <div class="flex flex-row items-center gap-2">
          Tempo:
          <MetaNumberAdjuster
            class="text-lg"
            :default-value="controllerStore.tempo"
            :min="0"
            :max="200"
            @number-value="setTempo"
          />
        </div>

        <div class="ml-2 text-rose-100">{{ playing ? "Playing" : "Paused" }}</div>
        <div @click="togglePlay" v-if="!playing">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-9 cursor-pointer stroke-rose-600"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 4v16l13 -8z" />
          </svg>
        </div>
        <div @click="togglePlay" v-if="playing">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-9 w-9 cursor-pointer fill-rose-600"
            width="32"
            height="32"
            stroke-width="4"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
            />
            <path
              d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
            />
          </svg>
        </div>

        <div class="ml-4 mr-2">Volume</div>
        <MetaSlider
          class="w-20"
          :min="0"
          :max="1"
          @slider-value="setVolume"
          :default-value="controllerStore.volume"
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
