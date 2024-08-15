import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetSize = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["size", { id }],
    queryFn: async () => {
      const response = await client.api.sizes[":id"]["$get"]({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("failed to fetch sizes");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
