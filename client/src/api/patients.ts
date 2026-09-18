import type { DraftPatient, Patient } from "@pacientes/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export type FieldErrors = Partial<Record<keyof DraftPatient, string>>;

export class ValidationError extends Error {
  errors: FieldErrors;

  constructor(errors: FieldErrors) {
    super("Datos inválidos");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (response.status === 400) {
    const body = (await response.json()) as { errors?: FieldErrors };
    throw new ValidationError(body.errors ?? {});
  }

  if (!response.ok) {
    throw new Error(`Error ${response.status} al llamar a la API`);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
};

export const getPatients = () => request<Patient[]>("/patients");

export const createPatient = (draft: DraftPatient) =>
  request<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(draft),
  });

export const updatePatient = (id: Patient["id"], draft: DraftPatient) =>
  request<Patient>(`/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(draft),
  });

export const deletePatient = (id: Patient["id"]) =>
  request<void>(`/patients/${id}`, { method: "DELETE" });
