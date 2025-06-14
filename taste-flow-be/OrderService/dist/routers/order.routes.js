"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post('/', order_controller_1.createNewOrder);
router.get('/:id', order_controller_1.getOrder);
router.put('/:id', order_controller_1.updateOrderById);
router.delete('/:id', order_controller_1.deleteOrderById);
router.get('/', order_controller_1.getAllOrder);
exports.default = router;
