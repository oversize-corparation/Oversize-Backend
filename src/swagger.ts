import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Express } from "express";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Oversize project",
            version: "1.0.0",
            description: "Ts + Express + Swagger"
        }
    },

    apis: ['./src/routes/*.ts'], // Annotatsiya yozilgan fayllar yo'li
}

const swaggerSpec = swaggerJsDoc(options);

export function swaggerSetup (app: Express){
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}