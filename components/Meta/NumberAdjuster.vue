<template>
  <input
    class="moz w-10 cursor-ew-resize !select-none bg-inherit text-rose-600 selection:bg-rose-400 selection:text-white hover:select-none focus:outline-none"
    :min="min"
    :max="max"
    @mousedown="mouseDown"
    @mouseup="mouseUp"
    ref="input"
    v-model="inputValue"
    @input="onInput"
    @selectstart.prevent
  />
</template>

<script lang="ts">
export default defineComponent({
  props: {
    max: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    defaultValue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      hiddenValue: this.defaultValue,
      startX: 0,
    };
  },
  emits: ["numberValue"],
  methods: {
    onInput(event: Event) {
      const value = (event.target as HTMLInputElement).value;

      let newValue = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1") || "0";

      this.hiddenValue = this.correctInput(parseFloat(newValue));

      (event.target as HTMLInputElement).value = this.hiddenValue.toString();

      this.$emit("numberValue", Math.round(this.hiddenValue));
    },
    mouseDown(event: MouseEvent) {
      this.startX = event.clientX;

      // Style cursor
      document.body.style.setProperty("cursor", "ew-resize", "important");

      // Bind functions to entire window
      window.addEventListener("mousemove", this.drag);
      window.addEventListener("mouseup", this.mouseUp);
    },
    mouseUp() {
      // Style cursor
      document.body.style.setProperty("cursor", "");

      // Bind functions to entire window
      window.removeEventListener("mousemove", this.drag);
      window.removeEventListener("mouseup", this.mouseUp);
    },
    drag(event: MouseEvent) {
      const range = this.max - this.min;
      const deltaX = (event.clientX - this.startX) * (range / 300);

      this.startX = event.clientX;
      this.hiddenValue = this.correctInput(this.hiddenValue + deltaX);

      this.$emit("numberValue", Math.round(this.hiddenValue));
    },
    correctInput(value: number): number {
      return Math.min(Math.max(value, this.min), this.max);
    },
  },
  computed: {
    inputValue: {
      get() {
        return Math.round(this.hiddenValue).toString();
      },
      set(newValue: string) {
        this.hiddenValue = this.correctInput(parseInt(newValue));
      },
    },
  },
});
</script>

<style scoped>
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: textfield;

  margin: 0;
}
input {
  appearance: none;
  -moz-appearance: textfield;
}
</style>
