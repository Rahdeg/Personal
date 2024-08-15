import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetExpensis = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["expensis", { id }],
    queryFn: async () => {
      const response = await client.api.expensis[":id"]["$get"]({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("failed to fetch expensis");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
