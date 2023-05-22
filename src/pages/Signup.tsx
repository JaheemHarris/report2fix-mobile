import { useState } from 'react';
import './style.css';
import { useHistory } from 'react-router';
import SignupSucess from '../components/SignupSuccess';
import axios from 'axios';
import { IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useForm } from 'react-hook-form';

const Signup: React.FC = () => {
    const baseUrl = process.env.REACT_APP_API_URL;
    const { register, handleSubmit, getValues, formState: { errors, isValid }, watch}= useForm();

    const [succeed, setSucceed] = useState(false);
    const [generalError, setGeneralError] = useState<any>(null);
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [visibilityPasswordIcon, setVisibilityPasswordIcon] = useState(eyeOffOutline);
    const [visibilityPwdConfirmationIcon, setVisibilityPwdConfirmationIcon] = useState(eyeOffOutline);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [pwdConfirmationVisibility, setPwdConfirmationVisibility] = useState(false);
    const [passwordFieldType, setPasswordFieldType] = useState('password');
    const [pwdConfirmationFieldType, setPwdConfirmationFieldType] = useState('password');

    const passwordEntered = watch('password');
    
    const history = useHistory();

    const login = () => {
        history.push('/login');
    }

    const changePwdVisibility = (type:string, icon:any) => {
        setVisibilityPasswordIcon(icon);
        setPasswordFieldType(type);
    };

    const changePwdConfirmationVisibility = (type:string, icon:any) => {
        setVisibilityPwdConfirmationIcon(icon);
        setPwdConfirmationFieldType(type);
    };

    const togglePasswordVisibility  = () => {
        setPasswordVisibility(!passwordVisibility);
        passwordVisibility ? changePwdVisibility('text', eyeOutline) : changePwdVisibility('password', eyeOffOutline);
    }

    const togglePwdConfirmationVisibility  = () => {
        setPwdConfirmationVisibility(!pwdConfirmationVisibility);
        pwdConfirmationVisibility ? changePwdConfirmationVisibility('text', eyeOutline) : changePwdConfirmationVisibility('password', eyeOffOutline);
    }

    const sign = () => {
        if(isValid){
            const {firstname, lastname, email, password} = getValues();
            console.log({firstname, lastname, email, password});
            const formData = new FormData();
            formData.append('nom', lastname);
            formData.append('prenom', firstname);
            formData.append('email', email);
            formData.append('motDePasse', password);

            // const data = {
            //     nom: lastname,
            //     prenom: firstname,
            //     email: email,
            //     motDePasse: password
            // }

            axios.post(`${baseUrl}/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then((response) => {
                    if(response.status === 201){
                        setSucceed(true);
                    }
                    console.log(response);
                })
                .catch((error) => {
                    if(error.response.status === 406){
                        setGeneralError("Cette adresse email est déja liée à un compte Report2Fix!");
                    }
                    console.log(error);
                });
        }
    }

    return (
        <>
            {!succeed ?
                (
                    <div>
                        <div className='head'>
                            <h1 className='title'>Report2Fix</h1>
                            <button className='blue-button' type='button' onClick={login}>Connexion</button>
                        </div>
                        <div className='body'>
                            <div className='body-head'>
                                <h2 className='body-title'>Inscription</h2>
                            </div>
                            { generalError && (<div className='signup-error'>{generalError}</div>) }
                            <form className='body-form' onSubmit={handleSubmit(sign)}>
                                <div className='multi-form-input'>
                                    <div className='multi-input-group'>
                                        <label className='input-label'>Prénom *</label>
                                        <input className='input-field' type='text' {...register('firstname', {
                                            required: {
                                                value: true,
                                                message: "Veuillez entrer votre prénom!"
                                            }
                                        })} />
                                        {errors.firstname && <span className='input-errors'>{ errors.firstname?.message as string }</span>}
                                    </div>
                                    <div className='multi-input-group'>
                                        <label className='input-label'>Nom *</label>
                                        <input className='input-field' type='text' {...register('lastname', {
                                            required: {
                                                value: true, 
                                                message:"Veuillez entrer votre nom!"
                                            }
                                        })} />
                                        {errors.lastname && <span className='input-errors'>{ errors.lastname?.message as string }</span>}
                                    </div>
                                    <div className='multi-input-group'>
                                        <label className='input-label'>Adresse email *</label>
                                        <input className='input-field' type='email' {...register('email', {
                                            required: {
                                                value: true,
                                                message: "Veuillez entrer une adresse email!"
                                            },
                                            pattern: {
                                                value: emailRegex,
                                                message: "Adresse email non valide!"
                                            }
                                        })}/>
                                        { errors.email && <span className='input-errors'>{errors.email?.message as string}</span>}
                                    </div>
                                    <div className='multi-input-group'>
                                        <label className='input-label'>Mot de passe *</label>
                                        <div className='input-pwd'>
                                            <input className='input-field' type={passwordFieldType} {...register('password', {
                                                required: {
                                                    value: true,
                                                    message:"Veuillez entrer votre mot de passe!"
                                                },
                                                minLength: {
                                                    value: 8,
                                                    message: "Doit contenir au moins 8 caractères!"
                                                }
                                            })}/>
                                            <IonIcon className='eye-icon' onClick={togglePasswordVisibility} icon={visibilityPasswordIcon}></IonIcon>
                                        </div>
                                        { errors.password && <span className='input-errors'>{errors.password?.message as string}</span>}
                                    </div>
                                    <div className='multi-input-group'>
                                        <label className='input-label'>Confirmer le mot de passe *</label>
                                        <div className='input-pwd'>
                                            <input className='input-field' type={pwdConfirmationFieldType} {...register('passwordConfirmation', {
                                                validate: (value) =>
                                                value === passwordEntered || 'Ne correspond pas au mot de passe!',
                                            })} />
                                            <IonIcon className='eye-icon' onClick={togglePwdConfirmationVisibility} icon={visibilityPwdConfirmationIcon}></IonIcon>
                                        </div>
                                        { errors.passwordConfirmation && <span className='input-errors'>{ errors.passwordConfirmation?.message as string }</span>}
                                    </div>
                                </div>
                                <button className='blue-button' type='submit'>S'inscrire</button>
                            </form>
                            <div className='body-foot'>
                                <p>Vous avez déja un compte ?</p>
                                <p><span className='body-foot-link' onClick={login}>Connectez-vous en cliquant ici!</span></p>
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <SignupSucess />
                )
            }
        </>
    );
}

export default Signup;