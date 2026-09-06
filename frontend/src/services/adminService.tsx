import api from './api';

export interface AdminStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    enabled: boolean;
}

export const adminService = {
    getStats: async (): Promise<AdminStats> => {
        const response = await api.get<AdminStats>('/admin/stats');
        return response.data;
    },

    getAllUsers: async (): Promise<AdminUser[]> => {
        const response = await api.get<AdminUser[]>('/admin/users');
        return response.data;
    },

    blockUser: async (id: number): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/admin/users/${id}/block`);
        return response.data;
    },

    unblockUser: async (id: number): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/admin/users/${id}/unblock`);
        return response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/admin/users/${id}`);
    },

    getAllOrders: async () => {
        const response = await api.get('/admin/orders');
        return response.data;
    },

    updateOrderStatus: async (id: number, status: string) => {
        const response = await api.put(`/admin/orders/${id}/status`, { status });
        return response.data;
    },
};
