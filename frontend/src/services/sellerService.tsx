import api from './api';

export interface SellerStats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    lowStockCount: number;
}

export const sellerService = {
    getStats: async (): Promise<SellerStats> => {
        const response = await api.get<SellerStats>('/seller/stats');
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/seller/orders');
        return response.data;
    },
};
