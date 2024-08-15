import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetOrderItems = (userId?: string) => {
  const query = useQuery({
    enabled: !!userId,
    queryKey: ["orderItem", { userId }],
    queryFn: async () => {
      const response = await client.api.orders[":userId"]["orderItem"]["$get"]({
        param: { userId },
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
