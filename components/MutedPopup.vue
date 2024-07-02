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
      <Icon name="ic:round-volume-off" class="h-8 w-8 text-white" />
    </button>
  </MetaAnimateHover>
</template>

<script lang="ts">
export default defineComponent({
  methods: {
    unmute() {
      useControllerStore().init();
    },
  },
  computed: {
    unmuted() {
      return useControllerStore().isInitialised;
    },
  },
});
</script>
