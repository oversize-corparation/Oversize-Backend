"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const validator_1 = require("../utils/validator");
const error_1 = require("../utils/error");
const jwt_1 = require("../lib/jwt");
const hash_1 = require("../lib/hash");
const { createHash, comparePassword } = hash_1.hashService;
const { createToken } = jwt_1.tokenService;
const prisma = new prisma_1.PrismaClient();
exports.default = {
    GET_ALL: async function (req, res, next) {
        try {
            const allUsers = await prisma.users.findMany();
            res.json(allUsers);
        }
        catch (error) {
            next(error);
        }
    },
    REGISTER: async function (req, res, next) {
        try {
            const user = req.body;
            const validator = validator_1.userValidator.validate(user);
            if (validator.error)
                throw new error_1.ClientError(validator.error.message, 400);
            const isExists = await prisma.users.findUnique({
                where: { email: user.email },
                select: { email: true }
            });
            if (isExists)
                throw new error_1.ClientError("This user already exists", 400);
            if (user.role_id && user.role_id == 1)
                throw new error_1.ClientError('Forbidden !', 403);
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
                    role_id: user.role_id
                }
            });
            console.log(newUser.id);
            res.status(201).json({ message: 'User successfully registered', status: 201, accessToken: createToken({ user_id: newUser.id, userAgent: req.headers['user-agent'] }) });
        }
        catch (error) {
            next(error);
        }
    },
    LOGIN: async function (req, res, next) {
        try {
            const user = {
                email: req.body.email.trim(),
                password: req.body.password.trim()
            };
            const validator = validator_1.loginValidator.validate(user);
            if (validator.error)
                throw new error_1.ClientError(validator.error.message, 400);
            const isExists = await prisma.users.findUnique({
                where: { email: user.email },
                select: { email: true, password: true, id: true }
            });
            if (!isExists)
                throw new error_1.ClientError("Invalid email or password", 400);
            if (!(await comparePassword(user.password, isExists.password)))
                throw new error_1.ClientError('Invalid email or password', 400);
            res.status(200).json({ message: 'User successfully logged in', status: 200, accessToken: createToken({ user_id: isExists.id, userAgent: req.headers['user-agent'] }) });
        }
        catch (error) {
            next(error);
        }
    }
};
