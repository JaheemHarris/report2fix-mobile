import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

const auth =  async (email:any, password:any) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return axios.post(`${baseUrl}/login`, formData)
    .then(response => {
        return response.data.token;
    }).catch(error => {
        console.log(error);
    });
}

export default auth;