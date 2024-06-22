import {createContext, useState, useEffect} from 'react';

export const context = createContext({isLoggedIn: false, token: null, userId: null, image: null, login() {}, logout() {}});

let logoutTimer;

export function ContextProvider(props) {
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [image, setImage] = useState(null);
  
    const login = (token, uid, image, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setImage(image)
        const expiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 20).toISOString();
        setTokenExpirationDate(expiration);
        localStorage.setItem('userData', JSON.stringify({token, userId: uid, image, expiration}));
    };
    const logout = () => {
        setUserId(null);
        setToken(null);
        setImage(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    };
  
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && new Date(storedData.expiration) > new Date()) {
            login(storedData.token, storedData.userId, storedData.image, storedData.expiration);
            setComponentLoaded(true);
        }
    }, []);
    useEffect(() => {
        if (componentLoaded) {
            if (token && tokenExpirationDate) {
                const remainingTime = new Date(tokenExpirationDate) - new Date();
                logoutTimer = setTimeout(logout, remainingTime);
            } else {
                clearTimeout(logoutTimer);
            }
        }
    }, [token, tokenExpirationDate, componentLoaded]);
  
    return (
      <context.Provider value={{isLoggedIn: !!token, token, userId, image, login, logout}}>
        {props.children}
      </context.Provider>
    );
  }