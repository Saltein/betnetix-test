import type { FunctionComponent } from "react";
import { TextField, Input, Label, FieldError, DateField } from "@heroui/react";
import s from "../Input.module.scss";

interface DefaultInputProps {
    name: string;
    type: "email" | "text" | "search" | "url" | "tel" | "password" | "date";
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
    if (type === "date")
        return (
            <DateField name={name} className={s.textField}>
                <Label className={`${s.label}`}>{label}</Label>
                <DateField.Input
                    className={`${s.input} ${isMobile ? s.inputMobile : ""}`}
                >
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
            </DateField>
        );
    return (
        <TextField
            name={name}
            type={type}
            validate={validate ? validate : undefined}
            className={s.textField}
        >
            <Label className={`${s.label}`}>{label}</Label>
            <Input
                className={`${s.input} ${isMobile ? s.inputMobile : ""}`}
                placeholder={placeholder}
            />
            <FieldError className={s.error} />
        </TextField>
    );
};
