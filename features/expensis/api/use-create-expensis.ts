import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.expensis.$post>;
type RequestType = InferRequestType<typeof client.api.expensis.$post>["json"];

export const useCreateExpensis = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.expensis.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Expensis created successfully");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      toast.error("Failed to create Expensis");
    },
  });

  return mutation;
};
