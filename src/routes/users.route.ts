import { Router } from "express";
import { usersController } from "../controllers/users.controller";

export const usersRouter = Router();




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
usersRouter.get("/",  usersController.GET_ALL);

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
usersRouter.get("/me",  usersController.GET_ME);

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
usersRouter.put("/:id",  usersController.UPDATE);

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
usersRouter.delete("/:id", usersController.DELETE);
