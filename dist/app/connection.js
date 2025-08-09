"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const chekSocketToken_1 = __importDefault(require("../utils/chekSocketToken"));
async function connecting(io) {
    io.on("connection", async (socket) => {
        const token = socket.handshake.auth.token;
        const user = await (0, chekSocketToken_1.default)(token);
        if (!user.status)
            return io.emit('error', { message: user.message });
        socket.join("user:general");
        socket.join(`user:${user.user.id}`);
        // socket.emit('error', {message: 'There is not a message'})
        socket.emit('success', { message: 'User successfully connected' });
        socket.on('notification_create', async (data) => {
            const newNotification = await prisma.notifications.create({
                data: {
                    content: data.content,
                    type_id: data.type_id,
                    to: data.to,
                    user_id: user.user.id,
                },
            });
            if (newNotification) {
                socket.emit('success', { message: 'User successfully created notification' });
                io.to(`user:${newNotification.to}`).emit('notification', { content: newNotification.content });
            }
            else
                socket.emit('error', { message: 'Something went wrong' });
        });
        socket.on('chat_send', async (data) => {
            console.log(data);
            const newChat = await prisma.chat.create({
                data: {
                    sender_id: user.user.id,
                    receiver_id: data.receiver_id,
                    message: data.message
                },
            });
            if (newChat) {
                socket.emit('success', { message: 'User successfully sended chat' });
                io.to(`user:${newChat.receiver_id}`).emit('notification', { sender_id: user.user.id, message: newChat.message });
            }
            else
                socket.emit('error', { message: 'Something went wrong' });
        });
        socket.on("disconnect", () => {
            console.log(`❌ Uzildi: ${user.user.firstname}`);
        });
    });
}
exports.default = connecting;
