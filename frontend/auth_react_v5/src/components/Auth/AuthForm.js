import { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';
import {URL} from '../Config';


const AuthForm = () => {
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading]= useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const authContext = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event)=>{
    event.preventDefault();
    const enterEmail = emailRef.current.value;
    const enterPassword = passwordRef.current.value;
    setIsLoading(true);
    let url;
    if(isLogin){
      url = URL+'user/login';
    }else{
      url = URL+'user/register';
    }
    /*
    if(isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAODr6zeQXUrGg_eulDyvcwytmVFeHFsYE'
    }else{
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAODr6zeQXUrGg_eulDyvcwytmVFeHFsYE';
    }*/

        fetch(url,{
        method:'POST',
        body:JSON.stringify({
          email:enterEmail,
          password: enterPassword,
          returnSecureToken:true
        }),
        headers:{
          'Content-type':'application/json'
        }
      }).then(res=>{
        setIsLoading(false);
        if(res.ok){
          //console.log(res.json());
          return res.json();
        }else{
          return res.json().then((data)=>{
            //console.log(data);
            let errorMessage = 'Authentication Failed';
            throw new Error(errorMessage);
          });
        }

        }).then((data)=>{
          //console.log(data);
          const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)));
          authContext.login(data.idToken, expirationTime);
          history.replace('/');

        }).catch((err)=>{
          alert(err.message);
        });
      
    
    
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
