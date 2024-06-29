<template>
  <div
    class="animate__animated"
    :class="[classList, { [animation]: playAnimation }, { ['animate__infinite']: loop }]"
    @mouseenter="onHover"
    @mouseleave="stopHover"
    @animationiteration="animationEnd"
    @animationend="animationEnd"
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
      this.isHover = true;

      // Play the animation on hover
      this.playAnimation = true;
    },
    stopHover() {
      this.isHover = false;
    },

    animationEnd() {
      if (!this.isHover | !this.loop) this.playAnimation = false;
    },
  },
});
</script>
