<template>
  <MetaPopup
    ref="popup"
    enter-active-class="animate__fadeIn animate__fastest"
    leave-active-class="animate__fadeOut animate__fastest"
    :style-list="position"
  >
    <div
      class="text-md rounded-md border-2 border-solid border-rose-800 bg-stone-950 py-1"
      @contextmenu.prevent
    >
      <div v-for="option in options" @click="option.handler">
        <button
          class="flex w-full flex-row items-center justify-start py-2 pl-2.5 pr-3.5 hover:bg-stone-800"
        >
          <Icon :name="option.optionIcon" class="mr-2 h-6 w-6 text-rose-400" />
          <div class="flex-start flex w-full text-rose-50">
            {{ option.optionName }}
          </div>
        </button>
        <hr v-if="option.spacer" class="mx-2 my-1.5 rounded-md border-t-[1px] border-rose-200" />
      </div>
    </div>
  </MetaPopup>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      options: [] as rightClickOption[],
      position: "",
      loopsStore: useLoopsStore(),
    };
  },
  mounted() {
    // Bind right click function
    useRightClickStore().onRightClick = this.onRightClick;
    window.oncontextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };
  },
  methods: {
    onRightClick(event: MouseEvent, params: string[]) {
      event.preventDefault();

      const type = params[0];
      let details;
      if (params.length == 2) {
        details = params[1];
      }

      if (type == "loop") {
        this.rightClickLoop(event, details || "");
        this.displayRightClickMenu(event.clientX, event.clientY);
      }
    },
    displayRightClickMenu(xPosition: number, yPosition: number) {
      const popup = this.$refs.popup as any;

      this.position = `left: ${xPosition}px; top: ${yPosition}px;`;
      popup.openPopup();
    },
    // Loops
    rightClickLoop(event: MouseEvent, uuid: string) {
      const element = document.elementFromPoint(event.clientX, event.clientY) as SVGElement;

      console.log(element);

      // Specific beat
      if (element.nodeName === "path") {
        const track = (element as SVGElement & { track: number; beat: number }).track;
        const beat = (element as SVGElement & { track: number; beat: number }).beat;

        this.contextMenuBeat(uuid, track, beat);
        return;
      }

      // Entire loop
      this.contextMenuLoopGeneral(uuid);
    },
    contextMenuLoopGeneral(uuid: string) {
      this.options = [
        {
          optionName: "Delete loop",
          optionIcon: "ic:round-delete-forever",
          handler: () => {
            this.clickOption;
            this.loopsStore.deleteLoop(uuid);
          },
        },
      ];
    },
    contextMenuBeat(uuid: string, track: number, beat: number) {
      this.options = [
        {
          optionName: "Add track",
          optionIcon: "ic:round-add-circle-outline",
          handler: () => {
            this.clickOption();
            this.loopsStore.addTrack(uuid, track);
          },
          hidden: this.loopsStore.loops[uuid].trackCount >= this.loopsStore.maxTracks,
        },
        {
          optionName: "Remove track",
          optionIcon: "ic:round-remove-circle-outline",
          spacer: true,
          handler: () => {
            this.clickOption();
            useLoopsStore().removeTrack(uuid, track);
          },
          hidden: this.loopsStore.loops[uuid].trackCount <= this.loopsStore.minTracks,
        },
        {
          optionName: "Add beat",
          optionIcon: "ic:round-add-circle-outline",
          handler: () => {},
          hidden: this.loopsStore.loops[uuid].beatCount >= this.loopsStore.maxBeats,
        },
        {
          optionName: "Remove beat",
          optionIcon: "ic:round-remove-circle-outline",
          handler: () => {},
          hidden: this.loopsStore.loops[uuid].beatCount <= this.loopsStore.minBeats,
        },
      ].filter((obj) => !obj.hidden);
    },
    clickOption(): void {
      const popup = this.$refs.popup as any;

      popup.closePopup();
    },
  },
});

interface rightClickOption {
  optionName: string;
  optionIcon: string;
  spacer?: boolean;
  hidden?: boolean;
  handler: () => void;
}
</script>
