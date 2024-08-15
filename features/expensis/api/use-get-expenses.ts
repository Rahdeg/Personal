import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetExpenses = () => {
  const query = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await client.api.expensis.$get();
      if (!response.ok) {
        throw new Error("failed to fetch expenses");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
