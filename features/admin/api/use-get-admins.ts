import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAdmins = () => {
  const query = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await client.api.admin.$get();
      if (!response.ok) {
        throw new Error("failed to fetch admins");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
