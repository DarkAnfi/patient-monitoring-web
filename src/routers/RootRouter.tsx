import { useEffect } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { darken, alpha, lighten, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { checkingToken } from 'redux/actions/auth';
import { PublicRoute } from 'routers/PublicRoute';
import { PrivateRoute } from 'routers/PrivateRoute';
import { AuthRouter } from 'routers/AuthRouter';
import { AppRouter } from './AppRouter';
import { useNotifier } from 'hooks/useNotifier';
import { SplashScreen } from 'screens/SplashScreen';
import { createPatientEvent } from 'redux/actions/patients';
import { v4 } from 'uuid';
import study1 from '../assets/docs/study-1.png';
import study2 from '../assets/docs/study-2.png';
import biopsy from '../assets/docs/biopsy.png';

export const RootRouter: React.FC = () => {
    useStyles();
    useNotifier();
    const { user, checking, token } = useSelector<RootState, AuthState>(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkingToken());
        dispatch<AsyncAction>(async (dispatch) => {
            dispatch(createPatientEvent<Studies>('2', {
                _id: v4(),
                type: 'studies',
                data: {
                    images: [
                        await fetch(study1).then(res => res.arrayBuffer()).then(buf => new File([buf], 'study-1.png', { type: 'image/png' })),
                        await fetch(study2).then(res => res.arrayBuffer()).then(buf => new File([buf], 'study-2.png', { type: 'image/png' })),
                    ],
                    exams: [],
                },
                datetime: new Date(),
            }));
            dispatch(createPatientEvent<Biopsy>('2', {
                _id: v4(),
                type: 'biopsy',
                data: {
                    detail: `RESUMEN biopsia: La lesión está representada por una proliferación de células fusadas de localización intertrabecular, con baja atipía citológica, sin formación de osteoide, positivas en inmunotinciones CDK4 y SatB2. Estos hallazgos morfológicos e inmunohistoquímicos, sumados a los hallazgos clínicos e imagenológicos, permiten favorecer el diagnóstico de osteosarcoma.
Estudio inmunoihstoquímnico recibido el 22-04-2022. La inmunotinción MDM2 se encuentra pendiente al momento de emisión de este informe (será informada en documento posterior).`,
                    results: [
                        await fetch(biopsy).then(res => res.arrayBuffer()).then(buf => new File([buf], 'biopsy.png', { type: 'image/png' })),
                    ]
                },
                datetime: new Date(),
            }));
        });
    }, [dispatch]);

    useEffect(() => {
        if (!checking) {
            if (token) localStorage.setItem('token', token);
            else localStorage.removeItem('token');
            if (user) localStorage.setItem('userName', user.name);
            else localStorage.removeItem('userName');
        }
    }, [token, user, checking]);

    const isAuth = !!user;

    if (checking) return (<SplashScreen />);

    return (
        <div>
            <Switch>
                <PublicRoute path='/patient-monitoring-web/auth' component={AuthRouter} isAuthenticated={isAuth} />
                <PrivateRoute path='/patient-monitoring-web/app' component={AppRouter} isAuthenticated={isAuth} />
                <Redirect to='/patient-monitoring-web/auth/login' />
            </Switch>
        </div>
    );
};

const useStyles = makeStyles((theme) => {

    const getBackgroundColor = (color: string, darkCoeficient: number, lightCoeficient: number) => theme.palette.type === 'dark' ? alpha(color, darkCoeficient) : lighten(color, lightCoeficient);

    const getHoverBackgroundColor = (color: string, darkCoeficient: number, lightCoeficient: number) => theme.palette.type === 'dark' ? alpha(color, darkCoeficient) : lighten(color, lightCoeficient);

    return {
        '@global': {
            'html, body':
            {
                height: '100%',
            },
            //Ancho del scrollbar    
            '*::-webkit-scrollbar': {
                height: '0.6em',
                width: '0.6em',
            },
            //Sombra del scrollbar
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.2)'

            },
            //Scrollbar
            '*::-webkit-scrollbar-thumb': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.2)',
                borderRadius: '15px',
                backgroundColor: 'rgba(0,0,0,.1)',
            },
            '*::-webkit-scrollbar-corner': {
                background: 'rgba(0,0,0,0)',
            },
            // Colors for table
            '.mark-red-row': {
                backgroundColor: getBackgroundColor(theme.palette.error.main, 0.3, 0.8),
                '&:hover': {
                    backgroundColor: `${getHoverBackgroundColor(theme.palette.error.main, 0.4, 0.7)} !important`,
                },
            },
            // StickyTable Styles
            '.stickyTableContainer': {
                width: '100%',
                minHeight: '100px',
                maxHeight: '700px',
                overflow: 'auto',
                borderRadius: '4px',
                // position: 'relative',
                // margin: '0 auto',
                border: `1px solid ${theme.palette.divider}`,
            },
            '.tableContainer': {
                display: 'table',
                width: '100%',
                color: theme.palette.text.primary,
            },
            '.tableHeader': {
                display: 'table-header-group',
            },
            '.tableRow': {
                display: 'table-row',
                '&:hover .tableCol': {
                    background: theme.palette.type === 'dark' ? lighten(theme.palette.background.default, 0.1) : darken(theme.palette.background.default, 0.1),
                },
            },
            '.tableCol': {
                display: 'table-cell',
                whiteSpace: 'nowrap',
                padding: '5px 20px',
                borderBottom: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                textAlign: 'center',
                '&:hover .tableCol': {
                    background: theme.palette.type === 'dark' ? lighten(theme.palette.background.default, 0.1) : darken(theme.palette.background.default, 0.1),
                },
            },
            '.tableHeader .tableCol': {
                fontWeight: 'bold',
                background: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
                position: 'sticky',
                top: '0px',
                zIndex: '9',
            },
            '.tableCol:nth-child(1)': {
                position: 'sticky',
                borderRight: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.default,
                textAlign: 'left',
                left: '0px',
                fontWeight: 'bold',
                zIndex: '10',
            },
            '.tableHeader .tableCol:nth-child(1)': {
                zIndex: '11',
            }
        },
    };
});