import { Input, TextField } from "@heroui/react";
import type { FunctionComponent } from "react";
import s from "../Input.module.scss";
import si from "./SearchInput.module.scss";
import SearchIcon from "../../../assets/icons/search.svg?react";

interface SearchInputProps {
    isMobile: boolean;
    placeholder: string;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export const SearchInput: FunctionComponent<SearchInputProps> = ({
    isMobile,
    placeholder,
    searchQuery,
    setSearchQuery,
}) => {
    return (
        <TextField
            name={"search query"}
            className={s.textField}
            aria-label="search"
        >
            <SearchIcon className={si.icon} />
            <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${si.input} ${s.input} ${isMobile ? s.inputMobile : ""}`}
                placeholder={placeholder}
            ></Input>
        </TextField>
    );
};
