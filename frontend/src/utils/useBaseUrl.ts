import { useState, useEffect } from 'react';

const useBaseUrl = (): string | null => {
    const [baseUrl, setBaseUrl] = useState<string | null>(null);

    useEffect(() => {
        const getBaseUrl = async () => {
            const protocol = window.location.protocol;
            const host = window.location.hostname;
            const baseUrl = `${protocol}//${host}`;

            setBaseUrl(baseUrl);
        };

        getBaseUrl();
    }, []);

    return baseUrl;
};

export default useBaseUrl;
