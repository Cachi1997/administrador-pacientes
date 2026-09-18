import type { Patient } from "@pacientes/shared";
import PatientDetailItem from "./PatientDetailItem";
import { usePatientStore } from "../store";
import { useDeletePatient } from "../hooks/usePatients";
import { toast } from "react-toastify";
import { formatDate } from "../utils";

type PatientDetailsProps = {
  patient: Patient;
};

const PatientDetails = ({ patient }: PatientDetailsProps) => {
  const setActiveId = usePatientStore((state) => state.setActiveId);
  const isEditing = usePatientStore((state) => state.activeId === patient.id);
  const deletePatient = useDeletePatient();

  const handleEliminar = () => {
    deletePatient.mutate(patient.id, {
      onSuccess: () => toast.error("Paciente eliminado correctamente"),
      onError: () => toast.error("No se pudo eliminar el paciente"),
    });
  };

  return (
    <div
      className={`mx-5 my-10 px-5 py-10 bg-white shadow-md rounded-xl ${
        isEditing ? "ring-2 ring-indigo-600" : ""
      }`}
    >
      <PatientDetailItem label="ID" data={patient.id} />
      <PatientDetailItem label="Nombre" data={patient.name} />
      <PatientDetailItem label="Propietario" data={patient.caretaker} />
      <PatientDetailItem label="Email" data={patient.email} />
      <PatientDetailItem label="Fecha de alta" data={formatDate(patient.date)} />
      <PatientDetailItem label="Sintomas" data={patient.symptoms} />
      <div className="flex flex-col lg:flex-row gap-3 justify-between mt-10">
        <button
          type="button"
          className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg cursor-pointer"
          onClick={() => setActiveId(patient.id)}
        >
          Editar
        </button>
        <button
          type="button"
          className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg cursor-pointer disabled:opacity-50"
          onClick={handleEliminar}
          disabled={deletePatient.isPending}
        >
          {deletePatient.isPending ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;
