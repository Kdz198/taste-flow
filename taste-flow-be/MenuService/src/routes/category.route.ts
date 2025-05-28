import routes from 'express';
import { createCategory, createCategories, getCategory, getAll, updateCategoryById, deleteCategoryByID } from '../controllers/category.controller';
import { ICategory } from '../models/category.model';

const router = routes.Router();

router.post('/', createCategory);
router.post('/', createCategories);
router.get('/:id', getCategory);
router.get('/', getAll);
router.delete('/:id', deleteCategoryByID);
router.put('/:id', updateCategoryById);

export default router