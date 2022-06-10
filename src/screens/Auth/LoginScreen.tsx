import { useState } from 'react';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import validator from 'validator';
import { useForm } from 'hooks/useForm';
import { startLogin } from 'redux/actions/auth';
import { Form } from 'components/UI/Form';
import { ReactComponent as Logo } from 'assets/img/logos/logo_login.svg';

//  Routes:
//  /auth/login

const initialFormError = { name: '', message: '' };
const initialForm = {
    email: '' as string,
    password: '' as string,
};
export const LoginScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { error, isLoading } = useSelector<RootState, AuthState>(state => state.auth);
    const [formerror, setFormError] = useState(initialFormError);
    const { form, handleInputChange } = useForm(initialForm);

    const onSubmit = (form: typeof initialForm) => {
        if (validator.isEmpty(form.email)) return setFormError({ name: 'email', message: 'El campo es requerido.' });
        if (validator.isEmpty(form.password)) return setFormError({ name: 'password', message: 'El campo es requerido.' });
        setFormError(initialFormError);
        dispatch(startLogin(form.email, form.password));
    };

    return (
        <Box className={`center-content`}>
            <Box className={classes.formBackground}></Box>
            <Paper className={`${classes.container}`} style={{ zIndex: 10 }}>
                <Logo className={classes.logo} />
                <Form form={form} onChange={handleInputChange} onSubmit={onSubmit}
                    error={formerror.name} helper={formerror.message}
                    className={`flex-column ${classes.form}`}
                >
                    <Form.Input type='email' label='Correo'
                        placeholder='Ejemplo: usuario@correo.cl'
                        margin='dense'
                        fullWidth
                    />
                    <Form.Input type='password' label='Contraseña'
                        margin='dense'
                        min={6}
                        fullWidth
                    />
                    <Button type='submit' children={!isLoading ? 'Ingresar' : 'Ingresando...'}
                        className={classes.button}
                        color='primary'
                        variant='contained'
                        disableElevation
                        disabled={isLoading}
                    />
                </Form>
                {error.message && <Alert severity={error.type} className={classes.alert}>{error.message}</Alert>}
            </Paper>
        </Box>
    );
};