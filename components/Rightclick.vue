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
      <div v-for="menuItem in contextMenu">
        <div
          v-if="menuItem.type === 'information'"
          class="mt-1 text-center font-extrabold text-white"
        >
          {{ menuItem.information }}
        </div>

        <button
          class="flex w-full flex-row items-center justify-start py-2 pl-2.5 pr-3.5 hover:bg-stone-800"
          v-if="menuItem.type === 'button'"
          @click="menuItem.handler"
        >
          <Icon :name="menuItem.itemIcon || ''" class="mr-2 h-6 w-6 text-rose-400" />
          <div class="flex-start flex w-full text-rose-50">{{ menuItem.itemName }}</div>
        </button>

        <hr
          v-if="menuItem.type === 'spacer' || menuItem.type === 'information'"
          class="mx-2 my-1.5 rounded-md border-t-[1px] border-rose-200"
        />
      </div>
    </div>
  </MetaPopup>
</template>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      contextMenu: [] as ContextMenu,
      position: "",
      loopsStore: useLoopsStore(),
    };
  },
  mounted() {
    // Bind right click function
    useRightClickStore().onRightClick = this.onRightClick;
    window.oncontextmenu = (event: MouseEvent) => {
      console.log("right click");
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

      console.log(type);

      if (type == "loop") {
        this.rightClickLoop(event, details || "");
        this.displayRightClickMenu(event.clientX, event.clientY);
      } else if (type == "other") {
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

      // Specific beat
      if (element.nodeName === "path") {
        const track = parseInt(element.getAttribute("track") || "");
        const beat = parseInt(element.getAttribute("beat") || "");

        this.contextMenuBeat(uuid, track, beat);

        return;
      }

      // Entire loop
      this.contextMenuLoopGeneral(uuid);
    },
    contextMenuLoopGeneral(uuid: string) {
      this.contextMenu = [
        {
          type: "information",
          information: this.loopsStore.loops[uuid].loopTitle,
        },
        {
          type: "button",
          itemName: "Delete loop",
          itemIcon: "ic:round-delete-forever",
          handler: () => {
            this.clickOption();
            this.loopsStore.removeLiveLoop(uuid);
          },
        },
      ];
    },
    contextMenuBeat(uuid: string, track: number, beat: number) {
      console.log(track, beat);

      const sampleUuid = this.loopsStore.loops[uuid].tracksData[track].trackSample;
      let trackName = "Empty track";

      if (sampleUuid) {
        const sample = useSamplesStore().samples[sampleUuid];
        trackName = sample.sampleTitle;
      }

      (this.contextMenu = [
        {
          type: "information",
          information: trackName,
        },
        {
          type: "button",
          itemName: "Add track",
          itemIcon: "ic:round-add-circle-outline",
          handler: () => {
            this.clickOption();
            this.loopsStore.addTrack(uuid, track);
          },
          hidden:
            this.loopsStore.loops[uuid].tracksData.length >=
            this.loopsStore.loopConstraints.maxTracks,
        },
        {
          type: "button",
          itemName: "Remove track",
          itemIcon: "ic:round-remove-circle-outline",
          handler: () => {
            this.clickOption();
            this.loopsStore.removeTrack(uuid, track);
          },
          hidden:
            this.loopsStore.loops[uuid].tracksData.length <=
            this.loopsStore.loopConstraints.minTracks,
        },
        {
          type: "spacer",
        },
        {
          type: "button",
          itemName: "Add beat",
          itemIcon: "ic:round-add-circle-outline",
          handler: () => {
            this.clickOption();
            this.loopsStore.addBeat(uuid, beat);
          },
          hidden: this.loopsStore.loops[uuid].beatCount >= this.loopsStore.loopConstraints.maxBeats,
        },
        {
          type: "button",
          itemName: "Remove beat",
          itemIcon: "ic:round-remove-circle-outline",
          handler: () => {
            this.clickOption();
            this.loopsStore.removeBeat(uuid, beat);
          },
          hidden: this.loopsStore.loops[uuid].beatCount <= this.loopsStore.loopConstraints.minBeats,
        },
        {
          type: "spacer",
        },
        {
          type: "button",
          itemName: "Delete loop",
          itemIcon: "ic:round-delete-forever",
          handler: () => {
            this.clickOption();
            this.loopsStore.removeLiveLoop(uuid);
          },
        },
      ] as ContextMenu).filter((obj) => !!!obj.hidden);
    },
    clickOption(): void {
      const popup = this.$refs.popup as any;

      popup.closePopup();
    },
  },
});

interface ContextMenuItem {
  type: "button";
  itemName: string;
  itemIcon?: string;
  hidden?: boolean;
  handler: () => void;
}

interface ContextMenuInformation {
  type: "information";
  information: string;
  hidden?: boolean;
}

interface ContextMenuSpacer {
  type: "spacer";
  hidden?: boolean;
}

type ContextMenu = (ContextMenuItem | ContextMenuInformation | ContextMenuSpacer)[];
</script>
