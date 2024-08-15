import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.expensis)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.expensis)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteExpensis = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.expensis["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Expensis deleted");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete Size");
    },
  });

  return mutation;
};
