import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/api-url";
import { createResourceStore } from "./createResourceStore";
import type { APIInstructorTrainingAssignment, APIInstructorTrainingOverview } from "@/data/trainings";

const resourceKey = "trainings";
const basePath = "trainings";

const store = createResourceStore<APIInstructorTrainingAssignment>({
  resourceKey,
  basePath,
});

export const fetchInstructorTrainings = store.fetchList;
export const useInstructorTrainingsList = store.useList;
export const useInstructorTrainingDetail = store.useDetail;