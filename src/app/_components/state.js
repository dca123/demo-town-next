import { create } from "zustand";

export const useDialogStore = create((set) => ({
  showDialog: false,
  texts: [],
  houseId: undefined,
  openDialog: (texts, houseId) => set({ showDialog: true, texts, houseId }),
  closeDialog: () => set({ showDialog: false, texts: [], houseId: undefined }),
}));
