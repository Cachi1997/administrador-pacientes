import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Patient } from "@pacientes/shared";

type PatientUiState = {
  activeId: Patient["id"] | null;
  setActiveId: (id: Patient["id"]) => void;
  clearActiveId: () => void;
};

export const usePatientStore = create<PatientUiState>()(
  devtools((set) => ({
    activeId: null,
    setActiveId: (id) => set({ activeId: id }),
    clearActiveId: () => set({ activeId: null }),
  })),
);
