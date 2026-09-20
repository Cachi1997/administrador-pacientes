import type { Patient } from "@pacientes/shared";
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
    <article
      className={`rounded-2xl border bg-surface p-5 shadow-sm transition-colors ${
        isEditing ? "border-brand ring-1 ring-brand" : "border-line"
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{patient.name}</h3>
          <p className="truncate text-sm text-ink-muted">{patient.caretaker}</p>
        </div>
        {isEditing && (
          <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
            Editando
          </span>
        )}
      </header>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-ink-muted">
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <dt className="sr-only">Email</dt>
          <dd className="truncate">{patient.email}</dd>
        </div>

        <div className="flex items-center gap-2 text-ink-muted">
          <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 11h18" />
          </svg>
          <dt className="sr-only">Fecha de alta</dt>
          <dd>{formatDate(patient.date)}</dd>
        </div>
      </dl>

      <p className="mt-3 border-t border-line pt-3 text-sm">
        {patient.symptoms}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveId(patient.id)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleEliminar}
          disabled={deletePatient.isPending}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          {deletePatient.isPending ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </article>
  );
};

export default PatientDetails;
