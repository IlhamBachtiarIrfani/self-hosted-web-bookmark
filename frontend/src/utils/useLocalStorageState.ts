import { useState, useEffect } from "react";

function useLocalStorageState<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [state, setState] = useState<T>(() => {
        const storedValue = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
        return storedValue !== null ? JSON.parse(storedValue) : initialValue;
    });

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                setState(JSON.parse(event.newValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [key]);

    const setLocalStorageState = (value: T) => {
        setState(value);
        window.localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(value),
            oldValue: JSON.stringify(state),
            storageArea: window.localStorage,
        }));
    };

    return [state, setLocalStorageState];
}

export default useLocalStorageState;
