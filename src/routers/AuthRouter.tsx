import { Navigate, Route, Routes } from 'react-router';
import { LoginScreen } from 'screens/Auth/LoginScreen';

export const AuthRouter: React.FC = () => {
    return (
        <div>
            <Routes>
                <Route path='/auth/login' element={<LoginScreen />} />
                <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
        </div>
    );
};
