import {useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({children, role}) => {
    const {user} = useSelector((state) => state.auth);

    if(!user || user.role  !== role) {
        return <Navigate to="/login" replace  />


    }  
    return children;
}

export default ProtectedRoute;
