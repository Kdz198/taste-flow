"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const menuSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        }],
    receipt: [
        {
            idIngredient: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ]
});
const Menu = mongoose_1.default.model('Menu', menuSchema);
exports.Menu = Menu;
exports.default = Menu;
