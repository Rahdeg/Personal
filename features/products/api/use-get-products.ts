import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetProducts = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["products", categoryId], // Include categoryId in queryKey
    queryFn: async () => {
      const params = {
        query: {
          categoryId: categoryId ?? undefined,
        },
      };

      const response = await client.api.products.$get(params);
      if (!response.ok) {
        throw new Error("failed to fetch products");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
