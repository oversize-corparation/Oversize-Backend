import nodemailer from "nodemailer";
import crypto from "crypto";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});


export async function sendOTP(email: string): Promise<string> {
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

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString(); // 6 xonali raqam
}
