import { defineStore } from "pinia";

export const useLoopsStore = defineStore({
  id: "loopsStore",
  state: () => ({
    loops: {} as Loops,
  }),
  getters: {
    positionedLoops(): Loop[] {
      // Returns an array of loops sorted by position

      const loops = Object.values(this.loops);

      loops.sort((a, b) => a.position - b.position);

      return loops;
    },
  },
  actions: {
    addEmptyLoop(loopTitle: string, beatCount: number, trackCount: number) {
      const uuid = crypto.randomUUID().toString();

      const instrument = "drum"; // temporary value

      const newLoop = {
        uuid: uuid,
        onBeat: () => {},
        position: Object.keys(this.loops).length,
        loopTitle: loopTitle,
        beatCount: beatCount,
        trackCount: trackCount,

        // TracksData must have new instances and not references
        tracksData: Array.from({ length: trackCount }, () => ({
          instrument: instrument,
          beats: Array.from({ length: beatCount }, () => false),
        })),
      };

      this.loops[uuid] = newLoop;
    },
    addNote(uuid: string, beat: number, track: number) {
      const selectedLoop = this.loops[uuid];

      selectedLoop.tracksData[track].beats[beat] = true;
    },
    removeNote(uuid: string, beat: number, track: number) {
      const selectedLoop = this.loops[uuid];

      selectedLoop.tracksData[track].beats[beat] = false;
    },
  },
});

export interface Loops {
  [uuid: string]: Loop;
}

export interface Loop {
  uuid: string;
  onBeat: (beat: number) => void; // Beat indexed from 0
  position: number; // Zero index position
  loopTitle: string; // Name of loop
  beatCount: number; // Number of beats
  trackCount: number; // Number of tracks
  tracksData: Track[]; // Contents of each track, starting from outer track
}

export interface Track {
  instrument: string; // uuid of instrument used
  beats: boolean[];
}
