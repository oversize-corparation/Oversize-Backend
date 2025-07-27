import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime); 

const prisma = new PrismaClient();

// Config
const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_ATTEMPTS || "5");
const LOCK_TIME_MINUTES = parseInt(process.env.LOCK_TIME_MINUTES || "30");

export async function login(email: string, password: string) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is locked
  if (user.locked_until && dayjs().isBefore(user.locked_until)) {
    const waitTime = dayjs(user.locked_until).fromNow(true);
    throw new Error(`Account is locked. Try again in ${waitTime}.`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const updatedAttempts = (user.login_attempts || 0) + 1;

    const updateData: any = {
      login_attempts: updatedAttempts,
      last_failed_login: new Date(),
    };

    if (updatedAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.locked_until = dayjs()
        .add(LOCK_TIME_MINUTES, "minute")
        .toDate();
    }

    await prisma.users.update({
      where: { email },
      data: updateData,
    });

    throw new Error("Invalid credentials");
  }

  // If login successful: reset attempts
  await prisma.users.update({
    where: { email },
    data: {
      login_attempts: 0,
      last_failed_login: null,
      locked_until: null,
    },
  });

  return { message: "Login successful!" };
}
