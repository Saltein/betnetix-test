import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email обязателен")
        .pipe(z.email("Некорректный email")),

    password: z
        .string()
        .min(8, "Минимум 8 символов")
        .max(32, "Максимум 32 символа")
        .regex(
            /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/,
            "Пароль может содержать только латиницу, цифры и спецсимволы",
        ),
});
