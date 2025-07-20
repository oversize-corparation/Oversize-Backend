"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ClientError = void 0;
class ClientError extends Error {
    constructor(message, status) {
        super(message);
        this.message = `ClientError ${message}`;
        this.status = status;
    }
}
exports.ClientError = ClientError;
class ServerError extends Error {
    constructor(message) {
        super(message);
        this.message = `ServerError ${message}`;
        this.status = 500;
    }
}
exports.ServerError = ServerError;
