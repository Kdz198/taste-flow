import { useQuery } from '@tanstack/react-query';
import productApiRequest from '@/apiRequest/product';

export const useMenuList = () => {
  return useQuery({
    queryKey: ['menuList'],
    queryFn: async () => {
      const res = await productApiRequest.getList();
      return res.payload;
    },
  });
};