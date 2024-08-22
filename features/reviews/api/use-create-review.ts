import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.review.$post>;
type RequestType = InferRequestType<typeof client.api.review.$post>["json"];

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.review.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("review created successfully");
      queryClient.invalidateQueries({ queryKey: ["review"] });
      queryClient.invalidateQueries({ queryKey: ["orderItem"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: () => {
      toast.error("Failed to create review");
    },
  });

  return mutation;
};
