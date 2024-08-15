import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.colors)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.colors)[":id"]["$patch"]
>["json"];

export const useEditColor = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.colors[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Color updated");
      queryClient.invalidateQueries({ queryKey: ["color", { id }] });
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit Color");
    },
  });

  return mutation;
};
