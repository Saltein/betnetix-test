import type { FunctionComponent } from "react";
import s from "./LoginPage.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";
import { Button, Form } from "@heroui/react";
import { useMediaQuery } from "react-responsive";
import { BodyMobile, Header } from "../../widgets";
import { LoginInputs } from "./LoginInputs/LoginInputs";

interface LoginPageProps {}

export const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    if (isMobile) {
        return (
            <Form className={s.wrapperMobile}>
                <Header />
                <BodyMobile>
                    <div className={`${s.titles} ${s.titlesMobile}`}>
                        <h2>Панель администратора</h2>
                        <h3>Войдите в систему для продолжения</h3>
                    </div>
                    <LoginInputs isMobile={isMobile} />
                    <Button className={`${s.button} ${s.buttonMobile}`}>
                        Войти
                    </Button>
                </BodyMobile>
            </Form>
        );
    }

    return (
        <div className={s.wrapper}>
            <Form className={s.form}>
                <BTXIcon className={s.icon} />
                <div className={s.titles}>
                    <h2>Панель администратора</h2>
                    <h3>Войдите в систему для продолжения</h3>
                </div>
                <LoginInputs isMobile={isMobile} />
                <Button className={s.button}>Войти</Button>
            </Form>
        </div>
    );
};
