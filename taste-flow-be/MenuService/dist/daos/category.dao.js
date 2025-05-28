"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategory = addCategory;
exports.addCategories = addCategories;
exports.getCategoryById = getCategoryById;
exports.getAllCategories = getAllCategories;
exports.updateCategory = updateCategory;
exports.deleteCategoryById = deleteCategoryById;
const category_model_1 = require("../models/category.model");
function addCategory(categoryData) {
    return new Promise((resolve, reject) => {
        const newCategory = new category_model_1.Category(categoryData);
        newCategory.save()
            .then((savedCategory) => {
            resolve(savedCategory);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function addCategories(categoriesData) {
    return new Promise((resolve, reject) => {
        category_model_1.Category.insertMany(categoriesData)
            .then((savedCategories) => {
            resolve(savedCategories);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function getCategoryById(categoryId) {
    return new Promise((resolve, reject) => {
        category_model_1.Category.findById(categoryId)
            .then((category) => {
            resolve(category);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function getAllCategories() {
    return new Promise((resolve, reject) => {
        category_model_1.Category.find()
            .then((categories) => {
            resolve(categories);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function updateCategory(categoryId, categoryData) {
    return new Promise((resolve, reject) => {
        category_model_1.Category.findByIdAndUpdate(categoryId, categoryData, { new: true })
            .then((updatedCategory) => {
            resolve(updatedCategory);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function deleteCategoryById(categoryId) {
    return new Promise((resolve, reject) => {
        category_model_1.Category.findByIdAndDelete(categoryId)
            .then((deletedCategory) => {
            resolve(deletedCategory);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
