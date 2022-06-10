import clsx from 'clsx';
import moment from 'moment';
import { Box, makeStyles, Theme, Typography, useTheme } from "@mui/material"
import { useSelector } from 'react-redux';

export const Footer = () => {
    // const classes = useStyles();
    const theme = useTheme();
    const { isMainMenuOpen } = useSelector((state: RootState) => state.ui);

    return (
        <Box 
            className={clsx(classes.footer, {
                [classes.footerShift]: isMainMenuOpen,
            })}
            height={25} 
            zIndex={12} 
            position='fixed' 
            bottom={0} 
            width='100%' 
            alignItems='center' 
            justifyContent='center' 
            display='flex' 
            style={{ backgroundColor: theme.palette.primary.main, color: theme.palette.getContrastText(theme.palette.primary.main) }}
        >
            <Typography style={{ fontSize: 10 }}>
                Patient Monitor App { moment(new Date()).format('yyyy') } Copyright © Todos los derechos reservados
            </Typography>
        </Box>
    )
}

const useStyles = makeStyles((theme: Theme) => ({
    footer: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    footerShift: {
        width: `calc(100% - ${300}px)`,
        marginLeft: 300,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));