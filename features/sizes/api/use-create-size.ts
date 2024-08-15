import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.sizes.$post>;
type RequestType = InferRequestType<typeof client.api.sizes.$post>["json"];

export const useCreateSize = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.sizes.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Size created successfully");
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
    onError: () => {
      toast.error("Failed to create Size");
    },
  });

  return mutation;
};
