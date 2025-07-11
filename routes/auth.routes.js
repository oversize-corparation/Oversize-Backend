// src/routes/auth.routes.js

const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Register yangi foydalanuvchi
authRouter.post('/register', authController.register);
// Login
authRouter.post('/login', authController.login);
// Foydalanuvchi profilini olish
authRouter.get('/me', authMiddleware, authController.me);
module.exports = authRouter;
