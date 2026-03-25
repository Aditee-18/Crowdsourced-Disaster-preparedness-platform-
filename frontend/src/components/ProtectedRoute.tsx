import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
    // Check if user exists and role is admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default ProtectedRoute;