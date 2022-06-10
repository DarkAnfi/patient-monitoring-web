import { Redirect, Route, Switch } from 'react-router';
import { LoginScreen } from 'screens/Auth/LoginScreen';

export const AuthRouter: React.FC = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/auth/login' component={LoginScreen} />
                <Redirect to='/auth/login' />
            </Switch>
        </div>
    );
};
