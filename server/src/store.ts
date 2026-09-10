import { randomUUID } from "node:crypto";
import type { DraftPatient, Patient } from "@pacientes/shared";

let patients: Patient[] = [];

export const listPatients = (): Patient[] => patients;

export const findPatient = (id: string): Patient | undefined =>
  patients.find((patient) => patient.id === id);

export const createPatient = (draft: DraftPatient): Patient => {
  const patient: Patient = { id: randomUUID(), ...draft };
  patients.push(patient);
  return patient;
};

export const updatePatient = (
  id: string,
  draft: DraftPatient,
): Patient | undefined => {
  const index = patients.findIndex((patient) => patient.id === id);
  if (index === -1) return undefined;
  patients[index] = { ...patients[index], ...draft };
  return patients[index];
};

export const deletePatient = (id: string): boolean => {
  const index = patients.findIndex((patient) => patient.id === id);
  if (index === -1) return false;
  patients.splice(index, 1);
  return true;
};
