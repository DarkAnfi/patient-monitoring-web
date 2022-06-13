import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute: React.FC<RouteProps> = ({
    isAuthenticated,
    ...rest
}) => {
    if(isAuthenticated) return (<Route {...rest} />);
    else return (<Redirect to='/patient-monitoring-web/auth/login' />);
};