import type { FunctionComponent } from "react";
import s from "./LoginPage.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";
import { DefaultInput } from "../../shared";
import { loginSchema } from "../../shared/validation/loginSchema";
import { Button } from "@heroui/react";

interface LoginPageProps {}

export const LoginPage: FunctionComponent<LoginPageProps> = () => {
    return (
        <div className={s.wrapper}>
            <div className={s.form}>
                <BTXIcon className={s.icon} />
                <div className={s.titles}>
                    <h2>Панель администратора</h2>
                    <h3>Войдите в систему для продолжения</h3>
                </div>

                <div className={s.inputs}>
                    <DefaultInput
                        name="name"
                        type="email"
                        validate={(value) => {
                            const result =
                                loginSchema.shape.email.safeParse(value);

                            if (!result.success) {
                                return result.error.issues[0]?.message;
                            }

                            return null;
                        }}
                        label="Имя пользователя"
                        placeholder="admin@example.com"
                    />
                    <DefaultInput
                        name="password"
                        type="password"
                        validate={(value) => {
                            const result =
                                loginSchema.shape.password.safeParse(value);

                            if (!result.success) {
                                return result.error.issues[0]?.message;
                            }

                            return null;
                        }}
                        label="Пароль"
                        placeholder="Введите пароль"
                    />
                </div>

                <Button className={s.button}>Войти</Button>
            </div>
        </div>
    );
};
