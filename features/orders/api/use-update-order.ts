import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.orders)[":orderId"]["status"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.orders)[":orderId"]["status"]["$patch"]
>["json"];

export const useUpdateOrderStatus = (orderId?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.orders[":orderId"]["status"]["$patch"]({
        json,
        param: { orderId },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["order", { orderId }] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  return mutation;
};
