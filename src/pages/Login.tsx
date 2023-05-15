import './style.css';
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import auth from '../services/authService';

const Login : React.FC = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const history = useHistory();
    const [error, setError] = useState(false);
    const showPwdRef = useRef<HTMLInputElement>(null);
    const [pwdInputType, setPwdInputType] = useState('password');

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    localStorage.removeItem('access-token');

    useEffect(() => {
        console.log(error);
    }, [error]);

    const signup = () =>{
        history.push('/signup');
    }

    const show = () => {
        showPwdRef.current?.checked ? setPwdInputType('text') : setPwdInputType('password');
    }

    const log = async (event: any) => {
        event.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if(!email && !password){
            return;
        }
        if(!checkEmail(email)){
            emailRef.current?.setCustomValidity("Entrez une adresse email valide!");
            return;
        }
        const token = await auth(email, password);
        if(token){
            localStorage.setItem('token', token);
            history.push('/home');
        } else {
            if(passwordRef.current?.value){
                passwordRef.current.value = '';
            }
            setError(true);
        }
    }

    const checkEmail = (email : any) => {
        return emailRegex.test(email);
    }

    return (
        <div>
            <div className='head'>
                <h1 className='title'>Report2Fix</h1>
                <button className='blue-button' type='button' onClick={signup}>Inscription</button>
            </div>
            <div className='body'>
                <div className='body-head'>
                    <h2 className='body-title'>Connexion</h2>
                </div>
                { error &&
                    (
                        <div className='body-error'>
                            Email ou Mot de passe incorrecte!
                        </div>
                    )
                }
                <form className='body-form' onSubmit={log}>
                    <div className='body-form-input-group'>
                        <label className='input-label'>Adresse email *</label>
                        <input className='input-field' type='email' name='email' id='email' ref={emailRef} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required/>
                    </div>
                    <div className='body-form-input-group'>
                        <label className='input-label'>Mot de passe *</label>
                        <input className='input-field' type={pwdInputType} name='password' id='password' ref={passwordRef} required/>
                    </div>
                    <div className='body-form-input-checkbox'>
                        <input type='checkbox' name='show-password' id='show-password' ref={showPwdRef} onChange={show}/>&nbsp; Afficher le mot de passe
                    </div>
                    <button className='blue-button' type='submit'>Se connecter</button>
                </form>
                <div className='body-foot'>
                    <p>Vous n'avez pas encore de compte ?</p>
                    <p><span className='body-foot-link' onClick={signup}>Inscrivez-vous en cliquant ici!</span></p>
                </div>
            </div>
        </div>
    );
}

export default Login;