import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.expensis)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.expensis)[":id"]["$patch"]
>["json"];

export const useEditExpensis = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.expensis[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Expensis updated");
      queryClient.invalidateQueries({ queryKey: ["expensis", { id }] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit Expensis");
    },
  });

  return mutation;
};
