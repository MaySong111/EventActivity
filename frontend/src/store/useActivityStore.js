import { create } from "zustand";

const useActivityStore = create((set) => ({
  filter: "",
  startDate: null,
  setFilter: (newFilter) => set({ filter: newFilter }),
  setStartDate: (newStartDate) => set({ startDate: newStartDate }),
}));
export default useActivityStore;
