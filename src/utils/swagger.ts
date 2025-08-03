import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Express } from "express";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Oversize API hujjatlari",
            version: "1.0.0",
            description: "Bu yerda barcha Auth, Email yuborish, va boshqa xizmatlar bo‘yicha API hujjatlari keltirilgan."
        },
        servers: [
            {
                url: "http://localhost:4000",
                description: "Local server"
            },
            {
                url: "https://oversize-backend-fe9t.onrender.com",
                description: "Production server"
            }
        ],
        tags: [
            {
            name: 'Auth',
            },
            {
            name: 'Users',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // ixtiyoriy, Swagger UI uchun ko‘rinish beradi
                }
            }
        },
        security: [
            {
                bearerAuth: [] // Har bir endpointga token kerakligini bildiradi
            }
        ]
    },

    apis: ['./src/routes/*.ts'], // Annotatsiya yozilgan fayllar yo'li
}

const swaggerSpec = swaggerJsDoc(options);

export function swaggerSetup (app: Express){
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}