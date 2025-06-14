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
exports.createOrder = createOrder;
exports.getOrderById = getOrderById;
exports.getAllOrders = getAllOrders;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
const order_model_1 = require("../models/order.model");
function createOrder(orderData) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = new order_model_1.Order(orderData);
        return yield order.save();
    });
}
function getOrderById(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield order_model_1.Order.findById(orderId).exec();
    });
}
function getAllOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield order_model_1.Order.find().exec();
    });
}
function updateOrder(orderId, orderData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield order_model_1.Order.findByIdAndUpdate(orderId, orderData, { new: true }).exec();
    });
}
function deleteOrder(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield order_model_1.Order.findByIdAndDelete(orderId).exec();
    });
}
exports.default = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrder,
    deleteOrder
};
