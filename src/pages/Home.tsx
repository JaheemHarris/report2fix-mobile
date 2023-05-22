import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonPage, 
  IonButton,
  IonImg,
  IonIcon,
  IonThumbnail,
  IonSelect,
  IonSelectOption} from '@ionic/react';
import './Home.css';
import HomeHeader from '../components/HomeHeader';
import { useState, useEffect } from 'react';
import { camera, trash } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import Menu from '../components/Menu';
import { Steps } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import api from '../services/api';
import axios from 'axios';
import ReportType from '../interfaces/ReportType';
import Region from '../interfaces/Region';
import { Geolocation } from '@capacitor/geolocation';

const Home : React.FC = () => {

  const [photo, setPhoto] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const reportSuccess = true;
  const [error, setError] = useState(false);
  const [inputs, setInputs] = useState({
    description: null,
    type: null,
    region: null
  });
  const [types, setTypes] = useState<ReportType[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<any>(null);

  const checkLocalisationPermission = async () => {
    let permissionState = await Geolocation.checkPermissions();
    console.log(permissionState);
    setPermissionStatus(permissionState.location);
  }

  const isValidPermission = () =>{
    if(permissionStatus !== 'denied'){
      return true;
    }
    return false;
  }

  const getReportTypes = () => {
    const typesList = localStorage.getItem('reportTypes');
    if(!typesList){
      api.get("/typesignalements")
      .then((response) => {
        setTypes(response.data);
        localStorage.setItem('reportTypes', JSON.stringify(response.data));
      }).catch((error) => {
        console.log(error);
      });
    }else{
      setTypes(JSON.parse(typesList));
    }
  }

  const getRegions  = () => {
    const regionsList = localStorage.getItem('regions');
    if(!regionsList){
      api.get("/regions")
      .then((response) => {
        setRegions(response.data);
        localStorage.setItem('regions', JSON.stringify(response.data));
      }).catch((error) => {
        console.log(error);
      });
    }else{
      setRegions(JSON.parse(regionsList));
    }
  }

  useEffect(() => {
    checkLocalisationPermission();
    getReportTypes();
    getRegions();
  }, []);
  

  const handleInputs = (event: any) => {
    const {name, value} = event.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  const isFormComplete = () => {
    return Object.values(inputs).every((value) => value !== null && value !== '');
  };

  async function takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    setPhoto(image.dataUrl);
  }

  const nextStep = async () => {
    if (photo) {
      if (currentStep !== 0) {
        if (photo && inputs.description && inputs.type && inputs.region && isValidPermission()) {
          if (currentStep === 2) {
            const coordinates = await Geolocation.getCurrentPosition();
            console.log(coordinates);

            const baseURL = 'http://192.168.88.206:9005/api/v1';
            const photoBlob = await fetch(photo).then((res) => res.blob());
            
            const currentDate = new Date();
            
  
            const imageName = `image${currentDate.getTime()}.${photoBlob.type.split("/")[1]}`;
            let file = new File([photoBlob], imageName);
            const formData = new FormData();
            formData.append('idType', inputs.type);
            formData.append('idStatus', '1');
            formData.append('idRegion', inputs.region);
            formData.append('description', inputs.description);
            formData.append('latitude', `${coordinates.coords.latitude}`);
            formData.append('longitude', `${coordinates.coords.longitude}`);
            formData.append('files', file, imageName);

            const token = localStorage.getItem('token');
            const url = `${baseURL}/signalements`;
            axios.post(url, formData, 
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            }).then((response) => {
                console.log(response);
                setCurrentStep((current) => current + 1); // Move this inside the response callback
              }).catch((error) => {
                console.log(error);
              });
          } else {
            setCurrentStep((current) => current + 1);
          }
        } else {
          setError(true);
        }
      } else {
        currentStep < 3 && setCurrentStep((current) => current + 1);
      }
    }
  }

  const previousStep = () => {
    setInputs((prevState) => ({
      ...prevState,
      type: null
    }));
    currentStep > 0 && setCurrentStep((current) => current - 1);
  }

  const refresh = () => {
    setPhoto(null);
    setCurrentStep(0);
    setInputs({
      description: null,
      type: null,
      region: null
    });
  }

  function deletePhoto() {
    setPhoto(null);
  }

  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <HomeHeader title={'Signaler'}></HomeHeader>
        <IonContent className="ion-padding">
          <Steps className='progression' current={currentStep}>
            <Steps.Item />
            <Steps.Item />
            <Steps.Item />
          </Steps>
          { currentStep === 0 && (
              <>
                <p>Prenez une photo de ce que vous voulez signaler ou sélectionnez-en un!</p>
                { photo ? (
                    <>
                      <div className='photo-container'>
                        <IonImg className='photo' src={photo} />
                      </div>
                      <div>
                        <IonButton onClick={deletePhoto}>
                          <IonIcon slot="icon-only" icon={trash} />
                        </IonButton>
                        <IonButton onClick={nextStep}>Suivant</IonButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <IonThumbnail className='photo-thumbnail'>
                        <img alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/thumbnail.svg" />
                      </IonThumbnail>
                      <IonButton className='photo-button' onClick={takePhoto}>
                        <IonIcon icon={camera} />
                      </IonButton>
                    </>
                )}
              </>)
          }
          { currentStep === 1 && (
              <>
                <p>Compléter les informations à propops du signalement!</p>
                { photo ? (
                    <>
                      <div className='photo-container'>
                      <IonImg className='photo' src={photo} />
                      </div>
                      { error ? (
                        <div className='form-error'>
                          Veuillez complétez les champs!
                        </div>
                      ) : 
                      (<></>)
                      }
                      <div className='form-group'>
                        <div className='input-group'>
                          <label>Type: </label>
                          <IonList>
                            <IonItem>
                              <IonSelect aria-label="Type" interface="popover" name='type' id='type' placeholder="Selectionnez le type" onIonChange={handleInputs}>
                                {
                                  types.map((reportType:ReportType, index) => (
                                    <IonSelectOption value={reportType.id} key={index} >
                                      {reportType.type}
                                    </IonSelectOption>
                                    ))
                                }
                              </IonSelect>
                            </IonItem>
                          </IonList>
                        </div>
                        <div className='input-group'>
                          <label>Région: </label>
                          <IonList>
                            <IonItem>
                              <IonSelect aria-label="region" name='region' id='region' placeholder="Selectionnez la région" onIonChange={handleInputs}>
                                {
                                  regions.map((region:Region, index) => (
                                    <IonSelectOption value={region.id} key={index} >
                                      {region.nom}
                                    </IonSelectOption>
                                    ))
                                }
                              </IonSelect>
                            </IonItem>
                          </IonList>
                        </div>
                        <div className='input-group'>
                          <label>Description: </label>
                          <textarea name='description' id='description' rows={4} onChange={handleInputs} value={inputs.description ? inputs.description : ''}></textarea>
                        </div>
                      </div>
                      <div>
                        <IonButton onClick={previousStep}>Précédent</IonButton>
                        <IonButton onClick={nextStep} disabled={!isFormComplete()}>Suivant</IonButton>
                      </div>
                    </>
                  ) : (
                    <></>
                )}
              </>)
          }
          { currentStep === 2 && (
              <>
                <p>Confirmer votre signalement</p>
                { (photo && inputs.description && inputs.type) ? (
                    <>
                      <div className='photo-container'>
                      <IonImg className='photo' src={photo} />
                      </div>
                      <div className='report-details'>
                        <div className='report-details-section'>
                          <span className='report-details-label'>Type :</span> { (types.find(reportType => reportType.id === inputs.type))?.type}
                        </div>
                        <div className='report-details-section'>
                          <span className='report-details-label'>Région :</span> { (regions.find(region => region.id === inputs.region))?.nom}
                        </div>
                        <div className='report-details-section'>
                          <span className='report-details-label'>Description:</span> {inputs.description}
                        </div>
                      </div>
                      <div>
                        <IonButton onClick={previousStep}>Précédent</IonButton>
                        <IonButton onClick={nextStep}>Confirm</IonButton>
                      </div>
                    </>
                  ) : (
                    <></>
                )}
              </>)
          }
          { currentStep === 3 && (
              <>
                { reportSuccess ? (
                    <>
                      <div className='report-success'>
                        <h4>Signalement réussi!</h4>
                        <IonButton onClick={refresh}>OK</IonButton>
                      </div>
                    </>
                  ) : (
                    <></>
                )}
              </>)
          }
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;

