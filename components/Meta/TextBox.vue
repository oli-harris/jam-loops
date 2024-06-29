<template>
  <div
    class="text-nowrap bg-inherit px-1 selection:bg-rose-400 selection:text-white focus:border-b-2 focus:border-rose-600 focus:outline-none"
    placeholder=""
    @input="onInput"
    contenteditable
    @keydown.enter.prevent
    spellcheck="false"
    ref="inputBox"
    v-once
  >
    {{ defaultText }}
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    maxLength: {
      type: Number,
      default: 20,
    },
    defaultText: {
      type: String,
      default: "Untitled",
    },
  },
  data() {
    return {
      textValue: "",
    };
  },
  emits: ["textValue"],
  methods: {
    onInput(event: Event) {
      const selection = window.getSelection();
      if (!selection) return;

      const target = event.target as HTMLElement;

      // Gets current cursor position
      const range = selection.getRangeAt(0);
      let cursorPosition = range.startOffset;

      // Sanitise text content: no new lines and length < maxLength
      let newText = target.textContent?.replace(/[\r\n]/g, "") || "";
      if (newText.length > 20) {
        newText = newText.slice(0, this.maxLength);
        cursorPosition = 20;
      }

      // Update text value
      this.textValue = newText;
      target.textContent = newText;

      this.$emit("textValue", newText);

      // Sets correct curssor position
      range.setStart(target.childNodes[0], cursorPosition);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    },
  },
});
</script>
