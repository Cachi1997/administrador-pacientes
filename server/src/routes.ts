import { Router } from "express";
import { draftPatientSchema } from "@pacientes/shared";
import {
  createPatient,
  deletePatient,
  findPatient,
  listPatients,
  updatePatient,
} from "./store";

export const patientsRouter = Router();

const parseDraft = (body: unknown) => {
  const result = draftPatientSchema.safeParse(body);
  if (result.success) return { data: result.data, errors: null };

  const errors = Object.fromEntries(
    result.error.issues.map((issue) => [issue.path.join("."), issue.message]),
  );
  return { data: null, errors };
};

patientsRouter.get("/", async (_req, res) => {
  res.json(await listPatients());
});

patientsRouter.get("/:id", async (req, res) => {
  const patient = await findPatient(req.params.id);
  if (!patient) {
    res.status(404).json({ message: "Paciente no encontrado" });
    return;
  }
  res.json(patient);
});

patientsRouter.post("/", async (req, res) => {
  const { data, errors } = parseDraft(req.body);
  if (!data) {
    res.status(400).json({ errors });
    return;
  }
  res.status(201).json(await createPatient(data));
});

patientsRouter.put("/:id", async (req, res) => {
  const { data, errors } = parseDraft(req.body);
  if (!data) {
    res.status(400).json({ errors });
    return;
  }
  const patient = await updatePatient(req.params.id, data);
  if (!patient) {
    res.status(404).json({ message: "Paciente no encontrado" });
    return;
  }
  res.json(patient);
});

patientsRouter.delete("/:id", async (req, res) => {
  if (!(await deletePatient(req.params.id))) {
    res.status(404).json({ message: "Paciente no encontrado" });
    return;
  }
  res.status(204).end();
});
