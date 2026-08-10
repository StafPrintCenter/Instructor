// src/stores/useTrainingsStore.ts
import { createResourceStore } from "./createResourceStore";
import type { APIInstructorTrainingAssignment } from "@/data/trainings";

const store = createResourceStore<APIInstructorTrainingAssignment>({
  resourceKey: "trainings",
  basePath: "trainings",
});

export const fetchInstructorTrainings = store.fetchList;
export const fetchInstructorTrainingById = store.fetchById;

export const useInstructorTrainingsList = store.useList;
export const useInstructorTrainingDetail = store.useDetail;