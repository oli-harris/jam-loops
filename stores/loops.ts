import type { PiniaPluginContext } from "pinia";
import Loop from "~/components/Loop.vue";

export const useLoopsStore = defineStore({
  id: "loopsStore",
  state: () => ({
    loops: {} as Loops,
    maxTracks: 5,
    minTracks: 1,
    maxBeats: 16,
    minBeats: 2,
  }),
  persist: true,
  getters: {
    loop(state) {
      return (uuid: string) => state.loops[uuid];
    },
    positionedLoops(): Loop[] {
      // Returns an array of loops sorted by position
      const loops = this.loopsArray;

      loops.sort((a, b) => a.position - b.position);

      return loops;
    },
    loopsArray(state): Loop[] {
      const loops = Object.values(state.loops);

      return loops;
    },
    getAllRhythms(state): { beatCount: number; uuid: string }[] {
      // Seperates different loops of same beatcount into object and list of uuids
      const loops = this.loopsArray;

      const rhythms = loops.map((loop) => ({ beatCount: loop.beatCount, uuid: loop.uuid }));

      return rhythms;
    },
    getAllSamples(): string[] {
      // Returns array of sample uuids
      const samples = this.loopsArray.reduce((acc: string[], loop: Loop) => {
        loop.tracksData.forEach((track: Track) => acc.push(track.trackSample));
        return acc;
      }, []);

      return samples;
    },
  },
  actions: {
    addEmptyLoop(loopTitle: string, beatCount: number, trackCount: number) {
      const uuid = crypto.randomUUID().toString();

      const newLoop = {
        uuid: uuid,
        onBeat: () => {},
        resetBeat: () => {},
        isPlaying: false,
        currentBeat: 0,
        position: Object.keys(this.loops).length,
        loopTitle: loopTitle,
        beatCount: beatCount,
        trackCount: trackCount,

        // TracksData must have new instances and not references
        tracksData: Array.from({ length: trackCount }, (_, trackNumber) => ({
          trackSample: "",
          beats: Array.from({ length: beatCount }, () => false),
        })),
      };

      this.loops[uuid] = newLoop;
    },
    deleteLoop(uuid: string) {
      delete this.loops[uuid];
    },
    // Editing loops funcitonality
    addTrack(uuid: string, position: number) {
      const loop = this.loops[uuid];

      const beatCount = loop.beatCount;

      const trackData = {
        trackSample: "",
        beats: Array.from({ length: beatCount }, () => false),
      };

      loop.tracksData.splice(position, 0, trackData);
    },
    removeTrack(uuid: string, position: number) {
      this.loops[uuid].tracksData.splice(position, 1);
    },
    // Notes functionality
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
  onBeat: () => void; // Beat indexed from 0
  resetBeat: () => void;
  isPlaying: boolean;
  position: number; // Zero index position in grid
  loopTitle: string; // Name of loop
  beatCount: number; // Number of beats
  currentBeat: number;
  tracksData: Track[]; // Contents of each track, starting from outer track
}

export interface Track {
  trackSample: string; // uuid of sample used
  beats: boolean[];
}
