import { z } from "zod";

export const patientSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, "El nombre del paciente es obligatorio"),
  caretaker: z
    .string()
    .trim()
    .min(1, "El nombre del propietario es obligatorio"),
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .pipe(z.email("Email no válido")),
  date: z
    .string()
    .min(1, "La fecha de alta es obligatoria")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato AAAA-MM-DD"),
  symptoms: z.string().trim().min(1, "Los síntomas son obligatorios"),
});

export const draftPatientSchema = patientSchema.omit({ id: true });

export type Patient = z.infer<typeof patientSchema>;
export type DraftPatient = z.infer<typeof draftPatientSchema>;
