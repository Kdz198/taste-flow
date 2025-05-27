import routes from 'express';
import { createMenu, createMenus, getMenu, getAll, updateMenuById, deleteMenuById } from '../controllers/menu.controller';
import { IMenu } from '../models/menu.model';

const router = routes.Router();
// Route to create a single menu
router.post('/menu', createMenu);
// Route to create multiple menus
router.post('/menus', createMenus);
// Route to get a menu by ID
router.get('/menu/:id', getMenu);
// Route to get all menus
router.get('/menus', getAll);
// Route to update a menu by ID
router.put('/menu/:id', updateMenuById);
// Route to delete a menu by ID
router.delete('/menu/:id', deleteMenuById);
// Export the router
export default router;