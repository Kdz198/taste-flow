import { useQuery } from '@tanstack/react-query';
import productApiRequest from '@/apiRequest/menu';

export const useMenuList = () => {
  return useQuery({
    queryKey: ['menuList'],
    queryFn: async () => {
      const res = await productApiRequest.getList();
      return res.payload.data;
    },
  });
};