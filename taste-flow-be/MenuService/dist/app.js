"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Starting Menu Service...');
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const menu_route_1 = __importDefault(require("./routes/menu.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const db_1 = require("./database/db");
(0, db_1.connectDB)();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/menu', menu_route_1.default);
app.use('/api/category', category_route_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Menu Service is running on port ${process.env.PORT}`);
});
//Eureka Config
// import { eurekaClient } from './config/eureka.client';
// app.listen(3000, () => {
//     console.log('MenuService is running on port 3000');
//     eurekaClient.start((error: any) => {
//         console.log('Eureka registration complete or failed:', error || 'OK');
//     });
// });
