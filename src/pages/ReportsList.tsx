import { IonPage, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSkeletonText, IonItem, IonSelect, IonSelectOption } from "@ionic/react";
import Menu from "../components/Menu";
import HomeHeader from "../components/HomeHeader";
import { useEffect, useRef, useState } from "react";
import api from '../services/api';
import ReportDetails from "../interfaces/ReportDetails";
import Region from "../interfaces/Region";
import ReportType from "../interfaces/ReportType";


const ReportsList: React.FC = () => {

    const [reports, setReports] = useState<ReportDetails[]>([]);
    const [reportsList, setReportsList] = useState<ReportDetails[]>(reports);
    const [loading, setLoading] = useState(true);
    const reportSkeletonNumber = [0, 1, 2, 3];
    const statusRef = useRef<HTMLIonSelectElement>(null);
    const typeRef = useRef<HTMLIonSelectElement>(null);
    const regionRef = useRef<HTMLIonSelectElement>(null);
    const [types, setTypes] = useState<ReportType[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);

    const getReportTypes = () => {
        const typesList = localStorage.getItem('reportTypes');
        if (!typesList) {
            api.get("/typesignalements")
                .then((response) => {
                    setTypes(response.data);
                    localStorage.setItem('reportTypes', JSON.stringify(response.data));
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            setTypes(JSON.parse(typesList));
        }
    }

    const getRegions = () => {
        const regionsList = localStorage.getItem('regions');
        if (!regionsList) {
            api.get("/regions")
                .then((response) => {
                    setRegions(response.data);
                    localStorage.setItem('regions', JSON.stringify(response.data));
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            setRegions(JSON.parse(regionsList));
        }
    }

    const getReportsList = () => {
        // const token = localStorage.getItem('token');
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        // };
        api.get('/signalementdetails')
            .then((response) => {
                const listReport: ReportDetails[] = response.data;
                setReports([...listReport]);
                setReportsList([...listReport]);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getReportsList();
        getReportTypes();
        getRegions();
    }, []);

    const refreshData = () => {
        setLoading(true);
        getReportsList();
    }

    const filterReportsList = () => {
        const status = statusRef.current?.value ? statusRef.current?.value : 0;
        const type = typeRef.current?.value ? typeRef.current?.value : 0;
        const region = regionRef.current?.value ? regionRef.current?.value : 0;
        let filteredResult = [...reportsList];
        // if(status === 0 && type === 0 && region === 0){
        //     setReports([...reportsList]);
        // }
        type !== 0 && (filteredResult = filteredResult.filter(report => report.idType === type));
        status !== 0 && (filteredResult = filteredResult.filter(report => report.idStatus === status));
        region !== 0 && (filteredResult = filteredResult.filter(report => report.idRegion === region));
        setReports([...filteredResult]);

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
                    <IonSelect justify="space-between" label="Status :" placeholder="Tous" ref={statusRef} onIonChange={filterReportsList}>
                        <IonSelectOption value={0}>Tous</IonSelectOption>
                        <IonSelectOption value={1}>Nouveau</IonSelectOption>
                        <IonSelectOption value={2}>En Cours</IonSelectOption>
                        <IonSelectOption value={3}>Résolu</IonSelectOption>
                    </IonSelect>
                    <IonSelect justify="space-between" label="Type :" placeholder="Tous" ref={typeRef} onIonChange={filterReportsList}>
                        <IonSelectOption value={0}>Tous</IonSelectOption>
                        {
                            types.map((type, index) => (<IonSelectOption key={index+1} value={type.id}>{type.type}</IonSelectOption>))
                        }
                    </IonSelect>
                    <IonSelect justify="space-between" label="Région :" placeholder="Tous" ref={regionRef} onIonChange={filterReportsList}>
                        <IonSelectOption value={0}>Tous</IonSelectOption>
                        {
                            regions.map((region, index) => (<IonSelectOption key={index+1} value={region.id}>{region.nom}</IonSelectOption>))
                        }
                    </IonSelect>
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
                                                    <p>{report.region}</p>
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