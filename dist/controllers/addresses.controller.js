"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesController = void 0;
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.addressesController = {
    // GET /api/addresses
    GET_ALL: async (req, res, next) => {
        try {
            const tokenData = req.user;
            const addresses = await prisma.addresses.findMany({
                where: { user_id: tokenData.user_id },
                orderBy: { is_default: "desc" },
            });
            res.status(200).json({ status: 200, addresses });
        }
        catch (error) {
            next(error);
        }
    },
    // POST /api/addresses
    CREATE: async (req, res, next) => {
        try {
            const tokenData = req.user;
            const validation = validator_1.addressValidator.validate(req.body);
            if (validation.error)
                throw new error_1.ClientError(validation.error.message, 400);
            const { title, address_line, map_url, is_default } = req.body;
            // Agar bu default bo'lsa, boshqalarni default emas qilamiz
            if (is_default) {
                await prisma.addresses.updateMany({
                    where: { user_id: tokenData.user_id },
                    data: { is_default: false },
                });
            }
            const newAddress = await prisma.addresses.create({
                data: {
                    user_id: tokenData.user_id,
                    title,
                    address_line,
                    map_url,
                    is_default,
                },
            });
            res.status(201).json({ status: 201, message: "Address created", address: newAddress });
        }
        catch (error) {
            next(error);
        }
    },
    // PATCH /api/addresses/:id
    UPDATE: async (req, res, next) => {
        try {
            const tokenData = req.user;
            const addressId = Number(req.params.id);
            const existing = await prisma.addresses.findUnique({
                where: { id: addressId },
            });
            if (!existing || existing.user_id !== tokenData.user_id) {
                throw new error_1.ClientError("Address not found or access denied", 403);
            }
            const validation = validator_1.addressValidator.validate(req.body);
            if (validation.error)
                throw new error_1.ClientError(validation.error.message, 400);
            const { title, address_line, map_url, is_default } = req.body;
            if (is_default) {
                await prisma.addresses.updateMany({
                    where: { user_id: tokenData.user_id },
                    data: { is_default: false },
                });
            }
            const updated = await prisma.addresses.update({
                where: { id: addressId },
                data: { title, address_line, map_url, is_default },
            });
            res.status(200).json({ status: 200, message: "Address updated", address: updated });
        }
        catch (error) {
            next(error);
        }
    },
    // DELETE /api/addresses/:id
    DELETE: async (req, res, next) => {
        try {
            const tokenData = req.user;
            const addressId = Number(req.params.id);
            const existing = await prisma.addresses.findUnique({
                where: { id: addressId },
            });
            if (!existing || existing.user_id !== tokenData.user_id) {
                throw new error_1.ClientError("Address not found or access denied", 403);
            }
            await prisma.addresses.delete({ where: { id: addressId } });
            res.status(200).json({ status: 200, message: "Address deleted" });
        }
        catch (error) {
            next(error);
        }
    },
};
