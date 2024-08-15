import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { modifyEndpointContent } from "@/lib/utils";

export const useGetProduct = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["product", { id }],
    queryFn: async () => {
      const response = await client.api.products[":id"]["$get"]({
        param: { id },
      });
      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      const modifiedData = modifyEndpointContent(data);

      return modifiedData;
    },
  });
  return query;
};
