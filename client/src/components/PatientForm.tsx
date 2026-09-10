import { useForm } from "react-hook-form";
import Error from "./Error";
import { usePatientStore } from "../store";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { draftPatientSchema, type DraftPatient } from "@pacientes/shared";
import { zodResolver } from "@hookform/resolvers/zod";

const initialValues: DraftPatient = {
  name: "",
  caretaker: "",
  email: "",
  date: "",
  symptoms: "",
};

const PatientForm = () => {
  const addPatient = usePatientStore((state) => state.addPatient);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const clearActiveId = usePatientStore((state) => state.clearActiveId);
  const activePatient = usePatientStore((state) =>
    state.patients.find((patient) => patient.id === state.activeId),
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DraftPatient>({
    defaultValues: initialValues,
    resolver: zodResolver(draftPatientSchema),
  });

  const isEditing = Boolean(activePatient);

  useEffect(() => {
    if (!activePatient) {
      reset(initialValues);
      return;
    }

    reset({
      name: activePatient.name,
      caretaker: activePatient.caretaker,
      email: activePatient.email,
      date: activePatient.date,
      symptoms: activePatient.symptoms,
    });

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activePatient, reset]);

  const registerPatient = (data: DraftPatient) => {
    if (isEditing) {
      updatePatient(data);
      toast.success("Paciente actualizado correctamente");
    } else {
      addPatient(data);
      toast.success("Paciente registrado correctamente");
    }

    reset(initialValues);
  };

  const handleCancel = () => {
    clearActiveId();
    reset(initialValues);
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
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
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
          {errors.caretaker && (
            <Error>{errors.caretaker?.message?.toString()}</Error>
          )}
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
          {errors.email && <Error>{errors.email?.message?.toString()}</Error>}
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
          {errors.date && <Error>{errors.date?.message?.toString()}</Error>}
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
          {errors.symptoms && (
            <Error>{errors.symptoms?.message?.toString()}</Error>
          )}
        </div>

        <input
          type="submit"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
          value={isEditing ? "Guardar Cambios" : "Guardar Paciente"}
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
