import { Button, Modal } from "@heroui/react";
import type { FunctionComponent, ReactNode } from "react";
import { useState } from "react";
import s from "./DefaultModal.module.scss";
import CloseIcon from "../../assets/icons/closeIcon.svg?react";

interface DefaultModalProps {
    actionButtonLabel?: string;
    actionButtonProps?: React.ComponentProps<typeof Button>;
    ActionButtonIcon?: ReactNode;
    actionButtonVariant?: "default" | "shapeless";
    modalTitle?: ReactNode;
    modalChildren?: ReactNode;
    isMobile?: boolean;

    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;

    triggerButton: boolean;
}

export const DefaultModal: FunctionComponent<DefaultModalProps> = ({
    actionButtonLabel,
    actionButtonProps,
    ActionButtonIcon,
    actionButtonVariant,
    modalTitle,
    modalChildren,
    isMobile,
    isOpen,
    onOpenChange,
    triggerButton,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = isOpen ?? internalOpen;

    const setOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        } else {
            setInternalOpen(value);
        }
    };

    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            {triggerButton && (
                <Button
                    {...actionButtonProps}
                    onPress={() => setOpen(true)}
                    className={[
                        s.actionButton,
                        isMobile ? s.mobile : "",
                        actionButtonVariant === "shapeless" ? s.shapeless : "",
                    ].join(" ")}
                >
                    {ActionButtonIcon && ActionButtonIcon}
                    {actionButtonLabel}
                </Button>
            )}

            <Modal.Backdrop className={s.backdropModal}>
                <Modal.Container className={s.containerModal}>
                    <Modal.Dialog className={s.dialogModal}>
                        <button
                            className={s.customClose}
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon />
                        </button>

                        <Modal.Header className={s.headerModal}>
                            {modalTitle}
                        </Modal.Header>

                        <Modal.Body>{modalChildren}</Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
};
