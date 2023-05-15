import { IonPage, IonContent } from "@ionic/react";
import Menu from "../components/Menu";
import HomeHeader from "../components/HomeHeader";

const Settings:React.FC = () => {
    return (
        <>
            <Menu />
            <IonPage id="main-content">
                <HomeHeader title={'Paramètres'}></HomeHeader>
                <IonContent className="ion-padding">
                </IonContent>
            </IonPage>
        </>
    );
}

export default Settings;