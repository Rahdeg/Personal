import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetUsername = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["username", { id }],
    queryFn: async () => {
      const response = await client.api.users[":id"]["$get"]({
        param: { id },
      });
      if (!response.ok) {
        throw new Error("failed to fetch user");
      }

      const { data } = await response.json();
      return data.username;
    },
  });
  return query;
};
