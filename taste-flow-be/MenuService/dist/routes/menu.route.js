"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menu_controller_1 = require("../controllers/menu.controller");
const router = express_1.default.Router();
// Route to create a single menu
router.post('/menu', menu_controller_1.createMenu);
// Route to create multiple menus
router.post('/menus', menu_controller_1.createMenus);
// Route to get a menu by ID
router.get('/menu/:id', menu_controller_1.getMenu);
// Route to get all menus
router.get('/menus', menu_controller_1.getAll);
// Route to update a menu by ID
router.put('/menu/:id', menu_controller_1.updateMenuById);
// Route to delete a menu by ID
router.delete('/menu/:id', menu_controller_1.deleteMenuById);
// Export the router
exports.default = router;
