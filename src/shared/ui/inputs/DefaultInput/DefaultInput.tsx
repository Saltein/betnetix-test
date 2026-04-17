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

    value?: string;
    onChange?: (value: string) => void;
}

export const DefaultInput: FunctionComponent<DefaultInputProps> = ({
    name,
    type,
    validate,
    label,
    placeholder,
    isMobile,
    value,
    onChange,
}) => {
    if (type === "date")
        return (
            <DateField
                name={name}
                className={s.textField}
                onChange={(date) => {
                    if (!onChange) return;

                    const formatted = date
                        ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
                        : "";

                    onChange(formatted);
                }}
            >
                <Label className={s.label}>{label}</Label>

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
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={`${s.input} ${isMobile ? s.inputMobile : ""}`}
                placeholder={placeholder}
            />
            <FieldError className={s.error} />
        </TextField>
    );
};
