interface Report {
    id: Number,
    idType: Number,
    idRegion: Number,
    idUser: Number,
    idStatus: Number,
    description: string,
    dateSignalement: string,
    heureSignalement: string,
    latitude: Number,
    longitude: Number, 
  }

export default Report;