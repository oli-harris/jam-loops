import { Loop, getTransport } from "tone";
import type { Track } from "./loops";

export const useControllerStore = defineStore({
  id: "controllerStore",
  state: () => ({
    playing: false,
    tempo: 60,
    volume: 0.8, // Percentage volume
    beatsPerMeasure: 4, // Represents numerator in time signature
  }),
  actions: {
    play() {
      if (this.playing) return;
      this.playing = true;

      this.bindBeats();
      getTransport().start();
    },
    stop() {
      if (!this.playing) return;

      this.playing = false;
    },
    bindBeats() {
      const beatDuration = (beats: number): number => {
        // Duration of each beat on the time signature, and measure in seconds
        const beatDuration = 60 / this.tempo;
        const measureDuration = this.beatsPerMeasure * beatDuration;

        return measureDuration / beats;
      };

      const rhythms = useLoopsStore().getAllRhythms;

      // Binds function to play beat at constant intervals of the beat duration
      rhythms.forEach((e) => {
        const beatCount = e.beatCount;
        const uuid = e.uuid;
        console.log(beatCount, uuid);

        const interval = beatDuration(beatCount);

        const loop = new Loop((time) => {
          this.playBeat(uuid);
        }, interval).start(0);
      });
    },
    playBeat(uuid: string) {
      const loop = useLoopsStore().loops[uuid];

      // Triggers animation
      loop.onBeat();

      loop.tracksData.forEach((track: Track) => {
        const instrument = track.instrument;
      });

      // Increment current beat
      loop.currentBeat = (loop.currentBeat + 1) % loop.beatCount;
    },
  },
});

const volumePercentageToDB = (volumePercentage: number): number => {
  // ToneJS uses volume in DB with 0 being max
  const volumeDB = 10 * Math.log10(volumePercentage);

  return volumeDB;
};

const getInstrument = (uuid: string): string => {
  return "";
};
