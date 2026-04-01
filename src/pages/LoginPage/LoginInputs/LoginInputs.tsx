import type { FunctionComponent } from "react";
import { DefaultInput } from "../../../shared";
import { loginSchema } from "../../../shared/validation/loginSchema";
import s from "./LoginInputs.module.scss";

interface LoginInputsProps {
    isMobile?: boolean;
}

export const LoginInputs: FunctionComponent<LoginInputsProps> = ({
    isMobile,
}) => {
    return (
        <div className={`${s.inputs} ${isMobile ? s.inputsMobile : ""}`}>
            <DefaultInput
                name="username"
                type="text"
                validate={(value) => {
                    const result = loginSchema.shape.login.safeParse(value);

                    if (!result.success) {
                        return result.error.issues[0]?.message;
                    }

                    return null;
                }}
                label="Имя пользователя"
                placeholder="Admin"
                isMobile={isMobile}
            />
            <DefaultInput
                name="password"
                type="password"
                validate={(value) => {
                    const result = loginSchema.shape.password.safeParse(value);

                    if (!result.success) {
                        return result.error.issues[0]?.message;
                    }

                    return null;
                }}
                label="Пароль"
                placeholder="Введите пароль"
                isMobile={isMobile}
            />
        </div>
    );
};
