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

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    category: Category;
    seller: Seller;
    averageRating: number;
    createdAt: string;
}

export interface ProductDTO {
    name: string;
    description: string;
    categoryId: number;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
