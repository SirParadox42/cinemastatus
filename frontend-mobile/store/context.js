import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const context = createContext({isLoggedIn: false, token: null, userId: null, image: null, login() {}, logout() {}});

export function ContextProvider({children}) {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [image, setImage] = useState(null);

    const login = (token, userId, image) => {
        setToken(token);
        setUserId(userId);
        setImage(image);
        AsyncStorage.setItem('cinemaStatusUserData', JSON.stringify({token, userId, image}));
    };
    const logout = () => {
        setToken(null);
        setUserId(null);
        setImage(null);
        AsyncStorage.removeItem('cinemaStatusUserData');
    };

    useEffect(() => {
        const getStoredData = async() => {
            const storedData = await AsyncStorage.getItem('cinemaStatusUserData');

            if (storedData) {
                const parsedData = JSON.parse(storedData);
                login(parsedData.token, parsedData.userId, parsedData.image);
            }
        };

        getStoredData();
    }, []);
    
    return (
        <context.Provider value={{isLoggedIn: !!token, token, userId, image, login, logout}}>
            {children}
        </context.Provider>
    );
}