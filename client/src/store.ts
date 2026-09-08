import { create } from "zustand";
import type { DraftPatient, Patient } from "@pacientes/shared";
import { v4 as uuidv4 } from "uuid";
import { devtools, persist } from "zustand/middleware";

type PatientState = {
  patients: Patient[];
  activeId: Patient["id"] | null;
  addPatient: (data: DraftPatient) => void;
  deletePatient: (id: Patient["id"]) => void;
  getPatientById: (id: Patient["id"]) => void;
  clearActiveId: () => void;
  updatePatient: (data: DraftPatient) => void;
};

const createPatient = (patient: DraftPatient): Patient => {
  return {
    ...patient,
    id: uuidv4(),
  };
};

export const usePatientStore = create<PatientState>()(
  devtools(
    persist(
      (set) => ({
        patients: [],
        activeId: null,
        addPatient: (data) => {
          const newPatient = createPatient(data);
          set((state) => ({
            patients: [...state.patients, newPatient],
          }));
        },
        deletePatient: (id) => {
          set((state) => ({
            patients: state.patients.filter((patient) => patient.id !== id),
            // Si se elimina el paciente en edición, salimos del modo edición.
            activeId: state.activeId === id ? null : state.activeId,
          }));
        },
        getPatientById: (id) => {
          set(() => ({
            activeId: id,
          }));
        },
        clearActiveId: () => {
          set(() => ({
            activeId: null,
          }));
        },
        updatePatient: (data) => {
          set((state) => {
            if (!state.activeId) return state;

            return {
              patients: state.patients.map((patient) =>
                patient.id === state.activeId
                  ? { ...patient, ...data }
                  : patient,
              ),
              activeId: null,
            };
          });
        },
      }),
      {
        name: "patient-storage",
        partialize: (state) => ({ patients: state.patients }),
      },
    ),
  ),
);
