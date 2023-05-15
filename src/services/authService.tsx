import axios from 'axios';

const baseURL = 'http://192.168.88.206:9005/api/v1';

const auth =  async (email:any, password:any) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return axios.post(`${baseURL}/login`, formData)
    .then(response => {
        return response.data.token;
    }).catch(error => {
        console.log(error);
    });
}

export default auth;