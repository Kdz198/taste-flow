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
exports.deleteCategoryByID = exports.updateCategoryById = exports.getAll = exports.getCategory = exports.createCategories = exports.createCategory = void 0;
const category_dao_1 = require("../daos/category.dao");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        const newCategory = yield (0, category_dao_1.addCategory)(categoryData);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});
exports.createCategory = createCategory;
const createCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriesData = req.body;
        const newCategories = yield (0, category_dao_1.addCategories)(categoriesData);
        res.status(201).json(newCategories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create categories' });
    }
});
exports.createCategories = createCategories;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const category = yield (0, category_dao_1.getCategoryById)(categoryId);
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(404).json({ error: 'Category not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve category' });
    }
});
exports.getCategory = getCategory;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield (0, category_dao_1.getAllCategories)();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
});
exports.getAll = getAll;
const updateCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const categoryData = req.body;
        const updatedCategory = yield (0, category_dao_1.updateCategory)(categoryId, categoryData);
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        }
        else {
            res.status(404).json({ error: 'Category not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});
exports.updateCategoryById = updateCategoryById;
const deleteCategoryByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const deletedCategory = yield (0, category_dao_1.deleteCategoryById)(categoryId);
        if (deletedCategory) {
            res.status(200).json(deletedCategory);
        }
        else {
            res.status(404).json({ error: 'Category not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});
exports.deleteCategoryByID = deleteCategoryByID;
