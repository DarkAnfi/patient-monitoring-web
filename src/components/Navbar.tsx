import clsx from 'clsx';
import { AppBar, Box, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'redux/actions/auth';
import { toggleMainMenu } from 'redux/actions/ui';

export const Navbar: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { breadcrumbs, isMainMenuOpen } = useSelector((state: RootState) => state.ui);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar
            className={clsx(classes.appBar, {
                [classes.appBarShift]: isMainMenuOpen,
            })}
            position='fixed'
            style={{ zIndex: 1000 }}
        >
            <Toolbar className={classes.root}>
                <Box display='flex' alignItems='center'>
                    {!isMainMenuOpen && <IconButton
                        edge='start'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() => dispatch(toggleMainMenu())}
                    >
                        <MenuIcon />
                    </IconButton>}
                </Box>
                <Box className={`ellipsis ${classes.title}`}>
                    {breadcrumbs.length > 0 && <Typography className='ellipsis'>{breadcrumbs[0].title}</Typography>}
                </Box>
                <Box style={{ flex: 1 }}></Box>
                <Box display='flex' alignItems='center'>
                    {user && <Typography style={{ marginRight: 5 }} variant='body1' noWrap>{user.name}</Typography>}
                    <IconButton onClick={handleLogout} color='inherit' >
                        <ExitToAppIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    title: {
        marginRight: 10,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${300}px)`,
        marginLeft: 300,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));