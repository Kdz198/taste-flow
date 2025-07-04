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
    id: string;
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




