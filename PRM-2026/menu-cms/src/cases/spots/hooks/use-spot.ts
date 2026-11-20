
import { useQuery } from "@tanstack/react-query";
import { SpotService } from "../services/spot.service";

export function useSpots() {
  return useQuery({
    queryKey: ["spots"],
    queryFn: SpotService.listAll,
  });
}

export function useSpot(id: string) {
  return useQuery({
    queryKey: ["spot", id],
    queryFn: () => SpotService.findOne(id),
    enabled: !!id,
  });
}
