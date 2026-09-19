import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { patientsRouter } from "./routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/patients", patientsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Va después de todas las rutas: sólo llega acá lo que ninguna respondió.
app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const isJsonParseError = (error: unknown) =>
  error instanceof SyntaxError &&
  "type" in error &&
  error.type === "entity.parse.failed";

// Express reconoce un manejador de errores por tener cuatro parámetros.
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isJsonParseError(error)) {
    res
      .status(400)
      .json({ message: "El cuerpo de la solicitud no es JSON válido" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
};

app.use(errorHandler);
