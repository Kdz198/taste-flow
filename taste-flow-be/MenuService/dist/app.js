"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Starting Menu Service...');
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const menu_route_1 = __importDefault(require("./routes/menu.route"));
const db_1 = require("./database/db");
(0, db_1.connectDB)();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', menu_route_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Menu Service is running on port ${process.env.PORT}`);
});
