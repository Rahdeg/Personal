import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.sizes)[":id"]["$delete"]
>;

export const useDeleteSize = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.sizes[":id"]["$delete"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Size deleted");
      queryClient.invalidateQueries({ queryKey: ["size", { id }] });
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete Size");
    },
  });

  return mutation;
};
