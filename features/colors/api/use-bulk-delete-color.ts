import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.colors)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.colors)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteColor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.colors["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Color deleted");
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete Color");
    },
  });

  return mutation;
};
