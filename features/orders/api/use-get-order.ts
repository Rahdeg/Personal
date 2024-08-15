import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetOrder = (orderId?: string) => {
  const query = useQuery({
    enabled: !!orderId,
    queryKey: ["order", { orderId }],
    queryFn: async () => {
      const response = await client.api.orders[":orderId"]["status"]["$get"]({
        param: { orderId },
      });
      if (!response.ok) {
        throw new Error("failed to fetch colors");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
