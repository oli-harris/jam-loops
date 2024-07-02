<!-- Popup which closes automatically if clicked off of -->
<template>
  <Transition :enter-active-class="enterActiveClass" :leaveActiveClass="leaveActiveClass">
    <div
      v-if="popupVisible"
      ref="popupElement"
      @mouseover="focusIn"
      @focusin="focusIn"
      @focusout="focusOut"
      tabindex="-1"
      class="animate__animated absolute z-10 focus:outline-none"
      :class="classList"
      :style="styleList"
    >
      <slot></slot>
    </div>
  </Transition>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    enterActiveClass: {
      type: String,
      default: "",
    },
    leaveActiveClass: {
      type: String,
      default: "",
    },
    classList: {
      type: String,
      default: "",
    },
    styleList: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      popupVisible: false,
      popupFocused: true,
    };
  },
  methods: {
    focusIn() {
      this.popupFocused = true;
    },
    focusOut() {
      this.popupFocused = false;

      // When switching focus focusIn and focusOut both called, so only closes popup when focusOut is called singly
      setTimeout(() => {
        if (!this.popupFocused) {
          this.closePopup();
        }
      }, 0);
    },
    openPopup() {
      this.popupVisible = true;
      this.popupFocused = true;

      this.$nextTick(() => {
        (this.$refs.popupElement as HTMLElement).focus();
      });
    },
    closePopup() {
      this.popupVisible = false;
    },
  },
});
</script>
