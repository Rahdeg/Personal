import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.sizes)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.sizes)[":id"]["$patch"]
>["json"];

export const useEditSize = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.sizes[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Size updated");
      queryClient.invalidateQueries({ queryKey: ["size", { id }] });
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit Size");
    },
  });

  return mutation;
};
