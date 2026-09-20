import { describe, expect, it } from "vitest";
import request from "supertest";
import { z } from "zod";
import { patientSchema, type DraftPatient } from "@pacientes/shared";
import { app } from "./app";

const draft: DraftPatient = {
  name: "Michi",
  caretaker: "Ana Lopez",
  email: "ana@test.com",
  date: "2025-01-01",
  symptoms: "Control anual",
};

// supertest tipa response.body como `any`: lo validamos para trabajar con tipos reales.
const asPatient = (body: unknown) => patientSchema.parse(body);
const asPatients = (body: unknown) => patientSchema.array().parse(body);
const asErrors = (body: unknown) =>
  z.object({ errors: z.record(z.string(), z.string()) }).parse(body).errors;
const asMessage = (body: unknown) =>
  z.object({ message: z.string() }).parse(body).message;

const crear = (overrides: Partial<DraftPatient> = {}) =>
  request(app)
    .post("/api/patients")
    .send({ ...draft, ...overrides });

const crearPaciente = async (overrides: Partial<DraftPatient> = {}) =>
  asPatient((await crear(overrides)).body);

describe("GET /api/patients", () => {
  it("devuelve un array vacio cuando no hay pacientes", async () => {
    const response = await request(app).get("/api/patients");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("devuelve los pacientes creados", async () => {
    await crear({ name: "Michi" });
    await crear({ name: "Pelusa" });

    const response = await request(app).get("/api/patients");
    const names = asPatients(response.body).map((patient) => patient.name);

    expect(names).toHaveLength(2);
    expect(names).toEqual(expect.arrayContaining(["Michi", "Pelusa"]));
  });
});

describe("POST /api/patients", () => {
  it("crea un paciente y le asigna un id", async () => {
    const response = await crear();

    expect(response.status).toBe(201);
    expect(asPatient(response.body)).toMatchObject({
      name: "Michi",
      date: "2025-01-01",
    });
  });

  it("recorta los espacios de los campos de texto", async () => {
    const response = await crear({
      name: "   Michi   ",
      email: "  ana@test.com  ",
    });

    // Sin el schema compartido: su .trim() recortaria de nuevo y el test
    // pasaria aunque el servidor no lo hiciera.
    const body = z
      .object({ name: z.string(), email: z.string() })
      .parse(response.body);

    expect(body.name).toBe("Michi");
    expect(body.email).toBe("ana@test.com");
  });

  it("rechaza un body invalido con un mensaje por campo", async () => {
    const response = await request(app).post("/api/patients").send({
      name: "",
      caretaker: "Ana",
      email: "no-es-email",
      date: "01/01/2025",
      symptoms: "Control",
    });

    expect(response.status).toBe(400);
    expect(asErrors(response.body)).toEqual({
      name: "El nombre del paciente es obligatorio",
      email: "Email no válido",
      date: "La fecha debe tener el formato AAAA-MM-DD",
    });
  });

  it("distingue una fecha vacia de una con formato invalido", async () => {
    const response = await crear({ date: "" });

    expect(response.status).toBe(400);
    expect(asErrors(response.body).date).toBe("La fecha de alta es obligatoria");
  });

  it("no guarda nada cuando el body es invalido", async () => {
    await request(app).post("/api/patients").send({ name: "" });

    const response = await request(app).get("/api/patients");

    expect(response.body).toEqual([]);
  });
});

describe("GET /api/patients/:id", () => {
  it("devuelve el paciente pedido", async () => {
    const created = await crearPaciente();

    const response = await request(app).get(`/api/patients/${created.id}`);

    expect(response.status).toBe(200);
    expect(asPatient(response.body).name).toBe("Michi");
  });

  it("devuelve 404 si no existe", async () => {
    const response = await request(app).get(
      "/api/patients/00000000-0000-0000-0000-000000000000",
    );

    expect(response.status).toBe(404);
    expect(asMessage(response.body)).toBe("Paciente no encontrado");
  });
});

describe("PUT /api/patients/:id", () => {
  it("actualiza el paciente", async () => {
    const created = await crearPaciente();

    const response = await request(app)
      .put(`/api/patients/${created.id}`)
      .send({ ...draft, name: "Michi Editado", date: "2025-02-15" });

    expect(response.status).toBe(200);
    expect(asPatient(response.body)).toMatchObject({
      id: created.id,
      name: "Michi Editado",
      date: "2025-02-15",
    });
  });

  it("devuelve 404 si no existe", async () => {
    const response = await request(app)
      .put("/api/patients/00000000-0000-0000-0000-000000000000")
      .send(draft);

    expect(response.status).toBe(404);
  });

  it("rechaza un body invalido", async () => {
    const created = await crearPaciente();

    const response = await request(app)
      .put(`/api/patients/${created.id}`)
      .send({ ...draft, email: "no-es-email" });

    expect(response.status).toBe(400);
    expect(asErrors(response.body).email).toBe("Email no válido");
  });
});

describe("DELETE /api/patients/:id", () => {
  it("borra el paciente", async () => {
    const created = await crearPaciente();

    const response = await request(app).delete(`/api/patients/${created.id}`);
    expect(response.status).toBe(204);

    const list = await request(app).get("/api/patients");
    expect(list.body).toEqual([]);
  });

  it("devuelve 404 si ya fue borrado", async () => {
    const created = await crearPaciente();
    await request(app).delete(`/api/patients/${created.id}`);

    const response = await request(app).delete(`/api/patients/${created.id}`);

    expect(response.status).toBe(404);
  });
});
