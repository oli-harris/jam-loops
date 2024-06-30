<template>
  <div class="flex h-full select-none flex-col items-center justify-center">
    <div class="loop aspect-square h-[20rem] select-none">
      <svg
        ref="loop"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="-1.05 -1.05 2.1 2.1"
      >
        <g v-for="(track, trackNumber) in getSVGData">
          <g v-for="([v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, cx, cy], beatNumber) in track.beat">
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
              :ref="beatRefName(trackNumber, beatNumber)"
            ></path>
            <circle
              :cx="cx"
              :cy="cy"
              r="0.045"
              :class="['note', { disabled: !loop.tracksData[trackNumber].beats[beatNumber] }]"
              :ref="noteRefName(trackNumber, beatNumber)"
            ></circle>
          </g>
        </g>
      </svg>
    </div>

    <div class="mt-5 font-poppins text-lg text-rose-100">{{ loopTitle }}</div>
  </div>
</template>

<script lang="ts">
import { useLoopsStore } from "#imports";

export default defineComponent({
  props: {
    uuid: {
      type: String,
      required: true,
    },
    beats: {
      type: Number,
      required: true,
    },
    tracks: {
      type: Number,
      required: true,
    },
    loopTitle: {
      type: String,
      default: "untitled",
    },
  },
  data() {
    return {
      loop: useLoopsStore().loops[this.uuid],
      trackAddingTo: 0,
    };
  },
  mounted() {
    this.loop.onBeat = this.onBeat;
    this.loop.resetBeat = this.resetBeat;
  },
  methods: {
    // Helper functions
    beatRefName(track: number, beat: number) {
      return `beat-${track}-${beat}`;
    },
    noteRefName(track: number, beat: number) {
      return `note-${track}-${beat}`;
    },
    allBeatsInTrack(track: number): SVGPathElement[] {
      const beatCount = this.loop.beatCount;

      const refs = [];

      for (let beat = 0; beat < beatCount; beat++) {
        const refName = this.beatRefName(track, beat);
        refs.push((this.$refs[refName] as SVGPathElement[])[0]);
      }

      return refs;
    },
    allBeatElements(): SVGPathElement[] {
      const trackCount = this.loop.trackCount;
      const beatCount = this.loop.beatCount;

      const refs = [];

      for (let track = 0; track < trackCount; track++) {
        for (let beat = 0; beat < beatCount; beat++) {
          const refName = this.beatRefName(track, beat);
          refs.push((this.$refs[refName] as SVGPathElement[])[0]);
        }
      }

      return refs;
    },
    allNoteElements(): SVGPathElement[] {
      const trackCount = this.loop.trackCount;
      const beatCount = this.loop.beatCount;

      const refs = [];

      for (let track = 0; track < trackCount; track++) {
        for (let beat = 0; beat < beatCount; beat++) {
          const refName = this.noteRefName(track, beat);
          refs.push((this.$refs[refName] as SVGPathElement[])[0]);
        }
      }

      return refs;
    },
    allBeatsOnBeat(beat: number): SVGPathElement[] {
      const trackCount = this.loop.trackCount;

      const refs = [];

      for (let track = 0; track < trackCount; track++) {
        const refName = this.beatRefName(track, beat);
        refs.push((this.$refs[refName] as SVGPathElement[])[0]);
      }

      return refs;
    },
    allNotesOnBeat(beat: number): SVGPathElement[] {
      const trackCount = this.loop.trackCount;

      const refs = [];

      for (let track = 0; track < trackCount; track++) {
        const refName = this.noteRefName(track, beat);
        refs.push((this.$refs[refName] as SVGPathElement[])[0]);
      }

      return refs;
    },
    // Add/remove notes
    toggleNote(event: MouseEvent) {
      const noteElement = event.target as SVGPathElement;

      // Get track and beat from element
      const track = parseInt(noteElement.getAttribute("track") || "0");
      const beat = parseInt(noteElement.getAttribute("beat") || "0");

      // Get note element
      const note = this.loop.tracksData[track].beats[beat];

      // Toggle note
      this.loop.tracksData[track].beats[beat] = !note;

      if (note) return noteElement.classList.add("disabled");
      noteElement.classList.remove("disabled");

      // Play sample on addition
      const sampleUuid = this.loop.tracksData[track].trackSample;
      useControllerStore().previewNote(sampleUuid);
    },
    // Drag and drop track functionality
    dragOverBeat(event: MouseEvent) {
      event.preventDefault();
      if (!this.isAddingTrack) return;
      // Adds adding-track class to all beats

      const target = event.target as SVGPathElement;
      const track = parseInt(target.getAttribute("track") || "0");
      this.trackAddingTo = track;

      this.allBeatsInTrack(track).forEach((element: SVGPathElement) => {
        element.classList.add("adding-track");
      });
    },
    dragLeaveBeat(event: MouseEvent) {
      event.preventDefault();
      if (!this.isAddingTrack) return;
      // Removes adding-track class from all beats when being dragged over

      const target = event.target as SVGPathElement;
      const track = parseInt(target.getAttribute("track") || "0");

      this.allBeatsInTrack(track).forEach((element: SVGPathElement) => {
        element.classList.remove("adding-track");
      });
    },
    dropTrack(event: DragEvent) {
      if (!this.isAddingTrack) return;

      // Assign sample to track
      const sample = useAppStore().trackSample;
      const track = this.trackAddingTo;

      this.loop.tracksData[track].trackSample = sample;

      // For each beat in track
      this.allBeatsInTrack(track).forEach((element: SVGPathElement) => {
        // Remove adding-track class as track nolonger being dragged
        element.classList.remove("adding-track");
      });

      // Play sample
      useControllerStore().previewNote(sample);
    },
    // Animate beats
    onBeat() {
      // Prevents schedlued animations from playing after noolonger playing
      if (!this.loop.isPlaying) return;

      // Need to -1 from current beat as function is scheduled to be called after beat has incrememented
      const beat = (this.loop.currentBeat - 1 + this.loop.beatCount) % this.loop.beatCount;

      // Add class to sectors and notes on current beat in each track
      this.allBeatsOnBeat(beat).forEach((beat) => beat.classList.add("beat-onBeat"));
      this.allNotesOnBeat(beat).forEach((note) => note.classList.add("note-onBeat"));

      // Remove class from sectors and notes on previous beat in each track
      this.allBeatsOnBeat((beat - 1 + this.loop.beatCount) % this.loop.beatCount).forEach((track) =>
        track.classList.remove("beat-onBeat"),
      );
      this.allNotesOnBeat((beat - 1 + this.loop.beatCount) % this.loop.beatCount).forEach((note) =>
        note.classList.remove("note-onBeat"),
      );
    },
    resetBeat() {
      this.loop.currentBeat = 0;

      // Remove class from all beats and notes
      this.allBeatElements().forEach((beat) => beat.classList.remove("beat-onBeat"));
      this.allNoteElements().forEach((note) => note.classList.remove("note-onBeat"));
    },
  },
  computed: {
    isAddingTrack(): boolean {
      return useAppStore().addingTrack;
    },
    getSVGData(): SVGTrackData[] {
      const beats = this.beats;
      const tracks = this.tracks;

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
          const getVertex = (angle: number, radius: number): [number, number] => {
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return [x, y];
          };

          // Gets coordinates of vertices
          const [v1x, v1y] = getVertex(angle1, outerTrackRadius);
          const [v2x, v2y] = getVertex(angle2, outerTrackRadius);

          const [v3x, v3y] = getVertex(angle1, innerTrackRadius);
          const [v4x, v4y] = getVertex(angle2, innerTrackRadius);

          // Calculates polar coordinate of mean point
          const centerRadius = (outerTrackRadius + innerTrackRadius) / 2;
          const centerAngle = (angle1 + angle2) / 2;

          // Converts to cartesian coordinates
          const cx = centerRadius * Math.cos(centerAngle);
          const cy = centerRadius * Math.sin(centerAngle);

          SVGData[track].beat.push([v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, cx, cy]);
        }
      }

      return SVGData;
    },
  },
});

interface SVGTrackData {
  outerTrackRadius: number;
  innerTrackRadius: number;
  // v1x,  v1y,  v2x,  v2y,  v3x,  v3y,  v4x,  v4y,  cx,  cy,
  beat: number[][];
}
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
