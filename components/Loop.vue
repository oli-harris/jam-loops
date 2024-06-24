<template>
  <div class="flex justify-center items-center h-full">
    <div class="loop aspect-square h-[22rem]">
      <svg ref="loop" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-1.05 -1.05 2.1 2.1">
        
      </svg>
    </div>
  </div>
</template>


<script lang="ts">
export default defineComponent ({
  props: {
    beats: {
      type: Number,
      required: true
    },
    tracks: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      trackBeats: [] as SVGPathElement[][],
      trackArcs: [] as SVGPathElement[],
    }
  },
  mounted() {
    this.createLoopSVG()
  },
  methods: {
    createLoopSVG() {
      // Creates a SVG of a disc divided into segments and rings
      // Each ring is a track, and each track is divided into beats
      const beats = this.beats
      const intervalAngle = 2 * Math.PI / beats;
      const tracks = this.tracks;
      
      const holeRadius = 0.25;
      
      const d = (1 - holeRadius) / tracks;
      
      const createSector = (angle1: number, angle2: number, outerTrackRadius: number, innerTrackRadius: number, track:number, beat: number): SVGPathElement[] => {
        // Obtains positions of each vertex of segment for a unit circle
        const getVertex = (angle: number, radius: number): [number, number] => {
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return [x, y]
        };
        
        const [v1x, v1y] = getVertex(angle1, outerTrackRadius)
        const [v2x, v2y] = getVertex(angle2, outerTrackRadius)

        const [v3x, v3y] = getVertex(angle1, innerTrackRadius)
        const [v4x, v4y] = getVertex(angle2, innerTrackRadius)

        const sectorElement = sectorFillPath(v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y, outerTrackRadius, innerTrackRadius)
        sectorElement.setAttribute("beat", beat.toString())
        sectorElement.setAttribute("track", track.toString())
        
        // Caches each beat for performance
        this.trackBeats[track].push(sectorElement)
        
        // Cache outer arcs
        if (track == 0) {
          const arcElement = arcStrokePath(v1x, v1y, v2x, v2y, outerTrackRadius)
          this.trackArcs.push(arcElement)

          return [sectorElement, arcElement]
        }


        return [sectorElement]
      }

      const sectorFillPath = (v1x: number, v1y: number, v2x: number, v2y: number, v3x: number, v3y: number, v4x: number, v4y: number, outerTrackRadius: number, innerTrackRadius: number): SVGPathElement => {
        // Draws outer arc v1-v4, line v4-v3, inner arc v3-v2, line v2-v1
        const sectorData = `M ${v1x} ${v1y}
                      A ${outerTrackRadius} ${outerTrackRadius} 0 0 1 ${v2x} ${v2y}
                      L ${v4x} ${v4y}
                      A ${innerTrackRadius} ${innerTrackRadius} 0 0 0 ${v3x} ${v3y}
                      Z`;

        const sectorElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        sectorElement.setAttribute('d', sectorData);
        sectorElement.classList.add("beat")

        return sectorElement;
      }

      const arcStrokePath = (v1x: number, v1y: number, v2x: number, v2y: number, outerTrackRadius: number): SVGPathElement => {
        // Draws radius from v1-v2
        const arcData = `M ${v1x} ${v1y}
                         A ${outerTrackRadius} ${outerTrackRadius} 0 0 1 ${v2x} ${v2y}`;

        const arcElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        arcElement.setAttribute('d', arcData);
        arcElement.classList.add("arc")

        return arcElement;
      }
      
      const loop = this.$refs.loop as SVGElement
      
      // Loops through to create each sector of the circle, divided into tracks
      for (let track = 0; track < tracks; track++) {
        let outerTrackRadius = 1 - d * track
        let innerTrackRadius = 1 - d * (track + 1)

        this.trackBeats.push([])

        for (let beat =0; beat < beats; beat++) {
          // Angle starts at 12 o'clock
          let angle1 = intervalAngle * (beat - 2)
          let angle2 = intervalAngle * (beat - 1)
          
          // Appends all elements of sector to SVG
          createSector(angle1, angle2, outerTrackRadius, innerTrackRadius, track, beat).forEach(element => loop.appendChild(element))
        }
      }
    },

  }
});
</script>

<style>
.beat {
  fill: #0c0a09;
  transition: 150ms ease-out fill;
  stroke: #e11d48;
  stroke-width: 0.04;
}

.beat:hover {
  fill: #fecdd3;
  transition: 75ms ease-out fill;
}

.arc {
  fill: none;
  stroke: none;
  stroke-width: 0.04;
}
</style>