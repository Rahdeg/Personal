import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  typeof client.api.products.products.$post
>;
type RequestType = InferRequestType<
  typeof client.api.products.products.$post
>["json"];

export const useGetProductWithIds = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.products.products.$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Product received");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to get Products");
    },
  });

  return mutation;
};
