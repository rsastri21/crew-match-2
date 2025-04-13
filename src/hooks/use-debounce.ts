import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (JSON.stringify(value) !== JSON.stringify(debouncedValue)) {
                setDebouncedValue(value);
            }
        }, delay);

        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debouncedValue;
}
