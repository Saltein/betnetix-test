import type { FunctionComponent } from "react";
import s from "./EditUserForm.module.scss";
import AvatarIcon from "../../../shared/assets/icons/avatar120.svg?react";
import { DefaultInput } from "../../../shared";
import { Button } from "@heroui/react";

interface EditUserFormProps {}

export const EditUserForm: FunctionComponent<EditUserFormProps> = () => {
    return (
        <div className={s.editFormWrapper}>
            <div className={s.avatarWrapper}>
                <AvatarIcon />
            </div>

            <DefaultInput
                name="name"
                type="text"
                label="ФИО"
                placeholder="Иванов Иван Иванович"
            />

            <DefaultInput
                name="email"
                type="email"
                label="Email"
                placeholder="ivan@example.com"
            />

            <DefaultInput
                name="birthDate"
                type="date"
                label="Дата рождения"
                placeholder="01.01.2000"
            />

            <Button className={s.button}>Сохранить</Button>
        </div>
    );
};
