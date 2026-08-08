import { Navigate } from "react-router-dom";

const IsAuth = ({ children }) => {
    const token = localStorage.getItem("userToken");

    if (token) {
        return children;
    }

    return <Navigate to="/login" replace />;
};

export default IsAuth;
