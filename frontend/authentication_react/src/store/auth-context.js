import React , {useCallback, useEffect, useState } from "react";

let logoutTimer;
const AuthContext = React.createContext({
    token :'',
    isLoggedIn: false,
    login:(token)=>{

    },
    logout:()=>{

    }
});

const calculateRemainingTime = (expirationTime)=>{
    const currentTime  = new Date().getTime();
    const adjExpirationTime  = new Date(expirationTime).getTime();
    const remaintingDuration = adjExpirationTime - currentTime;

    return remaintingDuration;
};

const retriveStoredToken = ()=>{
    const storedToken  = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');
    const remaintingTime = calculateRemainingTime(storedExpirationDate);
    if(remaintingTime <= 3600){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }
    return{
        token: storedToken,
        duration: remaintingTime
    }
};

export const AuthContextProvider = (props)=>{
    const tokenData = retriveStoredToken();
    let initialToken;
    if(tokenData){
        initialToken = tokenData.token;
    }
    const [token , setToken] = useState(initialToken);
    const userIsLoggedIn = !!token;

    
    
    const logoutHandler= useCallback(()=>{
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        if(logoutTimer){
            clearTimeout(logoutTimer);
        }
    },[]);

    const loginHandler = (token, expirationTime)=>{
        setToken(token);
        localStorage.setItem('token',token);
        localStorage.setItem('expirationTime',expirationTime);
        const remaintingTime =  calculateRemainingTime(expirationTime);

        logoutTimer= setTimeout(logoutHandler, remaintingTime);
        //logoutTimer =  setTimeout(logoutHandler, 3000);
    };

    useEffect(()=>{
        if(tokenData){
            console.log(tokenData.duration);
            logoutTimer =  setTimeout(logoutHandler, tokenData.duration);
        }

    },[tokenData,logoutHandler]);
    const contextValue = {
        token:token,
        isLoggedIn:userIsLoggedIn,
        login:loginHandler,
        logout :logoutHandler
    };
    return <AuthContext.Provider value={contextValue}>
    {props.children}
    </AuthContext.Provider>;
}

export default AuthContext;
