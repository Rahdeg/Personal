import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetFeaturedProducts = (isFeatured: string | null) => {
  return useQuery({
    queryKey: ["featured", isFeatured],
    queryFn: async () => {
      // Always define the query object
      const params = {
        query: {
          isFeatured: isFeatured ?? undefined,
          // You can include other query parameters here if needed
        },
      };

      // Make the API request
      const response = await client.api.products.$get(params);
      if (!response.ok) {
        throw new Error("failed to fetch products");
      }

      const { data } = await response.json();
      return data;
    },
  });
};
