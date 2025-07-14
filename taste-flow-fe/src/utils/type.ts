export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    cookTime: string;
    category: string;
    isPopular?: boolean;
    isNew?: boolean;
    tags: string[];
    calories: number;
}

export interface Cart {
    [itemId: number]: number;
}

export interface Category {
    id: string;
    name: string;
    count: number;
}


export type RegisterBodyType = {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}


export type RegisterRes = {
    id: number;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    role: string
}
export type ItemToAdd = {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
    img?: string;
};

export type ItemsToAddPayload = {
    itemsToAdd: ItemToAdd[];
};
export type ItemAddRequest = {
    userId: string;
    itemAddCart: Record<string, number>;

}
export type AddState = {
    userId: string;
    itemsToAdd: ItemToAdd[];
    itemAddCart: Record<string, number>;
}


export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED',
}

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    STAFF = 'STAFF',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    status: UserStatus;
    role: UserRole;
}

export interface Dish {
    id: string;
    name: string;
    price: number;
    status: UserStatus;
    category: string[];
    receipt: string[];
    image: string;
}

export type CartResponse = {
    userId: number;
    items: {
        [productId: string]: number;
    };
    quantity: number;
};
export type AddToCartRequest = {
    userId: number;
    itemsToAdd: {
        [productId: string]: number;
    };
};
export type RemoveFromCartRequest = {
    userId: number;
    itemsToRemove: {
        [productId: string]: number;
    };
};


export interface Ingredient {
    id: number;
    quantity: number;
}

export interface CategoryMenu {
    id: number;
    name: string;
    status: boolean;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    status: boolean;
    imgUrl: string;
    ingredients: Ingredient[];
    categories: CategoryMenu[];
}

export interface ResponeHungMenu<T> {
    success: boolean;
    message: string;
    data: T[];
}

export interface ResponeHungCategory<T> {
    response: {
        success: boolean;
        message: string;
        data: T[];
    };
}



export interface OrderItem {
    dishId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes?: string;
}

export interface OrderInfo {
    userId: number;
    totalAmount: number;
    deliveryAddress: string;
}

export interface OrderState {
    order: OrderInfo | null;
    orderItemList: OrderItem[];
}

export interface CreateOrderRequest {
    order: OrderInfo;
    orderItemList: OrderItem[];
}

export interface CreateOrderResponse {
    orderId: number;
    userId: number;
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    paymentId: number;
    discountCode: string | null;
    createdAt: string;
    updatedAt: string;
}

export type OrderStatus = 'NOT FOUND' | 'READY_FOR_PAYMENT' | 'COMPLETED' | 'CANCELLED' | 'PENDING';

export type PaymentMethod = {
    orderId: number;
    paymentMethod: string;
    discountCode?: string;
};