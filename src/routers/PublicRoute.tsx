import { Navigate, Route } from 'react-router-dom';

export const PublicRoute: React.FC<RouteProps> = ({
    isAuthenticated,
    ...rest
}) => {
    if(!isAuthenticated) return (<Route {...rest} />);
    else return (<Route path="*" element={<Navigate to="/app/home" replace />} />);
};