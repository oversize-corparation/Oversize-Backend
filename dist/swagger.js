"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSetup = swaggerSetup;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Oversize project",
            version: "1.0.0",
            description: "Ts + Express + Swagger"
        }
    },
    apis: ['./src/routes/*.ts'], // Annotatsiya yozilgan fayllar yo'li
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function swaggerSetup(app) {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
}
