"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMenu = addMenu;
exports.addMenus = addMenus;
exports.getMenuById = getMenuById;
exports.getAllMenus = getAllMenus;
exports.updateMenu = updateMenu;
exports.deleteMenu = deleteMenu;
const menu_model_1 = require("../models/menu.model");
function addMenu(menuData) {
    return new Promise((resolve, reject) => {
        const newMenu = new menu_model_1.Menu(menuData);
        newMenu.save()
            .then((savedMenu) => {
            resolve(savedMenu);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function addMenus(menusData) {
    return new Promise((resolve, reject) => {
        menu_model_1.Menu.insertMany(menusData)
            .then((savedMenus) => {
            resolve(savedMenus);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function getMenuById(menuId) {
    return new Promise((resolve, reject) => {
        menu_model_1.Menu.findById(menuId)
            .then((menu) => {
            resolve(menu);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function getAllMenus() {
    return new Promise((resolve, reject) => {
        menu_model_1.Menu.find()
            .then((menus) => {
            resolve(menus);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function updateMenu(menuId, menuData) {
    return new Promise((resolve, reject) => {
        menu_model_1.Menu.findByIdAndUpdate(menuId, menuData, { new: true })
            .then((updatedMenu) => {
            resolve(updatedMenu);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
function deleteMenu(menuId) {
    return new Promise((resolve, reject) => {
        menu_model_1.Menu.findByIdAndDelete(menuId)
            .then((deletedMenu) => {
            resolve(deletedMenu);
        })
            .catch((error) => {
            reject(error);
        });
    });
}
