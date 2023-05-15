import { IonPage, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSkeletonText } from "@ionic/react";
import Menu from "../components/Menu";
import HomeHeader from "../components/HomeHeader";
import { useEffect, useState } from "react";
import api from '../services/api';
import ReportDetails from "../interfaces/ReportDetails";


const ReportsList: React.FC = () => {

    const [reports, setReports] = useState<ReportDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const reportSkeletonNumber = [0, 1, 2, 3];

    const getReportsList = () => {
        // const token = localStorage.getItem('token');
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        // };
        api.get('/signalementdetails')
            .then((response) => {
                const reportsList: ReportDetails[] = response.data;
                setReports(reportsList);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getReportsList();
    }, []);

    const refreshData = () => {
        setLoading(true);
        getReportsList();
    }

    const toHumanReadableDate = (inputDate: any) => {
        const dateObject = new Date(inputDate);
        const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const monthsOfYear = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        const formattedDate = `${daysOfWeek[dateObject.getDay()]} ${dateObject.getDate()} ${monthsOfYear[dateObject.getMonth()]} ${dateObject.getFullYear()}`;

        return formattedDate;
    }

    return (
        <>
            <Menu onRefresh={refreshData} />
            <IonPage id="main-content">
                <HomeHeader title={'Mes Signalements'}></HomeHeader>
                <IonContent className="ion-padding">
                    <h4>Historique de vos signalements!</h4>
                    <div className="reports-list">
                        {
                            loading ?
                                (
                                    reportSkeletonNumber.map(
                                        (reportSkeleton) => (
                                            <IonCard key={reportSkeleton}>
                                                <IonCardHeader>
                                                    <IonCardTitle><IonSkeletonText animated={true}></IonSkeletonText></IonCardTitle>
                                                    <IonCardSubtitle><IonSkeletonText animated={true}></IonSkeletonText></IonCardSubtitle>
                                                </IonCardHeader>
                                                <IonCardContent>
                                                    <IonSkeletonText animated={true}></IonSkeletonText>
                                                </IonCardContent>
                                            </IonCard>
                                        )
                                    )
                                ) :
                                (
                                    reports.map(
                                        (report: ReportDetails, index) => (
                                            <IonCard key={index}>
                                                <IonCardHeader>
                                                    <IonCardTitle>{report.type}</IonCardTitle>
                                                    <IonCardSubtitle>{report.status}</IonCardSubtitle>
                                                </IonCardHeader>
                                                <IonCardContent>
                                                    <p>{toHumanReadableDate(report.dateSignalement)}</p>
                                                    <p>{report.heureSignalement}</p>
                                                    <p>{report.description}</p>
                                                </IonCardContent>
                                            </IonCard>
                                        )
                                    )
                                )
                        }
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
}

export default ReportsList;