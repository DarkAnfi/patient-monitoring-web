import { Redirect, Route, Switch } from 'react-router';
import { LoginScreen } from 'screens/Auth/LoginScreen';

export const AuthRouter: React.FC = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/patient-monitoring-web/auth/login' component={LoginScreen} />
                <Redirect to='/patient-monitoring-web/auth/login' />
            </Switch>
        </div>
    );
};
