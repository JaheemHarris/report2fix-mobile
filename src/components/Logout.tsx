import { useHistory } from "react-router"

const Logout = () => {
    const history = useHistory();
    localStorage.removeItem('access-token');
    history.push('/login');
    return (<></>);
}

export default Logout;