import type { FunctionComponent } from "react";
import s from "./Pagination.module.scss";
import ChevronLeft from "../../../assets/icons/leftChevron.svg?react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: FunctionComponent<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPages = () => {
        if (totalPages <= 3) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages)
            return [totalPages - 2, totalPages - 1, totalPages];

        return [currentPage - 1, currentPage, currentPage + 1];
    };

    const pagesArray = getPages();

    return (
        <div className={s.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={s.paginationButton}
            >
                <ChevronLeft className={s.paginationIcon} />
            </button>

            {pagesArray.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${s.paginationButton} ${
                        currentPage === page ? s.active : ""
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={s.paginationButton}
            >
                <ChevronLeft
                    className={s.paginationIcon}
                    style={{ transform: "rotate(0.5turn)" }}
                />
            </button>
        </div>
    );
};

export default Pagination;
