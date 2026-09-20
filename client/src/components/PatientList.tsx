import { usePatients } from "../hooks/usePatients";
import PatientDetails from "./PatientDetails";

const SectionHeader = ({ count }: { count?: number }) => (
  <div className="mb-4 flex items-baseline justify-between">
    <h2 className="text-lg font-semibold">Pacientes</h2>
    {count !== undefined && (
      <span className="text-sm text-ink-muted">
        {count === 1 ? "1 paciente" : `${count} pacientes`}
      </span>
    )}
  </div>
);

const PatientList = () => {
  const { data: patients, isPending, isError, error } = usePatients();

  if (isPending) {
    return (
      <section>
        <SectionHeader />
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((key) => (
            <div
              key={key}
              className="h-48 animate-pulse rounded-2xl border border-line bg-surface"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <SectionHeader />
        <div className="rounded-2xl border border-danger bg-danger-soft p-5">
          <p className="font-medium text-danger">
            No se pudieron cargar los pacientes
          </p>
          <p className="mt-1 text-sm text-ink-muted">{error.message}</p>
        </div>
      </section>
    );
  }

  if (patients.length === 0) {
    return (
      <section>
        <SectionHeader count={0} />
        <div className="rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-medium">Todavía no hay pacientes</p>
          <p className="mt-1 text-sm text-ink-muted">
            Cargá el primero con el formulario de la izquierda.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader count={patients.length} />
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(19rem,1fr))]">
        {patients.map((patient) => (
          <PatientDetails key={patient.id} patient={patient} />
        ))}
      </div>
    </section>
  );
};

export default PatientList;
