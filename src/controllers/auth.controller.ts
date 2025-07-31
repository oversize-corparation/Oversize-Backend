import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
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

  SIGN_IN_GOOGLE: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const secretDatas:{client_id:string, redirect_uri:string} = {
        client_id: process.env.GOOGLE_CLIENT_ID_DEV!,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      }
      const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      new URLSearchParams({
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        ...secretDatas
      }).toString();
    // Brauzerga redirect qilinadi
    res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },

  CALLBACK_GOOGLE: async function (req: Request, res: Response, next: NextFunction) {
    try {
    const { code } = req.query;
    const secretDatas:{client_id:string, redirect_uri:string, client_secret:string} = {
        client_id: process.env.GOOGLE_CLIENT_ID_DEV!,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET_DEV!
    }
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code: code as string,     
        grant_type: 'authorization_code',
        ...secretDatas
      }).toString()
    });
    const tokenData = await tokenRes.json();
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const user = await userInfoRes.json();

    if(!user.verified_email) throw new ClientError("Something went wrong with your gmail account!", 400);
      
    const isExists = await prisma.users.findUnique({
        where: { email: user.email }
    });

      if(!isExists) {
        user.role_id = user.role_id || 2;
        const newUser = await prisma.users.create({
          data: {
            firstname: user.given_name,
            lastname: user.family_name,
            email: user.email,
            password: null,
            phone_number: '',
            avatar_url: user.picture,
            role_id: user.role_id,
            is_google_account: true
          },
        });

        res.status(201).json({
          message: "User successfully registered",
          status: 201,
          accessToken: createToken({
            user_id: newUser.id,
            userAgent: req.headers["user-agent"],
          }),
        });
      } else {
          await prisma.users.update({
            where: { email: user.email },
            data: {
              login_attempts: 0,
              last_failed_login: null,
              locked_until: null,
            },
          });
          res.redirect(`http://localhost:4000?token=${createToken({
              user_id: isExists.id,
              userAgent: req.headers["user-agent"],
            })}`)
      }
    } catch (error) {
      next(error);
    }
  },
  
  REGISTER: async function (req: Request & { file?: Express.Multer.File }, res: Response, next: NextFunction) {
    try {
      const buffer = req.file?.buffer;
      const base64Image = buffer?.toString("base64");
      const apiKey = process.env.IMGBB_API_KEY;
      if(!buffer) { delete req.body.image }
      const user: UserRegisterInterface = req.body;
      const validator = userValidator.validate(user);
      if (validator.error) throw new ClientError(validator.error.message, 400);

      const isExists = await prisma.users.findUnique({
        where: { email: user.email },
        select: { email: true },
      });

      if (isExists) throw new ClientError("This user already exists", 400);
      // if (user.role_id && user.role_id == 1)
      //   throw new ClientError("Forbidden !", 403);
      user.role_id = user.role_id || 2;
      user.password = await createHash(user.password);
      user.avatar_url = '';
      if(buffer){
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            image: base64Image!,
          }),
        });
        const data = await response.json();
        user.avatar_url = data.data.image.url;
      }


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
      console.log(req.body);
      
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
        isExists.password!
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

      const user = await prisma.users.findFirst({
        where: { email },
      });
      if(!user) throw new ClientError('This user not found', 400);

      const otp = await sendOTP(email);
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 daqiqa

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
