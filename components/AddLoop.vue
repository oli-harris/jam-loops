<template>
  <div class="position">
    <MetaAnimateHover :animate-on-start="empty" animation="animate__tada animate__delay-init">
      <button
        class="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-rose-500"
        @click="clickLoopButton"
        @focusin="focusIn"
        tabindex="-1"
      >
        <Icon name="ic:round-plus" class="h-10 w-10 text-white" />
      </button>
    </MetaAnimateHover>

    <MetaPopup
      enter-active-class="animate__rotateInDownRight animate__fastest"
      leave-active-class="animate__bounceOutLeft"
      ref="popup"
      class-list="-top-32 right-[26px]"
    >
      <div
        class="flex flex-col rounded-md border-2 border-solid border-rose-900 bg-stone-800 px-3 py-2 text-rose-50"
      >
        <MetaTextBox
          @text-value="(textValue) => (loopTitle = textValue)"
          class="mb-3 min-w-2 text-lg text-rose-600"
        />
        <div class="pl-2">
          <div class="flex flex-row items-center gap-2">
            Beats:
            <MetaNumberAdjuster
              @number-value="(numberValue) => (beatCount = numberValue)"
              class="text-lg"
              :default-value="8"
              :max="useLoopsStore().maxBeats"
              :min="2"
            />
          </div>
          <div class="flex flex-row items-center gap-2">
            Tracks:
            <MetaNumberAdjuster
              @number-value="(numberValue) => (trackCount = numberValue)"
              class="text-lg"
              :default-value="3"
              :max="useLoopsStore().maxTracks"
              :min="1"
            />
          </div>
        </div>
      </div>
    </MetaPopup>
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
      popupFocused: true,
    };
  },
  props: {
    empty: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickLoopButton() {
      const popup = this.$refs.popup as any;
      if (!popup.popupVisible) return popup.openPopup();

      // Add new loop
      useLoopsStore().addEmptyLoop(this.loopTitle, this.beatCount, this.trackCount);
      popup.closePopup();

      // Set to default values
      this.loopTitle = "Untitled";
      this.trackCount = 3;
      this.beatCount = 8;
    },
    focusIn() {
      const popup = this.$refs.popup as any;
      popup.focusIn();
    },
  },
});
</script>
