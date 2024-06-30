<template>
  <input
    type="number"
    class="w-10 cursor-ew-resize !select-none bg-inherit text-rose-600 selection:bg-rose-400 selection:text-white hover:select-none focus:outline-none"
    :min="min"
    :max="max"
    @mousedown="mouseDown"
    @mouseup="mouseUp"
    v-model="inputValue"
    ref="input"
    @input="input"
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
      hiddenValue: 120,
      startX: 0,
    };
  },
  emits: ["numberValue"],
  beforeMount() {
    // Initial input value setup
    this.inputValue = this.defaultValue.toString();
    this.$emit("numberValue", Math.round(this.hiddenValue));
  },
  methods: {
    input() {
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
        // Simplifies number
        return Math.round(this.hiddenValue).toString();
      },
      set(newValue: string) {
        this.hiddenValue = this.correctInput(parseInt(newValue));

        return Math.round(this.hiddenValue).toString();
      },
    },
  },
});
</script>

<style scoped>
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
