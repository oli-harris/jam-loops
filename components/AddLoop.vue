<template>
  <div>
    <MetaAnimateHover :animate-on-start="empty" animation="animate__tada animate__delay-init">
      <button
        class="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-rose-500"
        @click="onClick"
      >
        <div class="stroke-white text-4xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-plus"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
        </div>
      </button>
    </MetaAnimateHover>

    <Transition
      enter-active-class="animate__rotateInDownRight animate__fastest"
      leave-active-class="animate__bounceOutLeft"
    >
      <div
        class="animate__animated absolute -top-36 right-[26px] z-10 flex flex-col rounded-md border-2 border-solid border-rose-900 bg-stone-800 p-4 text-rose-50"
        v-if="popup"
      >
        <MetaTextBox
          @text-value="(textValue) => (loopTitle = textValue)"
          class="mb-4 text-lg text-rose-600"
        />
        <div class="flex flex-row items-center gap-2">
          Beats:
          <MetaNumberAdjuster
            @number-value="(numberValue) => (beatCount = numberValue)"
            class="text-lg"
            :default-value="8"
            :max="16"
            :min="1"
          />
        </div>
        <div class="flex flex-row items-center gap-2">
          Tracks:
          <MetaNumberAdjuster
            @number-value="(numberValue) => (trackCount = numberValue)"
            class="text-lg"
            :default-value="3"
            :max="5"
            :min="1"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      popup: false,
      loopTitle: "Untitled",
      trackCount: 3,
      beatCount: 8,
    };
  },
  props: {
    empty: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      // Add popup
      if (!this.popup) return (this.popup = true);

      // Add new loop
      useLoopsStore().addEmptyLoop(this.loopTitle, this.beatCount, this.trackCount);

      this.popup = false;
    },
  },
});
</script>
