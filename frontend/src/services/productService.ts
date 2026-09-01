import api from './api';
import type { Product, ProductDTO, PagedResponse } from '../types/product.types';

export const productService = {
    getAll: async (page = 0, size = 12): Promise<PagedResponse<Product>> => {
        const response = await api.get<PagedResponse<Product>>('/products', {
            params: { page, size },
        });
        return response.data;
    },

    getById: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    create: async (data: ProductDTO): Promise<Product> => {
        const response = await api.post<Product>('/products', data);
        return response.data;
    },

    update: async (id: number, data: ProductDTO): Promise<Product> => {
        const response = await api.put<Product>(`/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};
