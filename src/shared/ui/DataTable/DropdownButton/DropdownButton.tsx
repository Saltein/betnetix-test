import { Button, Dropdown } from "@heroui/react";
import { useEffect, useState, type FunctionComponent } from "react";
import s from "./DropdownButton.module.scss";
import OptionIcon from "../../../assets/icons/options.svg?react";
import PencilIcon from "../../../assets/icons/pencil.svg?react";
import TrashIcon from "../../../assets/icons/trash.svg?react";
import { useDeleteUserMutation } from "../../../../app/api/users/usersSliceApi";
import { DefaultModal } from "../../DefaultModal/DefaultModal";
import { EditUserForm } from "../../../../features";
import { useMediaQuery } from "react-responsive";

interface DropdownButtonProps {
    userId: number;
}

const DropdownButton: FunctionComponent<DropdownButtonProps> = ({ userId }) => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [
        deleteUser,
        { data: deletedUser, isSuccess: isDeleted, error: deleteError },
    ] = useDeleteUserMutation();

    const handleDeleteUser = (id: number) => {
        console.log(`delete user ${id}`);
        deleteUser(id);
    };

    const handleEditUser = (id: number) => {
        console.log(`edit user ${id}`);
        setTimeout(() => setIsEditOpen(true), 200);
    };

    useEffect(() => {
        if (isDeleted) {
            console.log("user deleted");
        }

        if (deleteError) {
            console.log("error deleting user");
        }
    }, [isDeleted, deleteError]);

    useEffect(() => {
        if (deletedUser) {
            console.log("user deleted");
        }
    }, [deletedUser]);

    return (
        <Dropdown>
            <Button className={s.button}>
                <OptionIcon className={s.icon} />
            </Button>
            <Dropdown.Popover
                placement="bottom right"
                className={s.dropDownPopover}
            >
                <Dropdown.Menu>
                    <Dropdown.Item
                        id="edit"
                        className={s.dropDownItem}
                        onClick={() => handleEditUser(userId)}
                    >
                        <PencilIcon className={s.dropDownIcon} />
                        <span>Редактировать</span>
                    </Dropdown.Item>

                    <Dropdown.Item
                        id="delete"
                        className={`${s.dropDownItem} ${s.delete}`}
                        onClick={() => handleDeleteUser(userId)}
                    >
                        <TrashIcon className={`${s.dropDownIcon}`} />
                        <span>Удалить</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>

            <DefaultModal
                actionButtonLabel="Редактировать"
                ActionButtonIcon={
                    <PencilIcon
                        style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "4px",
                        }}
                    />
                }
                modalTitle="Редактирование профиля"
                actionButtonVariant="shapeless"
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                triggerButton={false}
                modalChildren={<EditUserForm type="edit" userId={userId} />}
                isMobile={isMobile}
            />
        </Dropdown>
    );
};

export default DropdownButton;
