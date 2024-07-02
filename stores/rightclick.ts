export const useRightClickStore = defineStore({
  id: "rightClickStore",
  state: () => {
    return {
      onRightClick: (event: MouseEvent, type: string[]) => {},
    };
  },
  actions: {
    rightClick(event: MouseEvent, type: string[]) {
      event.preventDefault();
      this.onRightClick(event, type);
    },
  },
});
