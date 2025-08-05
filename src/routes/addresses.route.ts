import { Router } from "express";
import { addressesController } from "../controllers/addresses.controller";
import checkToken from "../utils/chekToken";

export const addressesRouter = Router();

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: Foydalanuvchining barcha manzillarini olish
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manzillar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
addressesRouter.get("/", checkToken, addressesController.GET_ALL);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     tags:
 *       - Addresses
 *     summary: Yangi manzil qo‘shish
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Uy
 *               address_line:
 *                 type: string
 *                 example: Toshkent, Chilonzor
 *               map_url:
 *                 type: string
 *                 example: https://maps.google.com/...
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Manzil muvaffaqiyatli qo‘shildi
 *       400:
 *         description: Client error
 */
addressesRouter.post("/", checkToken, addressesController.CREATE);

/**
 * @swagger
 * /api/addresses/{id}:
 *   patch:
 *     tags:
 *       - Addresses
 *     summary: Foydalanuvchining manzilini tahrirlash
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               address_line:
 *                 type: string
 *               map_url:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Manzil yangilandi
 *       404:
 *         description: Address topilmadi
 */
addressesRouter.patch("/:id", checkToken, addressesController.UPDATE);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     tags:
 *       - Addresses
 *     summary: Foydalanuvchining manzilini o‘chirish
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Manzil o‘chirildi
 *       404:
 *         description: Address topilmadi
 */
addressesRouter.delete("/:id", checkToken, addressesController.DELETE);
