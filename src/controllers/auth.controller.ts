import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import {
  loginValidator,
  sendOtpValidator,
  userValidator,
  verifyOtpValidator,
} from "../utils/validator";
import { ClientError } from "../utils/error";
import { tokenService } from "../lib/jwt";
import { hashService } from "../lib/hash";
import { UserRegisterInterface } from "../types/userRegister.dto";
import { UserLoginInterface } from "../types/userLogin.dto";
import { sendOTP } from "../lib/mailer";
const { createHash, comparePassword } = hashService;
const { createToken } = tokenService;
import dayjs from "dayjs";
import { waitConfig } from "../config";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const prisma = new PrismaClient();

export default {
  GET_ALL: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const allUsers = await prisma.users.findMany();
      res.json(allUsers);
    } catch (error) {
      next(error);
    }
  },
  REGISTER: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user: UserRegisterInterface = req.body;
      const validator = userValidator.validate(user);
      if (validator.error) throw new ClientError(validator.error.message, 400);

      const isExists = await prisma.users.findUnique({
        where: { email: user.email },
        select: { email: true },
      });

      if (isExists) throw new ClientError("This user already exists", 400);
      if (user.role_id && user.role_id == 1)
        throw new ClientError("Forbidden !", 403);
      user.role_id = user.role_id || 2;
      user.password = await createHash(user.password);

      const newUser = await prisma.users.create({
        data: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          phone_number: user.phone_number,
          avatar_url: user.avatar_url,
          role_id: user.role_id,
        },
      });

      console.log(newUser.id);

      res.status(201).json({
        message: "User successfully registered",
        status: 201,
        accessToken: createToken({
          user_id: newUser.id,
          userAgent: req.headers["user-agent"],
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  LOGIN: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = {
        email: req.body.email.trim(),
        password: req.body.password.trim(),
      };

      const validator = loginValidator.validate(user);
      if (validator.error) throw new ClientError(validator.error.message, 400);

      const isExists = await prisma.users.findUnique({
        where: { email: user.email },
      });

      if (!isExists) throw new ClientError("Invalid email or password", 400);

      // ✅ Account locked tekshiruv
      if (isExists.locked_until && dayjs().isBefore(isExists.locked_until)) {
        const waitTime = dayjs(isExists.locked_until).diff(dayjs(), "second");
        throw new ClientError(
          `Account is locked. Try again after ${waitTime} seconds.`,
          403
        );
      }

      // ✅ Parolni tekshirish
      const isPasswordCorrect = await comparePassword(
        user.password,
        isExists.password
      );

      if (!isPasswordCorrect) {
        const updatedAttempts = (isExists.login_attempts || 0) + 1;

        const updateData: any = {
          login_attempts: updatedAttempts,
          last_failed_login: new Date(),
        };

        // ❌ 5 martadan ko'p bo‘lsa — 30 sekund blok
        if (updatedAttempts >= waitConfig.MAX_FAILED_ATTEMPTS) {
          updateData.locked_until = dayjs()
            .add(waitConfig.LOCK_TIME_SECONDS, "second")
            .toDate();
        }

        await prisma.users.update({
          where: { email: user.email },
          data: updateData,
        });

        throw new ClientError("Invalid email or password", 400);
      }

      // ✅ Muvaffaqiyatli login — urinishlarni tozalash
      await prisma.users.update({
        where: { email: user.email },
        data: {
          login_attempts: 0,
          last_failed_login: null,
          locked_until: null,
        },
      });

      res.status(200).json({
        message: "User successfully logged in",
        status: 200,
        accessToken: createToken({
          user_id: isExists.id,
          userAgent: req.headers["user-agent"],
        }),
      });
    } catch (error) {
      next(error);
    }
  },

  SEND_OTP: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const validator = sendOtpValidator.validate({ email });
      if (validator.error) throw new ClientError(validator.error.message, 400);

      const otp = await sendOTP(email);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 daqiqa

      await prisma.otp.create({
        data: {
          email: email,
          code: otp,
          expiresAt: expiresAt,
        },
      });

      return res.status(200).json({ message: "OTP yuborildi", status: 200 });
    } catch (error) {
      next(error);
    }
  },
  VERIFY_OTP: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;
      const validator = verifyOtpValidator.validate({ email, code });
      if (validator.error) throw new ClientError(validator.error.message, 400);
      const otpEntry = await prisma.otp.findFirst({
        where: { email, code },
      });

      const user = await prisma.users.findFirst({
        where: { email },
      });

      if (!(user && otpEntry && otpEntry.expiresAt > new Date())) {
        if (otpEntry) {
          await prisma.otp.update({
            where: { id: otpEntry.id },
            data: { is_invalid: true },
          });
        }
        return res
          .status(401)
          .json({ message: "Kod noto'g'ri yoki muddati tugagan" });
      }

      await prisma.otp.update({
        where: { id: otpEntry.id },
        data: { verified: true },
      });
      res.status(200).json({
        message: "User successfully logged in",
        status: 200,
        accessToken: createToken({
          user_id: user.id,
          userAgent: req.headers["user-agent"],
        }),
      });
    } catch (error) {
      next(error);
    }
  },
};
