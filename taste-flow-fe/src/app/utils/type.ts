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


export interface User {
  id: string;
  name: string;
  status: boolean;
}

export interface Dish {
  id: string;
  name: string;
  status: boolean;
}
