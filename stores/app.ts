export const useAppStore = defineStore({
  id: "appStore",
  state: () => ({
    // Drag-drop functionality of tracks
    addingTrack: false,
    trackSample: "",
  }),
  actions: {},
});
