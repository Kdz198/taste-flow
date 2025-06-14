"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrder = exports.deleteOrderById = exports.updateOrderById = exports.getOrder = exports.createNewOrder = void 0;
const order_dao_1 = require("../daos/order.dao");
const createNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        const newOrder = yield (0, order_dao_1.createOrder)(orderData);
        res.status(201).json(newOrder);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});
exports.createNewOrder = createNewOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield (0, order_dao_1.getOrderById)(orderId);
        if (order) {
            res.status(200).json(order);
        }
        else {
            res.status(404).json({ error: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order' });
    }
});
exports.getOrder = getOrder;
const updateOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const orderData = req.body;
        const updatedOrder = yield (0, order_dao_1.updateOrder)(orderId, orderData);
        if (updatedOrder) {
            res.status(200).json(updatedOrder);
        }
        else {
            res.status(404).json({ error: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});
exports.updateOrderById = updateOrderById;
const deleteOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const deletedOrder = yield (0, order_dao_1.deleteOrder)(orderId);
        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
exports.deleteOrderById = deleteOrderById;
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_dao_1.getAllOrders)();
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});
exports.getAllOrder = getAllOrder;
exports.default = {
    createNewOrder: exports.createNewOrder,
    getOrder: exports.getOrder,
    updateOrderById: exports.updateOrderById,
    deleteOrderById: exports.deleteOrderById,
    getAllOrder: exports.getAllOrder
};
