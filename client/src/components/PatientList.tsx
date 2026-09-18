import { usePatients } from "../hooks/usePatients";
import PatientDetails from "./PatientDetails";

const containerClass = "md:w-1/2 lg:w-3/5 md:h-screen overflow-y-scroll";

const PatientList = () => {
  const { data: patients, isPending, isError, error } = usePatients();

  if (isPending) {
    return (
      <div className={containerClass}>
        <h2 className="font-black text-3xl text-center">
          Cargando pacientes...
        </h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={containerClass}>
        <h2 className="font-black text-3xl text-center">Ocurrió un error</h2>
        <p className="text-xl mt-5 mb-10 text-center">{error.message}</p>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {patients.length ? (
        <>
          <h2 className="font-black text-3xl text-center">
            Listado de Pacientes
          </h2>
          <p className="text-xl mt-5 mb-10 text-center">
            Administra tus{" "}
            <span className="text-indigo-600 font-bold">Pacientes y Citas</span>
          </p>
          {patients.map((patient) => (
            <PatientDetails key={patient.id} patient={patient} />
          ))}
        </>
      ) : (
        <>
          <h2 className="font-black text-3xl text-center">No hay pacientes</h2>
          <p className="text-xl mt-5 mb-10 text-center">
            Comienza agregando pacientes{" "}
            <span className="text-indigo-600 font-bold">
              y apareceran en este lugar
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default PatientList;
