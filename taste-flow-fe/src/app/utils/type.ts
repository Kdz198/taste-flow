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