export const useLoopsStore = defineStore({
  id: "loopsStore",
  state: () => ({
    liveLoopsUUIDs: [] as string[], // Array of uuids of loops live to be played
    loops: {} as Loops, // All of users loops
    loopConstraints: {
      maxTracks: 5,
      minTracks: 1,
      maxBeats: 16,
      minBeats: 2,
    },
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  getters: {
    liveLoops(): Loop[] {
      // Returns an array of live loops
      return this.liveLoopsUUIDs.map((uuid) => this.loops[uuid]);
    },
    loopsArray(state): Loop[] {
      const loops = Object.values(state.loops);
      loops.sort((a, b) => a.position - b.position);

      return loops;
    },
    liveSamples(): string[] {
      // Returns array of sample uuids
      const samples = this.liveLoops.reduce((acc: string[], loop: Loop) => {
        loop.tracksData.forEach((track: Track) => acc.push(track.trackSample));
        return acc;
      }, []);

      return samples;
    },
  },
  actions: {
    // Lifecycle of loops
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
      this.liveLoopsUUIDs.push(uuid);
    },
    removeLiveLoop(uuid: string) {
      useControllerStore().stop();

      const index = this.liveLoopsUUIDs.indexOf(uuid);
      this.liveLoopsUUIDs.splice(index);
    },

    // Editing loops
    addTrack(uuid: string, position: number) {
      const loop = this.loops[uuid];

      const beatCount = loop.beatCount;

      const trackData = {
        trackSample: "",
        beats: Array.from({ length: beatCount }, () => false),
      };

      loop.trackCount += 1;
      loop.tracksData.splice(position, 0, trackData);

      useControllerStore().stop();
    },
    removeTrack(uuid: string, position: number) {
      const loop = this.loops[uuid];

      loop.trackCount -= 1;
      this.loops[uuid].tracksData.splice(position, 1);

      useControllerStore().stop();
    },
    addBeat(uuid: string, position: number) {
      const loop = this.loops[uuid];

      loop.beatCount += 1;
      loop.tracksData.forEach((track) => {
        track.beats.splice(position, 0, false);
      });

      useControllerStore().stop();
    },
    removeBeat(uuid: string, position: number) {
      const loop = this.loops[uuid];

      loop.beatCount -= 1;
      loop.tracksData.forEach((track) => {
        track.beats.splice(position, 1);
      });

      useControllerStore().stop();
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
  position: number; // Zero index position in viewer
  loopTitle: string; // Name of loop
  beatCount: number; // Number of beats
  trackCount: number; // Number of tracks
  currentBeat: number;
  tracksData: Track[]; // Contents of each track, starting from outer track
}

export interface Track {
  trackSample: string; // uuid of sample used
  beats: boolean[];
}
