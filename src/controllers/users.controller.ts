import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ClientError } from "../utils/error";
import { verifyTokenInterface } from "../types/verifyToken.dto";
import { userValidator } from "../utils/validator";

declare global {
  namespace Express {
    interface Request {
      user?: verifyTokenInterface;
    }
  }
}

const prisma = new PrismaClient();

export const usersController = {
  // GET /api/users — faqat admin ko‘radi
  GET_ALL: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = req.user as verifyTokenInterface;

      const currentUser = await prisma.users.findUnique({
        where: { id: tokenData.user_id },
        select: { role_id: true },
      });

      if (!currentUser || currentUser.role_id !== 1) {
        throw new ClientError("Access denied. Admin only.", 403);
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
        },
      });

      res.status(200).json({ status: 200, users });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/users/me — foydalanuvchi o‘zini ko‘radi
  GET_ME: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = req.user as verifyTokenInterface;

      const user = await prisma.users.findUnique({
        where: { id: tokenData.user_id },
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

      if (!user) throw new ClientError("User not found", 404);

      res.status(200).json({ status: 200, user });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/users/:id — foydalanuvchi o‘zini yangilaydi
  UPDATE: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = req.user as verifyTokenInterface;
      const userId = Number(req.params.id);

      if(!(tokenData.role_id == 1)) if(tokenData.user_id != userId) throw new ClientError("You can only update your own profile.", 403);
      
      const validation = userValidator.validate(req.body);
      if (validation.error) throw new ClientError(validation.error.message, 400);

      const updatedUser = await prisma.users.update({
        where: { id: userId },
        data: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone_number: req.body.phone_number,
          avatar_url: req.body.avatar_url,
          verify_email: req.body.verify_email,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          phone_number: true,
          avatar_url: true,
          verify_email: true,
          is_active: true,
        },
      });

      res.status(200).json({
        status: 200,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/users/:id — faqat o‘zini o‘chirish
  DELETE: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenData = req.user as verifyTokenInterface;
      const userId = Number(req.params.id);

      if(!(tokenData.role_id == 1)) if(tokenData.user_id != userId) throw new ClientError("You can only delete your own account.", 403);

      await prisma.users.delete({
        where: { id: userId },
      });

      res.status(200).json({
        status: 200,
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
