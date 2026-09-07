import { create } from "zustand";

export type AppRole = "patient" | "caregiver";

interface AppState {
  role: AppRole;
  demoMode: boolean;
  setRole: (role: AppRole) => void;
  setDemoMode: (demoMode: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: "patient",
  demoMode: true,
  setRole: (role) => set({ role }),
  setDemoMode: (demoMode) => set({ demoMode }),
}));
