import { usePatientStore } from "../store";

const PatientList = () => {
  const patients = usePatientStore((state) => state.patients);

  console.log(patients);

  return <div>PatientList</div>;
};

export default PatientList;
