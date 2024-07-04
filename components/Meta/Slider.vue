<template>
  <div class="flex items-center">
    <input
      type="range"
      class="h-3 w-full cursor-grab appearance-none bg-transparent"
      :style="{ '--value': `${sliderPercentage()}%` }"
      :class="{ '!cursor-grabbing': sliding }"
      :min="min"
      :max="max"
      ref="slider"
      @input="updateSlider"
      @mouseup="sliding = false"
      @mousedown="sliding = true"
      v-model="sliderValue"
      :step="(max - min) / 200"
    />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    defaultValue: {
      type: Number,
      required: false,
    },
  },
  emits: ["sliderValue"],
  data() {
    return {
      sliderValue: this.defaultValue || (this.min + this.max) / 2,
      sliding: false,
    };
  },
  methods: {
    updateSlider() {
      this.$emit("sliderValue", this.sliderValue);
    },
    sliderPercentage() {
      return ((this.sliderValue - this.min) / (this.max - this.min)) * 100;
    },
  },
});
</script>

<!-- Custom styles to create two-tone design -->
<style scoped lang="scss">
input[type="range"] {
  &::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right,
      rgb(244 63 94) 0% var(--value),
      #fecdd3 var(--value) 100%
    );
  }

  &::-moz-range-track {
    background: linear-gradient(
      to right,
      rgb(244 63 94) 0% var(--value),
      #fecdd3 var(--value) 100%
    );
  }

  &::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 9999px;
  }

  &::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background-color: rgb(225 29 72);
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    margin-top: -5px;
    box-shadow: -5px 2px 15px -2px rgba(0, 0, 0, 0.6);
    -webkit-box-shadow: -5px 2px 15px -2px rgba(0, 0, 0, 0.6);
  }

  &::-moz-range-thumb {
    background-color: rgb(225 29 72);
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    margin-top: -5px;
    box-shadow: -5px 2px 15px -2px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: -5px 2px 15px -2px rgba(0, 0, 0, 0.6);
  }

  --value: 50%;
}
</style>
