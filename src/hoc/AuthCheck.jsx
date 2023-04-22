import { Navigate } from 'react-router-dom'

const AuthCheck = ({ children }) => {
    if (!window.localStorage.getItem('token')) {
        return <Navigate to={'/login'} />
    }

    return children;
}

export default AuthCheck; 