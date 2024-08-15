import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetAdminProducts = (categoryId: string | null) => {
  return useQuery({
    queryKey: ["products", categoryId], // Include categoryId in queryKey
    queryFn: async () => {
      const params = {
        query: {},
      };

      const response = await client.api.products.manage.$get(params);
      if (!response.ok) {
        throw new Error("failed to fetch products");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
