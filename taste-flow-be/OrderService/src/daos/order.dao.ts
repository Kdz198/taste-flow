import {IOrder, Order} from '../models/order.model';

async function createOrder(orderData: IOrder): Promise<IOrder> {
    const order = new Order(orderData);
    return await order.save();
}
async function getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId).exec();
}
async function getAllOrders(): Promise<IOrder[]> {
    return await Order.find().exec();
}
async function updateOrder(orderId: string, orderData: Partial<IOrder>): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(orderId, orderData, {new: true}).exec();
}
async function deleteOrder(orderId: string): Promise<IOrder | null> {
    return await Order.findByIdAndDelete(orderId).exec();
}


export {createOrder, getOrderById, getAllOrders, updateOrder, deleteOrder};
export default {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrder,
    deleteOrder
};