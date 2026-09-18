import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DraftPatient, Patient } from "@pacientes/shared";
import {
  createPatient,
  deletePatient,
  getPatients,
  updatePatient,
} from "../api/patients";

export const patientsKey = ["patients"] as const;

export const usePatients = () =>
  useQuery({
    queryKey: patientsKey,
    queryFn: getPatients,
  });

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientsKey }),
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, draft }: { id: Patient["id"]; draft: DraftPatient }) =>
      updatePatient(id, draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientsKey }),
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: patientsKey }),
  });
};
