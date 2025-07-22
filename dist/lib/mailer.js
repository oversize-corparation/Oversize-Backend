"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = sendOTP;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});
async function sendOTP(email) {
    const otp = generateOTP();
    await transporter.sendMail({
        from: `"MyApp" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
      <div style="font-family: sans-serif; font-size: 16px">
        <p>Assalomu alaykum!</p>
        <p>Sizning bir martalik tasdiqlash kodingiz (OTP):</p>
        <h2>${otp}</h2>
        <p>Bu kod 5 daqiqa ichida amal qiladi.</p>
      </div>
    `
    });
    return otp; // bu OTP'ni session yoki db'da saqlashingiz kerak
}
function generateOTP() {
    return crypto_1.default.randomInt(100000, 999999).toString(); // 6 xonali raqam
}
