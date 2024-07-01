<template>
  <div>
    <MetaAnimateHover :animate-on-start="empty" animation="animate__tada animate__delay-init">
      <button
        class="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-rose-500"
        @click="clickLoopButton"
        @focusin="focusIn"
        tabindex="-1"
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
        class="animate__animated absolute -top-36 right-[26px] z-10 flex flex-col rounded-md border-2 border-solid border-rose-900 bg-stone-800 py-2 pl-2 pr-8 text-rose-50"
        v-if="popup"
        ref="popupElement"
        @mouseover="focusIn"
        @focusin="focusIn"
        @focusout="focusOut"
        tabindex="-1"
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
      // Display popup
      if (!this.popup) {
        this.popup = true;
        this.popupFocused = true;

        // Focus popup once rendered
        this.$nextTick(() => {
          (this.$refs.popupElement as HTMLElement).focus();
        });

        return;
      }

      console.log(this.popup);
      // Add new loop
      useLoopsStore().addEmptyLoop(this.loopTitle, this.beatCount, this.trackCount);

      this.closePopup();
    },
    focusIn() {
      console.log("focus in");
      this.popupFocused = true;
    },
    focusOut() {
      console.log("focus out");
      this.popupFocused = false;

      // When switching focus focusIn and focusOut both called, so only closes popup when focusOut is called singly
      setTimeout(() => {
        if (!this.popupFocused) {
          console.log("blurred");
          this.closePopup();
        }
      }, 0);
    },
    closePopup() {
      this.popup = false;
    },
  },
});
</script>
