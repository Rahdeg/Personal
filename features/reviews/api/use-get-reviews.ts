import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetReview = (productId?: string) => {
  const query = useQuery({
    enabled: !!productId,
    queryKey: ["review", { productId }],
    queryFn: async () => {
      const response = await client.api.review[":productId"]["ratings"]["$get"](
        {
          param: { productId },
        }
      );
      if (!response.ok) {
        throw new Error("failed to fetch review");
      }

      const data = await response.json();
      return data;
    },
  });
  return query;
};
