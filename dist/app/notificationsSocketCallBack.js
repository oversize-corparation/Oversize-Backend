"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notificationsSocketCallBack = function (socket, io) {
    socket.on('notification_create', (data) => {
        if (!Object.keys(data).length)
            socket.emit('notification_error', { message: 'There is not a message' });
        console.log(data);
        socket.emit('notification_success', { message: 'There is success' });
    });
};
exports.default = notificationsSocketCallBack;
