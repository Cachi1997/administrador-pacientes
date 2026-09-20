import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { draftPatientSchema, type DraftPatient } from "@pacientes/shared";
import Error from "./Error";
import { usePatientStore } from "../store";
import {
  useCreatePatient,
  usePatients,
  useUpdatePatient,
} from "../hooks/usePatients";
import { ValidationError } from "../api/patients";

const initialValues: DraftPatient = {
  name: "",
  caretaker: "",
  email: "",
  date: "",
  symptoms: "",
};

const labelClass = "mb-1.5 block text-sm font-medium";
const fieldClass =
  "w-full rounded-lg border border-line bg-page px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand";

const PatientForm = () => {
  const { data: patients } = usePatients();
  const activeId = usePatientStore((state) => state.activeId);
  const clearActiveId = usePatientStore((state) => state.clearActiveId);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const activePatient = patients?.find((patient) => patient.id === activeId);
  const isEditing = Boolean(activePatient);
  const isSaving = createPatient.isPending || updatePatient.isPending;

  const formRef = useRef<HTMLFormElement>(null);
  const lastLoadedId = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<DraftPatient>({
    defaultValues: initialValues,
    resolver: zodResolver(draftPatientSchema),
  });

  useEffect(() => {
    if (!activePatient) {
      if (lastLoadedId.current !== null) {
        lastLoadedId.current = null;
        reset(initialValues);
      }
      return;
    }

    // Sólo cargamos el formulario cuando cambia el paciente, no cuando la
    // lista se refresca: si no, un refetch borraría lo que se está escribiendo.
    if (lastLoadedId.current === activePatient.id) return;

    lastLoadedId.current = activePatient.id;
    reset({
      name: activePatient.name,
      caretaker: activePatient.caretaker,
      email: activePatient.email,
      date: activePatient.date,
      symptoms: activePatient.symptoms,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activePatient, reset]);

  const handleApiError = (error: globalThis.Error) => {
    if (error instanceof ValidationError) {
      for (const [field, message] of Object.entries(error.errors)) {
        setError(field as keyof DraftPatient, { message });
      }
      return;
    }
    toast.error("No se pudo guardar el paciente");
  };

  const registerPatient = (data: DraftPatient) => {
    if (activeId) {
      updatePatient.mutate(
        { id: activeId, draft: data },
        {
          onSuccess: () => {
            toast.success("Paciente actualizado correctamente");
            clearActiveId();
          },
          onError: handleApiError,
        },
      );
      return;
    }

    createPatient.mutate(data, {
      onSuccess: () => {
        toast.success("Paciente registrado correctamente");
        reset(initialValues);
      },
      onError: handleApiError,
    });
  };

  const handleCancel = () => {
    clearActiveId();
  };

  return (
    <div className="lg:sticky lg:top-24">
      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit(registerPatient)}
        className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Editar paciente" : "Nuevo paciente"}
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink-muted">
              {isEditing
                ? activePatient?.name
                : "Completá los datos para registrarlo"}
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="shrink-0 rounded-lg px-2 py-1 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancelar
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Paciente
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nombre del paciente"
              className={fieldClass}
              {...register("name")}
            />
            {errors.name && <Error>{errors.name.message}</Error>}
          </div>

          <div>
            <label htmlFor="caretaker" className={labelClass}>
              Propietario
            </label>
            <input
              id="caretaker"
              type="text"
              placeholder="Nombre del propietario"
              className={fieldClass}
              {...register("caretaker")}
            />
            {errors.caretaker && <Error>{errors.caretaker.message}</Error>}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              className={fieldClass}
              {...register("email")}
            />
            {errors.email && <Error>{errors.email.message}</Error>}
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Fecha de alta
            </label>
            <input
              id="date"
              type="date"
              className={fieldClass}
              {...register("date")}
            />
            {errors.date && <Error>{errors.date.message}</Error>}
          </div>

          <div>
            <label htmlFor="symptoms" className={labelClass}>
              Síntomas
            </label>
            <textarea
              id="symptoms"
              rows={3}
              placeholder="Motivo de la consulta"
              className={`${fieldClass} min-h-24 resize-y`}
              {...register("symptoms")}
            />
            {errors.symptoms && <Error>{errors.symptoms.message}</Error>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {isSaving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Guardar paciente"}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
