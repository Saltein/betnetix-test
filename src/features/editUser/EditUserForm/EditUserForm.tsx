import { useEffect, useState, type FunctionComponent } from "react";
import s from "./EditUserForm.module.scss";
import AvatarIcon from "../../../shared/assets/icons/avatar120.svg?react";
import { DefaultInput } from "../../../shared";
import { Button } from "@heroui/react";
import {
    useAddUserMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation,
} from "../../../app/api/users/usersSliceApi";

interface EditUserFormProps {
    type: "add" | "edit";
    userId?: number;
}

interface FormData {
    name: string;
    email: string;
    birthDate: string;
}

export const EditUserForm: FunctionComponent<EditUserFormProps> = ({
    type,
    userId,
}) => {
    const { data: userData } = useGetUserByIdQuery(userId ? userId : 0);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        birthDate: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const validateDate = (dateStr: string) => {
        const inputDate = new Date(dateStr);
        const now = new Date();

        return inputDate > now;
    };

    const [addUser] = useAddUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const handleSubmit = async () => {
        setError(null);

        if (!formData.name || !formData.email || !formData.birthDate) {
            setError("Заполните все поля");
            return;
        }

        if (
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                formData.email,
            )
        ) {
            setError("Некорректный email");
            return;
        }

        if (validateDate(formData.birthDate)) {
            setError("Некорректная дата рождения");
            return;
        }

        const nameParts = formData.name.trim().split(/\s+/);

        let action;
        if (type === "add") {
            action = addUser;
        } else {
            action = updateUser;
        }

        try {
            const result = await action({
                firstName: nameParts[0] || "",
                lastName: nameParts[1] || "",
                maidenName: nameParts[2] || "",
                email: formData.email,
                birthDate: formData.birthDate,
                id: userId || 0,
            }).unwrap();

            console.log(
                type === "add"
                    ? "Пользователь добавлен"
                    : "Пользователь обновлен:",
                result,
            );
            setSuccess(true);

            if (type === "add") {
                setFormData({
                    name: "",
                    email: "",
                    birthDate: "",
                });
            }
        } catch (e) {
            setError("Ошибка при добавлении пользователя");
            console.error(e);
        }
    };

    useEffect(() => {
        if (userData) {
            setFormData({
                name: `${userData.firstName} ${userData.lastName} ${userData.maidenName}`.trim(),
                email: userData.email,
                birthDate: userData.birthDate || "",
            });
        }
    }, [userData]);

    return (
        <div className={s.editFormWrapper}>
            <div className={s.avatarWrapper}>
                {type === "add" ? (
                    <AvatarIcon />
                ) : (
                    <img src={userData?.image} className={s.avatar} />
                )}
            </div>

            <DefaultInput
                name="name"
                type="text"
                label="ФИО"
                placeholder="Иванов Иван Иванович"
                value={formData?.name}
                onChange={(value: string) => {
                    setError(null);
                    setSuccess(false);
                    setFormData({ ...formData, name: value });
                }}
            />

            <DefaultInput
                name="email"
                type="email"
                label="Email"
                placeholder="ivan@example.com"
                value={formData?.email}
                onChange={(value: string) => {
                    setError(null);
                    setSuccess(false);
                    setFormData({ ...formData, email: value });
                }}
            />

            <DefaultInput
                name="birthDate"
                type="date"
                label="Дата рождения"
                placeholder="01.01.2000"
                value={formData?.birthDate}
                onChange={(value: string) => {
                    setError(null);
                    setSuccess(false);
                    setFormData({ ...formData, birthDate: value });
                }}
            />

            {error && (
                <span style={{ fontSize: "16px", color: "red" }}>{error}</span>
            )}
            {success && (
                <span style={{ fontSize: "16px", color: "limegreen" }}>
                    {type === "add"
                        ? "Пользователь успешно добавлен"
                        : "Пользователь успешно обновлен"}
                </span>
            )}

            <Button className={s.button} onClick={handleSubmit}>
                {type === "add" ? "Сохранить" : "Сохранить изменения"}
            </Button>
        </div>
    );
};
