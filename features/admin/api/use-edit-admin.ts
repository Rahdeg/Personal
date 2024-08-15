import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.admin)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.admin)[":id"]["$patch"]
>["json"];

export const useEditAdmin = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.admin[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Admin updated");
      queryClient.invalidateQueries({ queryKey: ["admin", { id }] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit admin");
    },
  });

  return mutation;
};
