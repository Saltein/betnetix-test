import { useEffect, useState, type FunctionComponent } from "react";
import s from "./LoginPage.module.scss";
import BTXIcon from "../../shared/assets/icons/BTX.svg?react";
import { Button, Form } from "@heroui/react";
import { useMediaQuery } from "react-responsive";
import { BodyMobile, Header } from "../../widgets";
import { LoginInputs } from "./LoginInputs/LoginInputs";
import { useLoginMutation } from "../../app/api/authSliceApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {}

export const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const [login, { data, error, isLoading, isError }] = useLoginMutation();

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        login({ username, password });
    };

    useEffect(() => {
        if (data) {
            Cookies.set("refreshToken", data.refreshToken);
            Cookies.set("accessToken", data.accessToken);
            navigate("/posts");
        }
        if (error) {
            console.error("error", error);
        }
    }, [data, error]);

    if (isMobile) {
        return (
            <Form className={s.wrapperMobile} onSubmit={handleSubmit}>
                <Header />
                <BodyMobile>
                    <div className={`${s.titles} ${s.titlesMobile}`}>
                        <h2>Панель администратора</h2>
                        <h3>Войдите в систему для продолжения</h3>
                    </div>
                    <LoginInputs isMobile={isMobile} />
                    {isError && <span className={s.error}>Ошибка входа</span>}
                    <Button
                        type="submit"
                        className={`${s.button} ${s.buttonMobile}`}
                        isDisabled={isLoading}
                    >
                        Войти
                    </Button>
                </BodyMobile>
            </Form>
        );
    }

    return (
        <div className={s.wrapper}>
            <Form className={s.form} onSubmit={handleSubmit}>
                <BTXIcon className={s.icon} />
                <div className={s.titles}>
                    <h2>Панель администратора</h2>
                    <h3>Войдите в систему для продолжения</h3>
                </div>
                <LoginInputs isMobile={isMobile} />
                {isError && <span className={s.error}>Ошибка входа</span>}
                <Button
                    type="submit"
                    className={s.button}
                    isDisabled={isLoading}
                >
                    Войти
                </Button>
            </Form>
        </div>
    );
};
