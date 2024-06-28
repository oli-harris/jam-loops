import { start, Loop, getTransport, ToneAudioBuffer, Player, Volume } from "tone";
import type { Track } from "./loops";

const audioState = {} as Audio;

export const useControllerStore = defineStore({
  id: "controllerStore",
  state: () => ({
    playing: false,
    tempo: 120,
    volume: 0.8, // Percentage volume
    beatsPerMeasure: 4, // Represents numerator in time signature
  }),
  actions: {
    init() {
      // Starts tonejs so always avaible to play sounds
      start();
      console.log("Tone.js ready to play");

      return true;
    },
    play() {
      if (this.playing) return;
      this.playing = true;

      // Rebinds beats each time to ensure state correct
      this.addSampleBuffers();
      this.initiateBeats();

      // Initialises tone.js
      getTransport().bpm.value = this.tempo;

      // Start loops
      getTransport().start();
    },
    stop() {
      if (!this.playing) return;
      this.playing = false;

      // Stops tone.js
      getTransport().stop();
      getTransport().cancel();

      // Resets beat to start
      useLoopsStore().loopsArray.forEach((loop) => {
        loop.currentBeat = 0;
      });
    },
    addSampleBuffers() {
      // Adds new samples to tonejs.buffer and instantiates player
      const samples = useLoopsStore().getAllSamples;

      samples.forEach((sampleUuid: string) => {
        // Skip if already buffered
        if (sampleUuid in audioState) return;

        const samplePath = useSamplesStore().samplePaths[sampleUuid];

        const buffer = new ToneAudioBuffer(
          samplePath,
          () => {
            // Buffer loaded
            this.addSamplePlayer(buffer, sampleUuid);
          },
          (error) => {
            console.log("Error loading buffer", error);
          },
        );
      });
    },
    addSamplePlayer(buffer: ToneAudioBuffer, sampleUuid: string) {
      // Create player on load
      const player = new Player(buffer).toDestination();

      audioState[sampleUuid] = {
        buffer: buffer,
        player: player,
      };
    },
    initiateBeats() {
      const beatDuration = (beats: number): number => {
        // Duration of each beat on the time signature, and measure in seconds
        const beatDuration = 60 / this.tempo;
        const measureDuration = this.beatsPerMeasure * beatDuration;

        return measureDuration / beats;
      };

      const rhythms = useLoopsStore().getAllRhythms;

      // Binds function to play beat at constant intervals of the beat duration
      rhythms.forEach((loop) => {
        const beatCount = loop.beatCount;
        const loopUuid = loop.uuid;

        const interval = beatDuration(beatCount);

        const newLoop = new Loop((time) => {
          this.playLoopNotes(loopUuid, time);
        }, interval).start(0);
      });
    },
    playLoopNotes(loopUuid: string, time: number) {
      const loop = useLoopsStore().loops[loopUuid];
      const currentBeat = loop.currentBeat;

      // Plays notes using tonejs
      loop.tracksData.forEach((track: Track) => {
        // Check if there is a note to be played
        if (!track.beats[currentBeat]) return;
        const sampleUuid = track.trackSample;

        this.playNote(sampleUuid, time);
      });

      // Plays beat animation
      loop.onBeat();

      // Increment current beat
      loop.currentBeat = (loop.currentBeat + 1) % loop.beatCount;
    },
    playNote(sampleUuid: string, time: number = 0) {
      const player = audioState[sampleUuid].player;

      // Check player state
      if (player.state === "started") player.stop(time);

      // Play sample
      player.start(time);
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

interface Audio {
  [uuid: string]: {
    buffer: ToneAudioBuffer;
    player: Player;
  };
}
