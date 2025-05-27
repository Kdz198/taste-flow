import {
    addMenu,
    addMenus,
    getMenuById,
    getAllMenus,
    updateMenu,
    deleteMenu
} from '../daos/menu.dao';
import { Request, Response } from 'express';
import { IMenu } from '../models/menu.model';

export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuData: IMenu = req.body;
        const newMenu = await addMenu(menuData);
        res.status(201).json(newMenu);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create menu' });
    }
};

export const createMenus = async (req: Request, res: Response): Promise<void> => {
    try {
        const menusData: IMenu[] = req.body;
        const newMenus = await addMenus(menusData);
        res.status(201).json(newMenus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create menus' });
    }
};

export const getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuId = req.params.id;
        const menu = await getMenuById(menuId);
        if (menu) {
            res.status(200).json(menu);
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve menu' });
    }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const menus = await getAllMenus();
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve menus' });
    }
};

export const updateMenuById = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuId = req.params.id;
        const menuData: Partial<IMenu> = req.body;
        const updatedMenu = await updateMenu(menuId, menuData);
        if (updatedMenu) {
            res.status(200).json(updatedMenu);
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update menu' });
    }
};

export const deleteMenuById = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuId = req.params.id;
        const deletedMenu = await deleteMenu(menuId);
        if (deletedMenu) {
            res.status(200).json({ message: 'Menu deleted successfully' });
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete menu' });
    }
};

