import type { DraftPatient, Patient } from "@pacientes/shared";
import { prisma } from "./prisma";
import type { Patient as PatientRow } from "./generated/prisma/client";

// La base guarda la fecha como Date; el resto de la app la usa como "YYYY-MM-DD".
const toPatient = (row: PatientRow): Patient => ({
  id: row.id,
  name: row.name,
  caretaker: row.caretaker,
  email: row.email,
  date: row.date.toISOString().slice(0, 10),
  symptoms: row.symptoms,
});

export const listPatients = async (): Promise<Patient[]> => {
  const rows = await prisma.patient.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toPatient);
};

export const findPatient = async (id: string): Promise<Patient | undefined> => {
  const row = await prisma.patient.findUnique({ where: { id } });
  return row ? toPatient(row) : undefined;
};

export const createPatient = async (draft: DraftPatient): Promise<Patient> => {
  const row = await prisma.patient.create({
    data: { ...draft, date: new Date(draft.date) },
  });
  return toPatient(row);
};

export const updatePatient = async (
  id: string,
  draft: DraftPatient,
): Promise<Patient | undefined> => {
  const exists = await prisma.patient.findUnique({ where: { id } });
  if (!exists) return undefined;

  const row = await prisma.patient.update({
    where: { id },
    data: { ...draft, date: new Date(draft.date) },
  });
  return toPatient(row);
};

export const deletePatient = async (id: string): Promise<boolean> => {
  const { count } = await prisma.patient.deleteMany({ where: { id } });
  return count > 0;
};
