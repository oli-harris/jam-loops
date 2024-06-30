<template>
  <div class="flex items-center">
    <input
      type="range"
      class="h-3 w-full cursor-grab appearance-none bg-transparent accent-rose-600 [&::-webkit-slider-runnable-track]:h-[6px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-600"
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
input {
  &::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #f43f5e 0% var(--value), #fecdd3 var(--value) 100%);
  }

  --value: 50%;
}
</style>
