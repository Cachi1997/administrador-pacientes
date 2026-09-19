import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "./app";

// Reemplaza el store para este archivo: listPatients falla como si se cayera la base.
vi.mock("./store", async (importOriginal) => {
  const original = await importOriginal<typeof import("./store")>();
  return {
    ...original,
    listPatients: vi.fn(() =>
      Promise.reject(new Error("fallo simulado de la base")),
    ),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("rutas inexistentes", () => {
  it("responden 404 en JSON", async () => {
    const response = await request(app).get("/api/no-existe");

    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ message: "Ruta no encontrada" });
  });
});

describe("JSON mal formado", () => {
  it("responde 400 en JSON", async () => {
    const response = await request(app)
      .post("/api/patients")
      .set("Content-Type", "application/json")
      .send('{"name": ');

    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({
      message: "El cuerpo de la solicitud no es JSON válido",
    });
  });
});

describe("errores inesperados", () => {
  it("responden 500 sin exponer detalles internos", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const response = await request(app).get("/api/patients");

    expect(response.status).toBe(500);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual({ message: "Error interno del servidor" });
    expect(response.text).not.toContain("fallo simulado");
    expect(consoleError).toHaveBeenCalled();
  });
});
