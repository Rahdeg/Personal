import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.colors.$post>;
type RequestType = InferRequestType<typeof client.api.colors.$post>["json"];

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.colors.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Color created successfully");
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
    onError: () => {
      toast.error("Failed to create Color");
    },
  });

  return mutation;
};
