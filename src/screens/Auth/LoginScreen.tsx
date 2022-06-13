import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import validator from 'validator';
import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useForm } from 'hooks/useForm';
import { startLogin } from 'redux/actions/auth';
import { Form } from 'components/UI/Form';
import logoLogin from 'assets/img/logos/logo-login.jpg';

//  Routes:
//  /auth/login

const initialFormError = { name: '', message: '' };
const initialForm = {
    email: '' as string,
    password: '' as string,
};
export const LoginScreen: React.FC = () => {
    const classes = useStyles();
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
        <Box className={`center-content ${classes.root}`}>
            <Box className={classes.formBackground}></Box>
            <Paper className={`${classes.container}`} style={{ zIndex: 10 }}>
                <img className={classes.logo} src={logoLogin} alt='logo-login'/>
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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minHeight: '100vh',
        // backgroundColor: theme.palette.background.paper,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'right bottom',
    },
    logo: {
        width: '50%',
        // height: '300px',
        marginTop: 15,
        // marginBottom: 25,
        fill: theme.palette.primary.main,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%',
        padding: '20px 40px',
        // backgroundColor: theme.palette.background.default,
        [theme.breakpoints.down('xs')]: {
            width: '90%',
        },
        [theme.breakpoints.up('md')]: {
            width: '30%',
        }
    },
    form: {
        alignItems: 'center',
        width: '100%',
    },
    formBackground: {
        filter: theme.palette.type === 'dark' ? 'invert(1)' : 'initial',
        width: '100%',
        height: '100vh',
        position: 'absolute',
        backgroundColor: '#ffffff',
        opacity: 0.75,
    },
    input: {
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        textTransform: 'none',
        width: '50%',
        marginTop: 25,
        marginBottom: 10,
    },
    alert: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
    }
}));