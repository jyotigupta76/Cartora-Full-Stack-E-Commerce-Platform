export interface Category {
    id: number;
    name: string;
}

export interface Seller {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface ProductImage {
    id: number;
    imageUrl: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    brand: string;
    imageUrl: string;
    category: Category;
    seller: Seller;
    averageRating: number;
    images: ProductImage[];
    createdAt: string;
}

export interface ProductDTO {
    name: string;
    description: string;
    categoryId: number;
    brand: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
    imageUrl: string;
    imageUrls?: string[];
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ProductSearchParams {
    search?: string;
    categoryId?: number;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    page?: number;
    size?: number;
}
