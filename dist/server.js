"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const globalError_1 = require("./middlewares/globalError");
const config_1 = require("./config");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const main_routes_1 = require("./routes/main.routes");
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();

app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, swagger_1.swaggerSetup)(app);
app.get('/', (req, res) => res.send('<h1>Main</h1>'));
app.use('/api', main_routes_1.mainRouter);
app.use(globalError_1.globalError);
const { PORT } = config_1.serverConfig;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
/// testing for pull
