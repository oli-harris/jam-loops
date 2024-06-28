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
  },
  actions: {
    async fetchSamplePacks() {
      // Dont fetch if data already been fetched
      if (Object.keys(this.packs).length !== 0) return;

      const response = await fetch("/samples/packs/packs.json");

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data: Packs = (await response.json()) || {};
      console.log(data);

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
