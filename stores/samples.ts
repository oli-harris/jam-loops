export const useSamplesStore = defineStore({
  id: "samplesStore",
  state: () => {
    return {
      packs: {} as Packs,
    };
  },
  getters: {
    packsArray(): Pack[] {
      return Object.values(this.packs);
    },
    samples(): Record<string, Sample> {
      // Returns obj of sample uuids and paths
      let samplesObj: Record<string, Sample> = {};

      this.packsArray.forEach((pack: Pack) => {
        Object.entries(pack.samples).forEach(([key, sample]: [string, Sample]) => {
          samplesObj[key] = sample;
        });
      });

      return samplesObj;
    },
    // samplePaths(): Record<string, string> {
    //   // Returns obj of sample uuids and paths
    //   let paths: Record<string, string> = {};

    //   this.packsArray.forEach((pack: Pack) => {
    //     Object.entries(pack.samples).forEach(([key, sample]: [string, Sample]) => {
    //       paths[key] = sample.samplePath;
    //     });
    //   });

    //   return paths;
    // },
  },
  actions: {
    async fetchSamplePacks() {
      // Dont fetch if data already been fetched
      if (Object.keys(this.packs).length !== 0) return;

      const host = useRequestURL().origin;
      const baseURL = useRuntimeConfig().app.baseURL;
      const path = "samples/packs/packs.json";

      const url = `${host}${baseURL}${path}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: Packs = (await response.json()) || {};

      this.packs = data as Packs;
    },
  },
});

export interface Packs {
  uuid: Pack;
}

export interface Pack {
  samplePackTitle: string;
  samples: { uuid: Sample };
}

export interface Sample {
  sampleTitle: string;
  samplePath: string;
}
