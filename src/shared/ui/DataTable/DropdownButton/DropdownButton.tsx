import { Button, Dropdown } from "@heroui/react";
import type { FunctionComponent } from "react";
import s from "./DropdownButton.module.scss";
import OptionIcon from "../../../assets/icons/options.svg?react";
import PencilIcon from "../../../assets/icons/pencil.svg?react";
import TrashIcon from "../../../assets/icons/trash.svg?react";

interface DropdownButtonProps {
    onDelete: () => void;
}

const DropdownButton: FunctionComponent<DropdownButtonProps> = ({
    onDelete,
}) => {
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
                    <Dropdown.Item id="edit" className={s.dropDownItem}>
                        <PencilIcon className={s.dropDownIcon} />
                        <span>Редактировать</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                        id="delete"
                        className={`${s.dropDownItem} ${s.delete}`}
                        onClick={() => onDelete()}
                    >
                        <TrashIcon className={`${s.dropDownIcon}`} />
                        <span>Удалить</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
};

export default DropdownButton;
