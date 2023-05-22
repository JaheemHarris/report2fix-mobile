import { IonButton, IonIcon } from "@ionic/react";
import { useHistory } from "react-router";
import './SignupSuccess.css';
import { checkmarkDoneCircleOutline } from "ionicons/icons";

const SignupSucess:React.FC = () => {

    const history = useHistory();

    const goToLogin = () => {
        history.push('/login');
    }

    return (
        <div className="signup-success">
            <IonIcon className="success-icon" icon={checkmarkDoneCircleOutline} color="success" size="large"></IonIcon>
            <h4>Votre compte <span className="report2fix-success">Report2Fix</span> a été créé!</h4>
            <button type="button" className="login-btn" onClick={goToLogin} >Se connecter</button>
        </div>
    );
}

export default SignupSucess;