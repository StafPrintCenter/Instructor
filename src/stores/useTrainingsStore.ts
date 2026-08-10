// src/stores/useTrainingsStore.ts
import { createResourceStore } from "./createResourceStore";
import type { APIInstructorTrainingAssignment, InstructorTrainingPayload } from "@/data/trainings";

const store = createResourceStore<APIInstructorTrainingAssignment, InstructorTrainingPayload>({
  resourceKey: "trainings",
  basePath: "trainings",
});

export const fetchInstructorTrainings = store.fetchList;
export const fetchInstructorTrainingById = store.fetchById;
export const createInstructorTraining = store.createItem;
export const updateInstructorTraining = store.updateItem;
export const deleteInstructorTraining = store.removeItem;

export const useInstructorTrainingsList = store.useList;
export const useInstructorTrainingDetail = store.useDetail;
export const useCreateInstructorTraining = store.useCreate;
export const useUpdateInstructorTraining = store.useUpdate;
export const useDeleteInstructorTraining = store.useRemove;