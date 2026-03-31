import type { FunctionComponent } from "react";
import s from "./LoginPage.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";
import { Form, TextField, Input, Label, FieldError } from "@heroui/react";

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

                <TextField
                    isRequired
                    name="email"
                    type="email"
                    validate={(value) => {
                        if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                value,
                            )
                        ) {
                            return "Please enter a valid email address";
                        }
                        return null;
                    }}
                >
                    <Label>Email</Label>
                    <Input placeholder="john@example.com" />
                    <FieldError />
                </TextField>
            </div>
        </div>
    );
};
