<template>
  <div
    class="flex h-full select-none flex-col items-center justify-center"
    v-rightclick="['loop', uuid]"
  >
    <div class="loop aspect-square h-[20rem] select-none">
      <svg
        ref="loop"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="-1.05 -1.05 2.1 2.1"
      >
        <g v-for="(track, trackNumber) in getSVGData" :key="trackNumber">
          <g
            v-for="([v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, cx, cy], beatNumber) in track.beat"
            :key="beatNumber"
          >
            <!-- Beat sector -->
            <path
              :d="`M ${v1x} ${v1y}
                      A ${track.outerTrackRadius} ${track.outerTrackRadius} 0 0 1 ${v2x} ${v2y}
                      L ${v4x} ${v4y}
                      A ${track.innerTrackRadius} ${track.innerTrackRadius} 0 0 0 ${v3x} ${v3y}
                      Z`"
              class="beat"
              :track="trackNumber"
              :beat="beatNumber"
              @click="toggleNote"
              @dragover="dragOverBeat"
              @dragleave="dragLeaveBeat"
              @drop="dropTrack"
              :ref="(el) => setBeatRef(el, trackNumber, beatNumber)"
            ></path>
            <circle
              :cx="cx"
              :cy="cy"
              r="0.045"
              :class="['note', { disabled: !loop.tracksData[trackNumber].beats[beatNumber] }]"
              :ref="(el) => setNoteRef(el, trackNumber, beatNumber)"
            ></circle>
          </g>
        </g>
      </svg>
    </div>

    <div class="mt-5 font-poppins text-lg text-rose-100">
      <MetaTextBox :defaultText="loop.loopTitle" @textValue="setLoopTitle" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
});

let trackAddingTo = 0;

// Refs
interface ElementRefs {
  [key: number]: Element;
}

interface TrackRefs {
  [key: number]: ElementRefs;
}

const beatRefs = ref<TrackRefs>({});
const noteRefs = ref<TrackRefs>({});

const setBeatRef = (
  el: Element | ComponentPublicInstance | null,
  trackNumber: number,
  beatNumber: number,
) => {
  // instanceof Element doesnt work on safari
  if (!(el instanceof SVGPathElement)) return;

  beatRefs.value[trackNumber] ??= {};
  beatRefs.value[trackNumber][beatNumber] = el;
};

const setNoteRef = (
  el: Element | ComponentPublicInstance | null,
  trackNumber: number,
  beatNumber: number,
) => {
  if (!(el instanceof SVGCircleElement)) return;

  noteRefs.value[trackNumber] ??= {};
  noteRefs.value[trackNumber][beatNumber] = el;
};

const allRefsInTrack = (refs: globalThis.Ref<TrackRefs>, track: number): Element[] => {
  return Object.values(refs.value[track]);
};

const allRefsOnBeat = (refs: globalThis.Ref<TrackRefs>, beat: number): Element[] => {
  const refsArray = [] as Element[];

  Object.values(refs.value).forEach((trackRefs: ElementRefs) => {
    const beatElement = trackRefs[beat];

    refsArray.push(beatElement);
  });

  return refsArray;
};

const allRefs = (refs: globalThis.Ref<TrackRefs>): Element[] => {
  const refArray = [] as Element[];

  Object.values(refs.value).forEach((elementRefs: ElementRefs) => {
    Object.values(elementRefs).forEach((element: Element) => {
      refArray.push(element);
    });
  });

  return refArray;
};

// Access stores
const loopsStore = useLoopsStore();
const { loops } = storeToRefs(loopsStore);
const reactiveLoop = ref(loops.value[props.uuid]);
const loop = computed(() => loops.value[props.uuid]); // Read only

const isAddingTrack = computed(() => useAppStore().addingTrack);

// Life cycle hooks
onMounted(() => {
  reactiveLoop.value.onBeat = onBeat;
  reactiveLoop.value.resetBeat = resetBeat;
});

const setLoopTitle = (newTitle: string) => {
  reactiveLoop.value.loopTitle = newTitle;
};

// Create loops SVG

interface SVGTrackData {
  outerTrackRadius: number;
  innerTrackRadius: number;
  // v1x,  v1y,  v2x,  v2y,  v3x,  v3y,  v4x,  v4y,  cx,  cy,
  beat: [string, string, string, string, string, string, string, string, string, string][];
}

const getSVGData = computed((): SVGTrackData[] => {
  const beats = loop.value.beatCount;
  const tracks = loop.value.tracksData.length;

  const holeRadius = 0.25;

  // Angle starts 12 oclock, in radians
  const startAngle = -Math.PI / 2;
  const intervalAngle = (2 * Math.PI) / beats;

  const widthBetweenTracks = (1 - holeRadius) / tracks;

  let SVGData = [] as SVGTrackData[];

  for (let track = 0; track < tracks; track++) {
    let outerTrackRadius = 1 - widthBetweenTracks * track;
    let innerTrackRadius = 1 - widthBetweenTracks * (track + 1);

    SVGData.push({
      outerTrackRadius: outerTrackRadius,
      innerTrackRadius: innerTrackRadius,
      beat: [],
    });

    for (let beat = 0; beat < beats; beat++) {
      // Two angles which define sector
      let angle1 = startAngle + intervalAngle * beat;
      let angle2 = startAngle + intervalAngle * (beat + 1);

      // Obtains positions of each vertex of segment for a unit circle
      const getVertex = (angle: number, radius: number): [string, string] => {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return [x.toFixed(10), y.toFixed(10)];
      };

      // Gets coordinates of vertices
      const [v1x, v1y] = getVertex(angle1, outerTrackRadius);
      const [v2x, v2y] = getVertex(angle2, outerTrackRadius);

      const [v3x, v3y] = getVertex(angle1, innerTrackRadius);
      const [v4x, v4y] = getVertex(angle2, innerTrackRadius);

      // Calculates polar coordinate of mean point
      const centerRadius = (outerTrackRadius + innerTrackRadius) / 2;
      const centerAngle = (angle1 + angle2) / 2;

      // Converts to cartesian coordinates, fixed to 5dp so no server-client mismatch
      const cx = (centerRadius * Math.cos(centerAngle)).toFixed(10);
      const cy = (centerRadius * Math.sin(centerAngle)).toFixed(10);

      SVGData[track].beat.push([v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, cx, cy]);
    }
  }

  return SVGData;
});

// Add/remove notes

const toggleNote = (event: MouseEvent) => {
  const noteElement = event.target as Element;

  // Get track and beat from element
  const track = parseInt(noteElement.getAttribute("track") || "0");
  const beat = parseInt(noteElement.getAttribute("beat") || "0");

  // Get note element
  const note = loop.value.tracksData[track].beats[beat];

  // Toggle note
  reactiveLoop.value.tracksData[track].beats[beat] = !note;

  if (note) return noteElement.classList.add("disabled");
  noteElement.classList.remove("disabled");

  // Play sample on addition
  const sampleUuid = loop.value.tracksData[track].trackSample;
  useControllerStore().previewNote(sampleUuid);
};

// Drag and drop tracks

const dragOverBeat = (event: MouseEvent) => {
  event.preventDefault();
  if (!isAddingTrack) return;

  // Adds adding-track class to all beats
  const target = event.target as Element;
  const track = parseInt(target.getAttribute("track") || "0");
  trackAddingTo = track;

  allRefsInTrack(beatRefs, track).forEach((element: Element) => {
    element.classList.add("adding-track");
  });
};

const dragLeaveBeat = (event: MouseEvent) => {
  event.preventDefault();
  if (!isAddingTrack) return;

  // Removes adding-track class from all beats when being dragged over
  const target = event.target as Element;
  const track = parseInt(target.getAttribute("track") || "0");

  allRefsInTrack(beatRefs, track).forEach((element: Element) => {
    element.classList.remove("adding-track");
  });
};

const dropTrack = (event: DragEvent) => {
  if (!isAddingTrack) return;

  // Assign sample to track
  const sample = useAppStore().trackSample;
  const track = trackAddingTo;

  reactiveLoop.value.tracksData[track].trackSample = sample;

  // Remove adding-track class as track nolonger being dragged
  allRefsInTrack(beatRefs, track).forEach((element: Element) => {
    element.classList.remove("adding-track");
  });

  // Play sample
  useControllerStore().previewNote(sample);
};

// Animate beats

const onBeat = () => {
  // Prevents schedlued animations from playing after noolonger playing
  if (!loop.value.isPlaying) return;

  // Need to -1 from current beat as function is scheduled to be called after beat has incrememented
  const beat = (loop.value.currentBeat - 1 + loop.value.beatCount) % loop.value.beatCount;

  // Add class to sectors and notes on current beat in each track
  allRefsOnBeat(beatRefs, beat).forEach((beat) => beat.classList.add("beat-onBeat"));
  allRefsOnBeat(noteRefs, beat).forEach((note) => note.classList.add("note-onBeat"));

  // Remove class from sectors and notes on previous beat in each track
  allRefsOnBeat(beatRefs, (beat - 1 + loop.value.beatCount) % loop.value.beatCount).forEach(
    (track) => track.classList.remove("beat-onBeat"),
  );
  allRefsOnBeat(noteRefs, (beat - 1 + loop.value.beatCount) % loop.value.beatCount).forEach(
    (note) => note.classList.remove("note-onBeat"),
  );
};

const resetBeat = () => {
  reactiveLoop.value.currentBeat = 0;

  // Remove class from all beats and notes
  allRefs(beatRefs).forEach((beat) => beat.classList.remove("beat-onBeat"));
  allRefs(noteRefs).forEach((note) => note.classList.remove("note-onBeat"));
};
</script>

<!-- Custom styles instead of tailwind -->
<style>
.beat {
  fill: #0c0a09;
  transition: 100ms ease-out fill;
  stroke: #9f1239;
  stroke-width: 0.03;
  z-index: 0;
}

.beat:hover {
  fill: #fecdd3;
  transition: 75ms ease-out fill;
}

.beat.adding-track {
  fill: #fb7185;
  transition: 0ms ease-out fill;
}

.note {
  fill: #fb7185;
  stroke: #fb7185;
  stroke-width: 0;
  pointer-events: none;
  transition: 300ms ease-out all;
}

.beat:hover + .note {
  fill: #e11d48;
  stroke: #e11d48;
  stroke-width: 0.04;
  transition: 100ms ease-out stroke-width;
}

.note.disabled {
  fill: none !important;
  stroke: none !important;
}

.beat-onBeat {
  fill: #fb7185;
  /* transition: 0ms fill; */
}

.note-onBeat {
  fill: #9f1239;
  stroke: #9f1239;
  stroke-width: 0.04;
  transition: 50ms ease-out all;
}

@keyframes note-onBeat {
  0% {
    fill: #fb7185;
  }
  10% {
  }
  80% {
    fill: #fb7185;
  }
  100% {
    fill: #9f1239;
  }
}
</style>
