import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetSizes = () => {
  const query = useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const response = await client.api.sizes.$get();
      if (!response.ok) {
        throw new Error("failed to fetch sizes");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
