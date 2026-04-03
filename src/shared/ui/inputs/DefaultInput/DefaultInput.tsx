import type { FunctionComponent } from "react";
import { TextField, Input, Label, FieldError } from "@heroui/react";
import s from "../Input.module.scss";

interface DefaultInputProps {
    name: string;
    type: "email" | "text" | "search" | "url" | "tel" | "password";
    validate?: (value: string) => string | null;
    label: string;
    placeholder: string;
    isMobile?: boolean;
}

export const DefaultInput: FunctionComponent<DefaultInputProps> = ({
    name,
    type,
    validate,
    label,
    placeholder,
    isMobile,
}) => {
    return (
        <TextField
            name={name}
            type={type}
            validate={validate ? validate : undefined}
            className={s.textField}
        >
            <Label className={`${s.label}`}>
                {label}
            </Label>
            <Input
                className={`${s.input} ${isMobile ? s.inputMobile : ""}`}
                placeholder={placeholder}
            />
            <FieldError className={s.error} />
        </TextField>
    );
};
