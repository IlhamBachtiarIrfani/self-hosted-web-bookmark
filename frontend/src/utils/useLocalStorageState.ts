import { useState, useEffect } from "react";

function useLocalStorageState<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [state, setState] = useState<T>(() => {
        const storedValue = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
        return storedValue !== null ? JSON.parse(storedValue) : initialValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

export default useLocalStorageState;