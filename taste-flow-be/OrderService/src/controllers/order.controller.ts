import {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrder,
    deleteOrder
} from '../daos/order.dao';
import { Request, Response } from 'express';
export const createNewOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderData = req.body;
        const newOrder = await createOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
}
export const getOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const order = await getOrderById(orderId);
        if (order) {
            res.status(200).json(order);
        }
        else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
}
export const updateOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const orderData = req.body;
        const updatedOrder = await updateOrder(orderId, orderData);
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        }
        else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
}
export const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await deleteOrder(orderId);
        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
}
export const getAllOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
}
export default {
    createNewOrder,
    getOrder,
    updateOrderById,
    deleteOrderById,
    getAllOrder
};