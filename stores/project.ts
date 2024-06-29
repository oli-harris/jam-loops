export const useProjectStore = defineStore({
  id: "projectStore",
  state: () => ({
    projectTitle: "My Project",
    projectUuid: "projectUUID",
  }),
  actions: {},
  persist: true,
});
