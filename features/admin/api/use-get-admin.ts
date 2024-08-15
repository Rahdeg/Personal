import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAdmin = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["admin", { id }],
    queryFn: async () => {
      const response = await client.api.admin[":id"]["$get"]({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("failed to fetch admin");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
