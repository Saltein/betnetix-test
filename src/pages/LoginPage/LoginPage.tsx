import { type FunctionComponent } from "react";
import s from "./LoginPage.module.scss";
import { LoginForm } from "../../processes/login/ui/LoginForm/LoginForm";
import { useMediaQuery } from "react-responsive";

interface LoginPageProps {}

export const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    if (isMobile) return <LoginForm isMobile />;
    return (
        <div className={s.wrapper}>
            <LoginForm />
        </div>
    );
};
