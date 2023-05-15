import jwt_decode from 'jwt-decode';

export const verifyToken = (token: string) => {
    try {
        const decodedToken: any = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}


export const getUser = (token: string) => {
    try {
        const decodedToken: any = jwt_decode(token);
        return decodedToken.sub;
    } catch (error) {
        return null;
    }
}