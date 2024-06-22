import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

export default function useRouteProtection() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!(!!JSON.parse(localStorage.getItem('userData')).token)) {
            navigate('/login');
        }
    }, []);
}