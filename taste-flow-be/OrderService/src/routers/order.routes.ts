import routes from 'express';
import { createNewOrder, getOrder, updateOrderById, deleteOrderById, getAllOrder } from '../controllers/order.controller';
const router = routes.Router();
router.post('/', createNewOrder);
router.get('/:id', getOrder);
router.put('/:id', updateOrderById);
router.delete('/:id', deleteOrderById);
router.get('/', getAllOrder);

export default router;