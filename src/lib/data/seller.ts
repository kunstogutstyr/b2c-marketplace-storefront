import { SellerProps } from '@/types/seller';

import { sdk } from '../config';

export const getSellerByHandle = async (handle: string) => {
  return sdk.client
    .fetch<{ seller: SellerProps }>(`/store/seller/${handle}`, {
      query: {
        fields:
          '+created_at,+email,+reviews.seller.name,+reviews.rating,+reviews.customer_note,+reviews.seller_note,+reviews.created_at,+reviews.updated_at,+reviews.customer.first_name,+reviews.customer.last_name'
      },
      cache: 'no-cache'
    })
    .then(({ seller }) => {
      const response = {
        ...seller,
        reviews:
          seller.reviews
            ?.filter(item => item !== null)
            .sort((a, b) => b.created_at.localeCompare(a.created_at)) ?? []
      };

      return response as SellerProps;
    })
    .catch(() => []);
};

export const listSellerNames = async () => {
  return sdk.client
    .fetch<{ sellers?: { name?: string }[] }>('/store/seller', {
      query: {
        fields: 'name',
        limit: 200
      },
      cache: 'no-cache'
    })
    .then(({ sellers }) =>
      (sellers ?? [])
        .map(seller => seller?.name?.trim())
        .filter((name): name is string => Boolean(name))
    )
    .catch(() => [] as string[]);
};
