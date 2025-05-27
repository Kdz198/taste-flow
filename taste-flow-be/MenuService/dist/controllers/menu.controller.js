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
exports.deleteMenuById = exports.updateMenuById = exports.getAll = exports.getMenu = exports.createMenus = exports.createMenu = void 0;
const menu_dao_1 = require("../daos/menu.dao");
const createMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuData = req.body;
        const newMenu = yield (0, menu_dao_1.addMenu)(menuData);
        res.status(201).json(newMenu);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create menu' });
    }
});
exports.createMenu = createMenu;
const createMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menusData = req.body;
        const newMenus = yield (0, menu_dao_1.addMenus)(menusData);
        res.status(201).json(newMenus);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create menus' });
    }
});
exports.createMenus = createMenus;
const getMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuId = req.params.id;
        const menu = yield (0, menu_dao_1.getMenuById)(menuId);
        if (menu) {
            res.status(200).json(menu);
        }
        else {
            res.status(404).json({ error: 'Menu not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve menu' });
    }
});
exports.getMenu = getMenu;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield (0, menu_dao_1.getAllMenus)();
        res.status(200).json(menus);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve menus' });
    }
});
exports.getAll = getAll;
const updateMenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuId = req.params.id;
        const menuData = req.body;
        const updatedMenu = yield (0, menu_dao_1.updateMenu)(menuId, menuData);
        if (updatedMenu) {
            res.status(200).json(updatedMenu);
        }
        else {
            res.status(404).json({ error: 'Menu not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update menu' });
    }
});
exports.updateMenuById = updateMenuById;
const deleteMenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menuId = req.params.id;
        const deletedMenu = yield (0, menu_dao_1.deleteMenu)(menuId);
        if (deletedMenu) {
            res.status(200).json({ message: 'Menu deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Menu not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete menu' });
    }
});
exports.deleteMenuById = deleteMenuById;
