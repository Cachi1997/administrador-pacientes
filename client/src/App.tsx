import { ToastContainer } from "react-toastify";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import ThemeToggle from "./components/ThemeToggle";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="sticky top-0 z-10 border-b border-line bg-surface-glass backdrop-blur">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="size-8 rounded-lg" />
            <h1 className="text-base font-semibold sm:text-lg">
              Seguimiento de pacientes
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-[96rem] gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[24rem_1fr] xl:grid-cols-[26rem_1fr] lg:items-start">
        <PatientForm />
        <PatientList />
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
