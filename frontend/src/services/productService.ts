import api from './api';
import type { Product, ProductDTO, PagedResponse, ProductSearchParams } from '../types/product.types';

export const productService = {
    // Public browsing - search, filter, sort, paginate all in one
    getAll: async (params: ProductSearchParams = {}): Promise<PagedResponse<Product>> => {
        const response = await api.get<PagedResponse<Product>>('/products', { params });
        return response.data;
    },

    getById: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    // Seller-only endpoints
    create: async (data: ProductDTO): Promise<Product> => {
        const response = await api.post<Product>('/seller/products', data);
        return response.data;
    },

    update: async (id: number, data: ProductDTO): Promise<Product> => {
        const response = await api.put<Product>(`/seller/products/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/seller/products/${id}`);
    },

    getMyProducts: async (page = 0, size = 20): Promise<PagedResponse<Product>> => {
        const response = await api.get<PagedResponse<Product>>('/seller/products', {
            params: { page, size },
        });
        return response.data;
    },
};
