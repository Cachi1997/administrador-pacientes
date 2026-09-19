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
    <div className="md:w-1/2 lg:w-2/5 mx-5">
      <h2 className="font-black text-3xl text-center">Seguimiento Pacientes</h2>

      <p className="text-lg mt-5 text-center mb-10">
        Añade Pacientes y {""}
        <span className="text-indigo-600 font-bold">Administralos</span>
      </p>

      <form
        ref={formRef}
        className="bg-white shadow-md rounded-lg py-10 px-5 mb-10"
        noValidate
        onSubmit={handleSubmit(registerPatient)}
      >
        {isEditing && (
          <p className="mb-5 py-2 px-3 bg-indigo-100 text-indigo-800 text-sm font-bold uppercase rounded">
            Editando: {activePatient?.name}
          </p>
        )}

        <div className="mb-5">
          <label htmlFor="name" className="text-sm uppercase font-bold">
            Paciente
          </label>
          <input
            id="name"
            className="w-full p-3  border border-gray-100"
            type="text"
            placeholder="Nombre del Paciente"
            {...register("name")}
          />
          {errors.name && <Error>{errors.name.message}</Error>}
        </div>

        <div className="mb-5">
          <label htmlFor="caretaker" className="text-sm uppercase font-bold">
            Propietario
          </label>
          <input
            id="caretaker"
            className="w-full p-3  border border-gray-100"
            type="text"
            placeholder="Nombre del Propietario"
            {...register("caretaker")}
          />
          {errors.caretaker && <Error>{errors.caretaker.message}</Error>}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="text-sm uppercase font-bold">
            Email
          </label>
          <input
            id="email"
            className="w-full p-3  border border-gray-100"
            type="email"
            placeholder="Email de Registro"
            {...register("email")}
          />
          {errors.email && <Error>{errors.email.message}</Error>}
        </div>

        <div className="mb-5">
          <label htmlFor="date" className="text-sm uppercase font-bold">
            Fecha Alta
          </label>
          <input
            id="date"
            className="w-full p-3  border border-gray-100"
            type="date"
            {...register("date")}
          />
          {errors.date && <Error>{errors.date.message}</Error>}
        </div>

        <div className="mb-5">
          <label htmlFor="symptoms" className="text-sm uppercase font-bold">
            Síntomas
          </label>
          <textarea
            id="symptoms"
            className="w-full p-3  border border-gray-100"
            placeholder="Síntomas del paciente"
            {...register("symptoms")}
          />
          {errors.symptoms && <Error>{errors.symptoms.message}</Error>}
        </div>

        <input
          type="submit"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors disabled:opacity-50"
          disabled={isSaving}
          value={
            isSaving
              ? "Guardando..."
              : isEditing
                ? "Guardar Cambios"
                : "Guardar Paciente"
          }
        />

        {isEditing && (
          <button
            type="button"
            className="bg-gray-500 w-full p-3 mt-3 text-white uppercase font-bold hover:bg-gray-600 cursor-pointer transition-colors"
            onClick={handleCancel}
          >
            Cancelar Edición
          </button>
        )}
      </form>
    </div>
  );
};

export default PatientForm;
