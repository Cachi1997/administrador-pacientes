import { z } from "zod";
import {
  draftPatientSchema,
  patientSchema,
  type DraftPatient,
  type Patient,
} from "@pacientes/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const fieldErrorsSchema = z.partialRecord(
  draftPatientSchema.keyof(),
  z.string(),
);
const validationErrorBodySchema = z.object({ errors: fieldErrorsSchema });

export type FieldErrors = z.infer<typeof fieldErrorsSchema>;

export class ValidationError extends Error {
  errors: FieldErrors;

  constructor(errors: FieldErrors) {
    super("Datos inválidos");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

// El tipo de lo que devuelve sale de la validación, no de una promesa con `as`.
const parse = <S extends z.ZodType>(schema: S, data: unknown): z.infer<S> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Respuesta inesperada de la API:", result.error.issues);
    throw new Error("La API devolvió datos con un formato inesperado");
  }
  return result.data;
};

const request = async (path: string, init?: RequestInit): Promise<unknown> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (response.status === 400) {
    const body = parse(validationErrorBodySchema, await response.json());
    throw new ValidationError(body.errors);
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status} al llamar a la API`);
  }

  if (response.status === 204) return undefined;

  return response.json();
};

export const getPatients = async (): Promise<Patient[]> =>
  parse(patientSchema.array(), await request("/patients"));

export const createPatient = async (draft: DraftPatient): Promise<Patient> =>
  parse(
    patientSchema,
    await request("/patients", { method: "POST", body: JSON.stringify(draft) }),
  );

export const updatePatient = async (
  id: Patient["id"],
  draft: DraftPatient,
): Promise<Patient> =>
  parse(
    patientSchema,
    await request(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(draft),
    }),
  );

export const deletePatient = async (id: Patient["id"]): Promise<void> => {
  await request(`/patients/${id}`, { method: "DELETE" });
};
