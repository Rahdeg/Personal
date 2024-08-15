import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.orders)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.orders)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteOrders = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.orders["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Orders deleted");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete Orders");
    },
  });

  return mutation;
};
