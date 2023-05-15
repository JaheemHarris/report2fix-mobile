import './style.css';
import { useHistory } from 'react-router';

const Signup:React.FC = () => {

    const history = useHistory();

    const login = () =>{
        history.push('/login');
    }

    const confirmPassword = () => {

    }

    const sign = () => {

    }

    return (
        <div>
            <div className='head'>
                <h1 className='title'>Report2Fix</h1>
                <button className='blue-button' type='button'onClick={login}>Connexion</button>
            </div>
            <div className='body'>
                <div className='body-head'>
                    <h2 className='body-title'>Inscription</h2>
                </div>
                <div className='body-form'>
                    <div className='multi-form-input'>
                        <div className='multi-input-group'>
                            <label className='input-label'>Nom *</label>
                            <input className='input-field' type='text' name='firstname'  id='firstname'/>
                        </div>
                        <div className='multi-input-group'>
                            <label className='input-label'>Prénom *</label>
                            <input className='input-field' type='text' name='lastname'  id='lastname'/>
                        </div>
                        <div className='multi-input-group'>
                            <label className='input-label'>Adresse email *</label>
                            <input className='input-field' type='email' name='email'  id='email'/>
                        </div>
                        <div className='multi-input-group'>
                            <label className='input-label'>Mot de passe *</label>
                            <input className='input-field' type='password' name='password' id='password'/>
                        </div>
                        <div className='multi-input-group'>
                            <label className='input-label'>Confirmer le mot de passe *</label>
                            <input className='input-field' type='password' name='password-confirmation' id='password-confirmation'/>
                        </div>
                    </div>
                    <button className='blue-button' type='button' onClick={sign}>S'inscrire</button>
                </div>
                <div className='body-foot'>
                    <p>Vous avez déja un compte ?</p>
                    <p><span className='body-foot-link' onClick={login}>Connectez-vous en cliquant ici!</span></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;