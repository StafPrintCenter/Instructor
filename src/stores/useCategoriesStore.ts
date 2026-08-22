// src/stores/useCategoriesStore.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { instructorFetch } from "@/lib/api-url";
import { parseApiError } from "@/lib/api-error";
import type { APIPublicCategory } from "@/data/categories";
import type { APIInstructorUser } from "@/data/auth";

interface ListResponse<T> {
  data: T[];
}
interface DetailResponse<T> {
  data: T;
}

async function fetchPublicCategories(): Promise<APIPublicCategory[]> {
  const response = await instructorFetch(`/api/public/categories/list?perPage=100`);
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la récupération des catégories");
  const json: ListResponse<APIPublicCategory> = await response.json();
  return json.data;
}

export function usePublicCategories() {
  const query = useQuery({
    queryKey: ["public-categories", "list"],
    queryFn: fetchPublicCategories,
    staleTime: 1000 * 60 * 10,
  });
  return { categories: query.data ?? [], isLoading: query.isLoading, isError: query.isError };
}

async function updateInstructorCategories(categoryIds: string[]): Promise<APIInstructorUser> {
  const fd = new FormData();
  fd.append("category_ids", categoryIds.join(","));
  const response = await instructorFetch(`/api/instructor/categories`, { method: "PUT", body: fd });
  if (!response.ok) throw await parseApiError(response, "Erreur lors de la mise à jour des catégories");
  const json: DetailResponse<APIInstructorUser> = await response.json();
  return json.data;
}

export function useUpdateInstructorCategories() {
  return useMutation({
    mutationFn: (categoryIds: string[]) => updateInstructorCategories(categoryIds),
  });
}