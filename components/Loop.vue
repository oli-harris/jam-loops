<template>
  <div class="flex h-full select-none flex-col items-center justify-center">
    <div class="loop aspect-square h-[20rem] select-none">
      <svg
        ref="loop"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="-1.05 -1.05 2.1 2.1"
      ></svg>
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
      trackBeatElements: [] as SVGPathElement[][],
      trackNoteElements: [] as SVGCircleElement[][],
      trackArcElements: [] as SVGPathElement[],
      noteRadius: 0.045,
      loop: useLoopsStore().loops[this.uuid],
    };
  },
  mounted() {
    this.createLoopSVG();
    this.loop.onBeat = this.onBeat;
  },
  methods: {
    createLoopSVG() {
      // Creates a SVG of a disc divided into segments and rings
      // Each ring is a track, and each track is divided into beats
      // Convert into a V-FOR loop?
      const createSector = (
        angle1: number,
        angle2: number,
        outerTrackRadius: number,
        innerTrackRadius: number,
        track: number,
        beat: number,
      ): SVGPathElement[] => {
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

        // Sector element
        const sectorElement = sectorFillPath(
          v1x,
          v1y,
          v2x,
          v2y,
          v3x,
          v3y,
          v4x,
          v4y,
          outerTrackRadius,
          innerTrackRadius,
        );
        sectorElement.setAttribute("beat", beat.toString());
        sectorElement.setAttribute("track", track.toString());
        // Cannot use @onclick with setAttribute
        sectorElement.onclick = this.toggleNote;

        // Note element
        const noteElement = noteShape(angle1, angle2, outerTrackRadius, innerTrackRadius);
        noteElement.setAttribute("r", this.noteRadius.toString());
        noteElement.classList.add("note");

        // If no note in loopData
        if (!this.loop.tracksData[track].beats[beat]) noteElement.classList.add("disabled");

        // Caches elements for performance
        this.trackBeatElements[track].push(sectorElement);
        this.trackNoteElements[track].push(noteElement);

        // Skip outer arcs
        if (track != 0) {
          return [sectorElement, noteElement];
        }

        // Outer arc element & cache
        const arcElement = arcStrokePath(v1x, v1y, v2x, v2y, outerTrackRadius);
        arcElement.classList.add("arc");
        this.trackArcElements.push(arcElement);

        return [sectorElement, noteElement, arcElement];
      };

      const sectorFillPath = (
        v1x: number,
        v1y: number,
        v2x: number,
        v2y: number,
        v3x: number,
        v3y: number,
        v4x: number,
        v4y: number,
        outerTrackRadius: number,
        innerTrackRadius: number,
      ): SVGPathElement => {
        // Draws outer arc v1-v4, line v4-v3, inner arc v3-v2, line v2-v1
        const sectorData = `M ${v1x} ${v1y}
                      A ${outerTrackRadius} ${outerTrackRadius} 0 0 1 ${v2x} ${v2y}
                      L ${v4x} ${v4y}
                      A ${innerTrackRadius} ${innerTrackRadius} 0 0 0 ${v3x} ${v3y}
                      Z`;

        const sectorElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        sectorElement.setAttribute("d", sectorData);
        sectorElement.classList.add("beat");

        return sectorElement;
      };

      const arcStrokePath = (
        v1x: number,
        v1y: number,
        v2x: number,
        v2y: number,
        outerTrackRadius: number,
      ): SVGPathElement => {
        // Draws arc from v1-v2
        const arcData = `M ${v1x} ${v1y}
                         A ${outerTrackRadius} ${outerTrackRadius} 0 0 1 ${v2x} ${v2y}`;

        // Creates arc element
        const arcElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arcElement.setAttribute("d", arcData);

        return arcElement;
      };

      const noteShape = (
        angle1: number,
        angle2: number,
        outerTrackRadius: number,
        innerTrackRadius: number,
      ): SVGCircleElement => {
        // Calculates polar coordinate of mean point
        const centerRadius = (outerTrackRadius + innerTrackRadius) / 2;
        const centerAngle = (angle1 + angle2) / 2;

        // Converts to cartesian coordinates
        const cx = centerRadius * Math.cos(centerAngle);
        const cy = centerRadius * Math.sin(centerAngle);

        // Creates circle element
        const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleElement.setAttribute("cx", cx.toString());
        circleElement.setAttribute("cy", cy.toString());

        return circleElement;
      };

      const loop = this.$refs.loop as SVGElement;

      const beats = this.beats;
      const tracks = this.tracks;

      const holeRadius = 0.25;

      // Angle starts 12 oclock, in radians
      const startAngle = -Math.PI / 2;
      const intervalAngle = (2 * Math.PI) / beats;

      const widthBetweenTracks = (1 - holeRadius) / tracks;

      // Loops through to create each sector of the circle, divided into tracks
      for (let track = 0; track < tracks; track++) {
        let outerTrackRadius = 1 - widthBetweenTracks * track;
        let innerTrackRadius = 1 - widthBetweenTracks * (track + 1);

        this.trackBeatElements.push([]);
        this.trackNoteElements.push([]);

        for (let beat = 0; beat < beats; beat++) {
          // Two angles which define sector
          let angle1 = startAngle + intervalAngle * beat;
          let angle2 = startAngle + intervalAngle * (beat + 1);

          // Appends all elements of sector to SVG
          createSector(angle1, angle2, outerTrackRadius, innerTrackRadius, track, beat).forEach(
            (element) => loop.appendChild(element),
          );
        }
      }
    },
    toggleNote(event: MouseEvent) {
      const target = event.target as SVGPathElement;

      // Get track and beat from element
      const track = parseInt(target.getAttribute("track") || "0");
      const beat = parseInt(target.getAttribute("beat") || "0");

      // Get note element from cache
      const note = this.loop.tracksData[track].beats[beat];

      // Toggle note
      this.loop.tracksData[track].beats[beat] = !note;

      if (note) return this.trackNoteElements[track][beat].classList.add("disabled");
      this.trackNoteElements[track][beat].classList.remove("disabled");
    },
    onBeat() {
      const beat = this.loop.currentBeat;
      console.log(beat);
      // Add class onBeat to sectors in current track
      this.trackArcElements[beat].classList.add("onBeat");

      // Remove class onBeat to sectors in current track
      this.trackArcElements[
        (beat - 1 + this.loop.beatCount) % this.loop.beatCount
      ].classList.remove("onBeat");
    },
  },
});
</script>

<!-- Custom styles instead of tailwind -->
<style>
.beat {
  fill: #0c0a09;
  transition: 150ms ease-out fill;
  stroke: #9f1239;
  stroke-width: 0.04;
}

.beat:hover {
  fill: #fecdd3;
  transition: 75ms ease-out fill;
}

.note {
  fill: #fb7185;
  stroke: #fb7185;
  stroke-width: 0;
  pointer-events: none;
  transition: 300ms ease-out stroke-width;
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

.arc {
  fill: none;
  stroke: none;
  stroke-width: 0.04;
}

.onBeat {
  animation: 1000ms ease-in onBeat;
}

@keyframes onBeat {
  0% {
    stroke: #9f1239;
  }
  10% {
    stroke: #fb7185;
  }
  90% {
    stroke: #fb7185;
  }
  100% {
    stroke: #9f1239;
  }
}
</style>
