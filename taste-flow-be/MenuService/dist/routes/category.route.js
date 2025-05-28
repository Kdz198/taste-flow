"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
router.post('/', category_controller_1.createCategory);
router.post('/', category_controller_1.createCategories);
router.get('/:id', category_controller_1.getCategory);
router.get('/', category_controller_1.getAll);
router.delete('/:id', category_controller_1.deleteCategoryByID);
router.put('/:id', category_controller_1.updateCategoryById);
exports.default = router;
