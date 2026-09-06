import api from './api';

export interface OrderItemResponse {
    id: number;
    product: {
        id: number;
        name: string;
        imageUrl: string;
    };
    quantity: number;
    price: number;
}

export interface OrderResponse {
    id: number;
    items: OrderItemResponse[];
    subtotal: number;
    deliveryCharge: number;
    totalAmount: number;
    status: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    createdAt: string;
}

export interface CheckoutRequest {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: 'ONLINE' | 'COD';
}

export const orderService = {
    checkout: async (data: CheckoutRequest): Promise<OrderResponse> => {
        const response = await api.post<OrderResponse>('/orders', data);
        return response.data;
    },

    getMyOrders: async (): Promise<OrderResponse[]> => {
        const response = await api.get<OrderResponse[]>('/orders');
        return response.data;
    },

    getOrderById: async (id: number): Promise<OrderResponse> => {
        const response = await api.get<OrderResponse>(`/orders/${id}`);
        return response.data;
    },

    cancelOrder: async (id: number): Promise<OrderResponse> => {
        const response = await api.put<OrderResponse>(`/orders/${id}/cancel`);
        return response.data;
    },
};
