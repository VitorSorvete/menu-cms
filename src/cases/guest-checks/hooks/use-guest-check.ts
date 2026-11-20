
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GuestCheckService } from "../services/guest-check.service";

export function useGuestChecks() {
  return useQuery({
    queryKey: ["guest-checks"],
    queryFn: GuestCheckService.listAll,
  });
}

export function useCloseGuestCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: GuestCheckService.close,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] });
    },
  });
}
