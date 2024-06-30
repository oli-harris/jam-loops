import { start, Loop, getTransport, ToneAudioBuffer, Player, getDraw, Volume } from "tone";
import type { Track } from "./loops";

// Tonejs doesn't work well with states
const audioState = {} as Audio;
let volume: Volume;

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
      // Creates volume node
      volume = new Volume().toDestination();

      // Prebuffer instruments
      this.addSampleBuffers();
      console.log("Tone.js ready to play");
    },
    play() {
      if (this.playing) return;
      this.playing = true;

      this.init();
      this.addSampleBuffers();

      // Rebinds beats each time to ensure state correct
      this.initiateBeats();

      // Initialises tone.js
      // Tempo must be divided by 2, weird workaround to ensure 4 beats in a measure
      this.setBPM();
      this.setVolume();

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
      const beatDuration = (beats: number): string => {
        // Returns duration of each beat in terms of measures, where 1 measure is 4 beats in a 4/4 timesignature
        console.log(`${1 / beats}m`);
        return `${1 / beats}m`;
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
    setBPM() {
      getTransport().bpm.value = this.tempo / 2;
    },
    setVolume() {
      const volumeDB = volumePercentageToDB(this.volume);

      Object.values(audioState).forEach((audio) => {
        audio.player.volume.value = volumeDB;
      });
    },
  },
});

const volumePercentageToDB = (volumePercentage: number): number => {
  // ToneJS uses volume in DB with 0 being max
  const volumeDB = Math.max(20 * Math.log10(volumePercentage), -1000);
  console.log(volumeDB);

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
