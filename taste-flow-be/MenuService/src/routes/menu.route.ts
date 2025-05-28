import routes, { Request, Response } from 'express';
import { createMenu, createMenus, getMenu, getAll, updateMenuById, deleteMenuById } from '../controllers/menu.controller';
import { IMenu } from '../models/menu.model';

const router = routes.Router();
router.post('/', createMenu);
router.post('/add-menus', createMenus);
router.get('/:id', getMenu);
router.get('/', getAll);
router.put('/:id', updateMenuById);
router.delete('/:id', deleteMenuById);
export default router;