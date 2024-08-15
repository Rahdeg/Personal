import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.sizes)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.sizes)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteSize = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.sizes["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Size deleted");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete Size");
    },
  });

  return mutation;
};
