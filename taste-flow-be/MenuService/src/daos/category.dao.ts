import { ICategory, Category } from "../models/category.model";

export function addCategory(categoryData: ICategory): Promise<ICategory> {
    return new Promise((resolve, reject) => {
        const newCategory = new Category(categoryData);
        newCategory.save()
            .then((savedCategory) => {
                resolve(savedCategory);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function addCategories(categoriesData: ICategory[]): Promise<ICategory[]> {
    return new Promise((resolve, reject) => {
        Category.insertMany(categoriesData)
            .then((savedCategories) => {
                resolve(savedCategories);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getCategoryById(categoryId: string): Promise<ICategory | null> {
    return new Promise((resolve, reject) => {
        Category.findById(categoryId)
            .then((category) => {
                resolve(category);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getAllCategories(): Promise<ICategory[]> {
    return new Promise((resolve, reject) => {
        Category.find()
            .then((categories) => {
                resolve(categories);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function updateCategory(categoryId: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    return new Promise((resolve, reject) => {
        Category.findByIdAndUpdate(categoryId, categoryData, { new: true })
            .then((updatedCategory) => {
                resolve(updatedCategory);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function deleteCategoryById(categoryId: string): Promise<ICategory | null> {
    return new Promise((resolve, reject) => {
        Category.findByIdAndDelete(categoryId)
            .then((deletedCategory) => {
                resolve(deletedCategory);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
