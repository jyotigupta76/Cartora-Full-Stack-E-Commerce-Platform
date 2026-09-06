import api from './api';

export interface CartItemResponse {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string;
        stock: number;
    };
    quantity: number;
}

export const cartService = {
    getCart: async (): Promise<CartItemResponse[]> => {
        const response = await api.get<CartItemResponse[]>('/cart');
        return response.data;
    },

    addToCart: async (productId: number, quantity: number): Promise<CartItemResponse> => {
        const response = await api.post<CartItemResponse>('/cart/add', { productId, quantity });
        return response.data;
    },

    updateQuantity: async (itemId: number, quantity: number): Promise<CartItemResponse> => {
        const response = await api.put<CartItemResponse>(`/cart/${itemId}`, { quantity });
        return response.data;
    },

    removeItem: async (itemId: number): Promise<void> => {
        await api.delete(`/cart/${itemId}`);
    },

    clearCart: async (): Promise<void> => {
        await api.delete('/cart');
    },
};
