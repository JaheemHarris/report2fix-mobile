import React from 'react';
import './HomeHeader.css';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';
import HomeHeaderProps from '../interfaces/HomeHeaderProps';

const HomeHeader: React.FC<HomeHeaderProps> = (props) => {
    const title = props.title;
    return (
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
    );
}

export default HomeHeader;