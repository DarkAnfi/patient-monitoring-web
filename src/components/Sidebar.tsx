import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { toggleMainMenu } from 'redux/actions/ui';
import { Home } from '@material-ui/icons';
import logoDrawer from 'assets/img/logos/logo-drawer.png';

export const Sidebar: React.FC = () => {
    const classes = useStyles();
    const { isMainMenuOpen } = useSelector((state: RootState) => state.ui);
    const dispatch = useDispatch();

    const handleToggleDrawer = useCallback(() => dispatch(toggleMainMenu()), [dispatch]);

    return (
        <Drawer
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor='left'
            open={isMainMenuOpen}
            onClose={handleToggleDrawer}
            variant='persistent'
        >
            <List className={classes.root}>
                <Box className={classes.drawerHeader} display='flex' alignItems='center' justifyContent='space-between' height='64px' paddingLeft='10px' paddingRight='10px'>
                    <img className={classes.logo} src={logoDrawer} alt='logo-drawer'/>
                    {/* <IconButton onClick={handleToggleDrawer}>
                        <ChevronLeft />
                    </IconButton> */}
                </Box>
                <Divider />
                <Box className={classes.menuItems}>
                    <ListItem
                        style={{ height: 56 }}
                        component={Link}
                        to='/patient-monitoring-web/app/home'
                        button
                    >
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.bold }} primary='Inicio' />
                    </ListItem>
                </Box>
            </List>
        </Drawer>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
        overflow: 'hidden',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: 200,
        }
    },
    logo: {
        margin: 'auto',
        width: 130,
        height: 43,
        fill: theme.palette.primary.main,
        [theme.breakpoints.down('xs')]: {
            width: 130,
            height: 35,
        }
    },
    menuItems: {
        height: 'calc(100vh - 64px)',
        width: '100%',
        overflow: 'auto',
        [theme.breakpoints.down('xs')]: {
            height: 'calc(100vh - 56px)',
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    bold: {
        fontWeight: 'bold',
    },
    drawer: {
        width: 300,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 300,
        overflowX: 'hidden',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
    },
}));