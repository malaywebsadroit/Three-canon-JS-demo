import { useState, useEffect } from 'react';

export function useKeyboardControls() {
    const [keys, setKeys] = useState({});

    useEffect(() => {
        const downHandler = (e) => setKeys((state) => ({ ...state, [e.code]: true }));
        const upHandler = (e) => setKeys((state) => ({ ...state, [e.code]: false }));

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return keys;
}
