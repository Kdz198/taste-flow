export interface Ingredient {
  id: number;
  name: string;
  category: IngredientCategory;
  unit: string;
  active: boolean;
}

export interface IngredientFormData {
  id?: number;
  name: string;
  category: number;
  unit: string;
  active: boolean;
}

export interface IngredientCategory {
  id: number;
  name: string;
  description: string;
}

export interface IngredientCategoryFormData {
  id?: number;
  name: string;
  description: string;
}

export interface IngredientDetail {
  id: number;
  ingredient: Ingredient;
  expireDate: string;
  quantity: number;
  active: boolean;
}

export interface IngredientDetailFormData {
  id?: number;
  ingredient: Ingredient;
  expireDate: string;
  quantity: number;
  active: boolean;
}
