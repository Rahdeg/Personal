import { toast } from "sonner";
import { InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type to include both success and error cases
type ResponseType = { url: string | null } | { error: string };

type RequestType = InferRequestType<
    (typeof client.api.checkout)["orders"]["$post"]
>["json"];

export const useCheckout = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.checkout["orders"]["$post"]({
                json,
            });
            const data: ResponseType = await response.json();
            return data;
        },
        onSuccess: (data) => {
            if ('url' in data && data.url) {
                toast.success("Payment in progress");
                queryClient.invalidateQueries({ queryKey: ["products"] });
                window.location.href = data.url;
            } else if ('error' in data) {
                toast.error(data.error);
            }
        },
        onError: () => {
            toast.error("Failed to initiate Payments");
        },
    });

    return mutation;
};
