"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const hash_1 = require("../lib/hash");
const prisma = new client_1.PrismaClient();
exports.usersController = {
    // GET /api/users — faqat admin ko‘radi
    GET_ALL: async (req, res, next) => {
        try {
            const tokenData = req.user;
            if (tokenData.role_id !== 1) {
                throw new error_1.ClientError("Access denied. Admin only.", 403);
            }
            const users = await prisma.users.findMany({
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    phone_number: true,
                    avatar_url: true,
                    verify_email: true,
                    is_active: true,
                    created_at: true,
                    is_deleted: true
                },
            });
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    },
    // GET /api/users/me — foydalanuvchi o‘zini ko‘radi
    GET_ME: async (req, res, next) => {
        try {
            const tokenData = req.user;
            const user = await prisma.users.findUnique({
                where: { id: tokenData.user_id, is_deleted: false },
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    phone_number: true,
                    avatar_url: true,
                    verify_email: true,
                    is_active: true,
                    created_at: true,
                },
            });
            if (!user)
                throw new error_1.ClientError("User not found", 404);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    // PATCH /api/users/:id — foydalanuvchi o‘zini yangilaydi
    UPDATE: async (req, res, next) => {
        try {
            const buffer = req.file?.buffer;
            const base64Image = buffer?.toString("base64");
            const apiKey = process.env.IMGBB_API_KEY;
            if (!buffer) {
                delete req.body.image;
            }
            const tokenData = req.user;
            const userId = Number(req.params.id);
            if (!(tokenData.role_id == 1))
                if (tokenData.user_id != userId)
                    throw new error_1.ClientError("You can only update your own profile.", 403);
            const validation = validator_1.userValidator.validate(req.body);
            if (validation.error)
                throw new error_1.ClientError(validation.error.message, 400);
            const user = req.body;
            const prevUser = await prisma.users.findUnique({
                where: { id: userId }
            });
            if (!prevUser)
                throw new error_1.ClientError("User not found", 404);
            if (!(user.email == prevUser.email)) {
                const verifyEmailExcist = await prisma.users.findUnique({
                    where: { email: user.email }
                });
                if (verifyEmailExcist)
                    throw new error_1.ClientError("This user with this email already excist", 400);
            }
            if (prevUser.password == null && user.password) {
                user.password = await hash_1.hashService.createHash(user.password);
                delete user.prev_password;
            }
            else {
                if (user.prev_password && user.password) {
                    if (!(await hash_1.hashService.comparePassword(user.prev_password, prevUser.password)))
                        throw new error_1.ClientError("Wrong password", 400);
                    user.password = await hash_1.hashService.createHash(user.password);
                    delete user.prev_password;
                }
            }
            if (buffer) {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        image: base64Image,
                    }),
                });
                const data = await response.json();
                user.avatar_url = data.data.image.url;
            }
            else
                user.avatar_url = prevUser.avatar_url;
            const updatedUser = await prisma.users.update({
                where: { id: userId },
                data: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone_number: user.phone_number,
                    avatar_url: user.avatar_url,
                    email: user.email,
                },
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                    phone_number: true,
                    avatar_url: true,
                },
            });
            res.status(200).json({
                status: 200,
                message: "Profile updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    },
    // DELETE /api/users/:id — faqat o‘zini o‘chirish
    DELETE: async (req, res, next) => {
        try {
            const tokenData = req.user;
            const userId = Number(req.params.id);
            const user = await prisma.users.findUnique({
                where: { id: tokenData.user_id, is_deleted: false },
                select: { id: true },
            });
            if (!user)
                throw new error_1.ClientError("User not found", 404);
            if (!(tokenData.role_id == 1))
                if (tokenData.user_id != userId)
                    throw new error_1.ClientError("You can only delete your own account.", 403);
            await prisma.users.update({
                where: { id: userId },
                data: { is_deleted: true }
            });
            res.status(200).json({
                status: 200,
                message: "Account deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    },
};
