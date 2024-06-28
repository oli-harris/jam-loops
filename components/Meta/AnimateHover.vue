<template>
  <div
    class="animate__animated animate__infinite"
    :class="[classList, { [animation]: playAnimation }]"
    @mouseover="onHover"
    @mouseleave="isHover = false"
    @animationiteration="animationEnd"
  >
    <slot></slot>
  </div>
</template>

<script>
import "animate.css";

export default defineComponent({
  props: {
    animateOnStart: {
      type: Boolean,
      default: false,
    },
    classList: {
      type: String,
      default: "",
    },
    animation: {
      type: String,
      required: true,
    },
    loop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      playAnimation: this.animateOnStart,
      isHover: false,
    };
  },
  methods: {
    onHover() {
      this.playAnimation = true;
      this.isHover = true;
    },

    animationEnd() {
      if (!this.isHover | !this.loop) this.playAnimation = false;
    },
  },
});
</script>
