import { useState, useEffect } from 'react';

const useTokenStorage = () => {
    const [token, setToken] = useState(() => {
        const token = localStorage.getItem('token');
        return token !== null ? token : null
    });

    useEffect(() => {
        if (token === null) {
            localStorage.removeItem('token')
        }
    }, [token]);
    return [token, setToken];
};

export default useTokenStorage;