import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetColors = () => {
  const query = useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const response = await client.api.colors.$get();
      if (!response.ok) {
        throw new Error("failed to fetch colors");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
