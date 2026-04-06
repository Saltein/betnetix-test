import { useEffect, useState } from "react";
import type { SortDirection } from "../types";

export const useSearchQueryPageLimitAndSort = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(7);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: SortDirection;
    } | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    return { searchQuery, setSearchQuery, debouncedSearch, page, setPage, limit, setLimit, sortConfig, setSortConfig };
};
