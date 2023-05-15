import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonItem, IonLabel, IonIcon, IonRippleEffect, IonModal } from "@ionic/react";
import { documentTextOutline, fileTrayFullOutline, settingsOutline, logOutOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import './Menu.css';
import { getUser } from "../services/jwtService";

interface MenuProps{
    onRefresh?: () => void
}

const Menu:React.FC<MenuProps> = ({onRefresh}) => {

    const history = useHistory();
    const token = localStorage.getItem('token');
    const modal = useRef<HTMLIonModalElement>(null);
    const [userName, setUserName] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const goTo = (path : string) => {
        history.push(path);
        onRefresh && onRefresh();
    }

    const getUserName = () => { 
        if(token){
            setUserName(getUser(token));
        }
    }

    useEffect(getUserName, []);

    return (
        <IonMenu contentId="main-content">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Menu</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className='avatar-info'>
                    <IonAvatar className='avatar-image'>
                    <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                    <IonItem className="avatar-name">
                    <IonLabel>{userName}</IonLabel>
                    </IonItem>
                </div>
                <div>
                    <div className="ion-activatable ripple-parent rounded-rectangle" onClick={() => goTo('/home')}>
                        <IonIcon slot="icon-only" icon={documentTextOutline} />&emsp; Signaler
                        <IonRippleEffect></IonRippleEffect>
                    </div>
                    <div className="ion-activatable ripple-parent rounded-rectangle" onClick={() => goTo('/reports')}>
                        <IonIcon slot="icon-only" icon={fileTrayFullOutline} />&emsp; Mes Signalements
                        <IonRippleEffect></IonRippleEffect>
                    </div>
                    <div className="ion-activatable ripple-parent rounded-rectangle" onClick={() => history.push('/settings')}>
                        <IonIcon slot="icon-only" icon={settingsOutline} />&emsp; Paramètres
                        <IonRippleEffect></IonRippleEffect>
                    </div>
                    <div className="ion-activatable ripple-parent rounded-rectangle" onClick={() =>setIsOpen(true)}>
                        <IonIcon slot="icon-only" icon={logOutOutline} />&emsp; Se déconnecter
                        <IonRippleEffect></IonRippleEffect>
                    </div>
                </div>
                <IonModal id="logout-modal" ref={modal} isOpen={isOpen} >
                    <div className="logout-title">Report2Fix</div>
                    <div className="logout-question">Voulez-vous vous vraiment déconnectez?</div>
                    <div className="logout-buttons">
                        <a className="cancel-logout"  onClick={() =>setIsOpen(false)}>Non</a>
                        <a className='confirm-logout' href="/logout">Oui</a>
                    </div>
                </IonModal>
            </IonContent>
      </IonMenu>
    );
}

export default Menu;