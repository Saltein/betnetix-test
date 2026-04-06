import { useMemo } from "react";
import type { FunctionComponent } from "react";
import s from "./BirthDateCell.module.scss";

interface BirthDateCellProps {
    date: string;
}

export const BirthDateCell: FunctionComponent<BirthDateCellProps> = ({
    date,
}) => {
    const [year, month, day] = date.split("-");
    const formattedDate = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;

    const age = useMemo(() => {
        const [year, month, day] = date.split("-").map(Number);
        const today = new Date();
        const birth = new Date(year, month - 1, day);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        const getAgeText = (age: number): string => {
            if (age % 10 === 1 && age % 100 !== 11) return `${age} год`;
            if (
                [2, 3, 4].includes(age % 10) &&
                ![12, 13, 14].includes(age % 100)
            )
                return `${age} года`;
            return `${age} лет`;
        };

        return getAgeText(age);
    }, [date]);

    return (
        <div className={s.wrapper}>
            <span className={s.date}>{formattedDate}</span>
            <span className={s.age}>({age})</span>
        </div>
    );
};
