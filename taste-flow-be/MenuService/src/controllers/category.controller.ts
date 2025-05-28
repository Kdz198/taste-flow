import {
    addCategory,
    addCategories,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategoryById,
} from '../daos/category.dao';
import { Request, Response } from 'express';
import { ICategory } from '../models/category.model';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryData: ICategory = req.body;
        const newCategory = await addCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const createCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoriesData: ICategory[] = req.body;
        const newCategories = await addCategories(categoriesData);
        res.status(201).json(newCategories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create categories' });
    }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve category' });
    }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
};

export const updateCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;
        const categoryData: Partial<ICategory> = req.body;
        const updatedCategory = await updateCategory(categoryId, categoryData);
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategoryByID = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await deleteCategoryById(categoryId);
        if (deletedCategory) {
            res.status(200).json(deletedCategory);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};