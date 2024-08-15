import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetColor = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["color", { id }],
    queryFn: async () => {
      const response = await client.api.colors[":id"]["$get"]({
        param: { id },
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
