export type CreateOrderPayload = {
  name: string;
  phone: string;
  address: string | null;
  order_type: 'DELIVERY' | 'PICKUP';
  items: {
    menu_item_id: string;
    quantity: number;
  }[];
};

export async function createOrder(payload: CreateOrderPayload) {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

  if (!base) {
    throw new Error('API URL is not configured.');
  }

  const url = base.endsWith('/api')
    ? `${base}/orders`
    : `${base}/api/orders`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Order could not be placed.');
  }

  return result.data as {
    id: string;
    order_number: string;
    status: string;
  };
}