"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menu_controller_1 = require("../controllers/menu.controller");
const router = express_1.default.Router();
router.post('/', menu_controller_1.createMenu);
router.post('/', menu_controller_1.createMenus);
router.get('/:id', menu_controller_1.getMenu);
router.get('/', menu_controller_1.getAll);
router.put('/:id', menu_controller_1.updateMenuById);
router.delete('/:id', menu_controller_1.deleteMenuById);
router.get('/hi', (req, res) => {
    res.status(200).send('OK');
});
exports.default = router;
