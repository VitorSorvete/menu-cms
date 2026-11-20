import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.listAll,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}