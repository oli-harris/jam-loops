<!-- All websites requires userinput on a button to play sound-->
<template>
  <MetaAnimateHover
    :animate-on-start="true"
    classList="fixed bottom-8 right-8 animate__delay-init"
    animation="animate__tada"
    v-if="!unmuted"
  >
    <button
      @click="unmute"
      class="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-rose-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-white"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464" />
        <path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615" />
        <path
          d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664"
        />
        <path d="M3 3l18 18" />
      </svg>
    </button>
  </MetaAnimateHover>
</template>

<script lang="ts">
export default defineComponent({
  methods: {
    unmute() {
      useControllerStore().init();
      console.log(this.unmuted);
    },
  },
  computed: {
    unmuted() {
      return useControllerStore().isInitialised;
    },
  },
});
</script>
