import { useState, useEffect } from 'react';

const port = 3001;

const useApiBaseUrl = (): string | null => {
    const [baseUrl, setBaseUrl] = useState<string | null>(null);

    useEffect(() => {
        const getBaseUrl = async () => {
            const protocol = window.location.protocol;
            const host = window.location.hostname;
            const baseUrl = `${protocol}//${host}:${port}/`;

            setBaseUrl(baseUrl);
        };

        getBaseUrl();
    }, []);

    return baseUrl;
};

export default useApiBaseUrl;