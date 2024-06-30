import { start, Loop, getTransport, ToneAudioBuffer, Player, getDraw } from "tone";
import type { Track } from "./loops";

const audioState = {} as Audio;

export const useControllerStore = defineStore({
  id: "controllerStore",
  state: () => ({
    playing: false,
    tempo: 120,
    volume: 0.8, // Percentage volume
    beatsPerMeasure: 4, // Represents numerator in time signature
    isInitialised: false,
  }),
  actions: {
    init() {
      if (this.isInitialised) return;
      this.isInitialised = true;

      // Starts tonejs so always avaible to play sounds
      start();
      this.addSampleBuffers();
      console.log("Tone.js ready to play");
    },
    play() {
      if (this.playing) return;
      this.playing = true;

      this.init();
      // Rebinds beats each time to ensure state correct
      this.addSampleBuffers();
      this.initiateBeats();

      // Initialises tone.js
      getTransport().bpm.value = this.tempo;

      // Sets state of loops
      useLoopsStore().loopsArray.forEach((loop) => {
        loop.currentBeat = 0;
        loop.isPlaying = true;
      });

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
        loop.isPlaying = false;
        loop.resetBeat();
      });
    },
    addSampleBuffers() {
      // Adds new samples to tonejs.buffer and instantiates player
      const samples = useLoopsStore().getAllSamples;

      samples.forEach((sampleUuid: string) => this.bufferSample(sampleUuid));
    },
    bufferSample(sampleUuid: string): Promise<Player> {
      return new Promise((resolve, reject) => {
        // Skip if no sample or already buffered
        if (sampleUuid === "") return;
        if (sampleUuid in audioState) resolve(audioState[sampleUuid].player);

        const samplePath = useSamplesStore().samples[sampleUuid].samplePath;

        // Create buffer
        const buffer = new ToneAudioBuffer(
          samplePath,
          () => {
            // Create player on buffer load
            const player = new Player(buffer).toDestination();

            audioState[sampleUuid] = {
              buffer: buffer,
              player: player,
            };

            resolve(player);
          },
          (error) => {
            console.log("Error loading buffer");
            reject(error);
          },
        );
      });
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

      // Plays beat animation
      getDraw().schedule(loop.onBeat, time);

      // Plays notes using tonejs
      loop.tracksData.forEach((track: Track) => {
        // Check if there is a note to be played
        if (!track.beats[currentBeat]) return;
        const sampleUuid = track.trackSample;

        this.playNote(sampleUuid, time);
      });

      loop.currentBeat = (loop.currentBeat + 1) % loop.beatCount;
    },
    previewNote(sampleUuid: string) {
      if (!this.isInitialised) return;
      // If not buffered, buffer note
      this.bufferSample(sampleUuid).then(() => {
        console.log("playing note");
        this.playNote(sampleUuid);
      });
    },
    playNote(sampleUuid: string, time: number = 0) {
      if (!(sampleUuid in audioState)) return;
      const player = audioState[sampleUuid].player;

      // Check player state
      if (player.state === "started") player.stop(time);

      // Play sample
      try {
        player.start(time);
      } catch {
        console.log("Sample not loaded");
      }
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
