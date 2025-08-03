"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
exports.usersRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Faqat adminlar uchun — barcha foydalanuvchilar ro‘yxatini olish
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array users
 *       400:
 *         description: Access denied. Admin only
 */
exports.usersRouter.get("/", users_controller_1.usersController.GET_ALL);
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Userlar uchun profil ma'lumotlarini olib keladi
 *     responses:
 *
 *       200:
 *         description: user{}
 *       400:
 *         description: Client errors
 */
exports.usersRouter.get("/me", users_controller_1.usersController.GET_ME);
/**
 * @swagger
 * /api/users/:id:
 *   put:
 *     tags:
 *       - Users
 *     summary: Foydalanuvchini ma'lumotlarini yangilash. Parol kiritilishi kere bo'lgan inputlarni ochiq qoldirgan holda qolgan ma'lumotlarni kiritilsa ham yangilaydi. Agar parol yangilanishi kere bo'lsa eskisi ham yangisi ham kiritilishi shart.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               prev_password:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profil rasmi (ixtiyoriy)
 *     responses:
 *       201:
 *         description: We send your email identify number
 *       400:
 *         description: Client errors
 */
exports.usersRouter.put("/:id", users_controller_1.usersController.UPDATE);
/**
 * @swagger
 * /api/users/:id:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Userlarni soft delete qilish
 *     responses:
 *
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Client errors
 */
exports.usersRouter.delete("/:id", users_controller_1.usersController.DELETE);
