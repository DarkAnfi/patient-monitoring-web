import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles } from '@mui/material';
import { toggleMainMenu } from 'redux/actions/ui';
import { ReactComponent as Logo } from 'assets/img/logos/logo_drawer.svg';
import { Theme } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

export const Sidebar: React.FC = () => {
    const classes = useStyles();
    const { user } = useSelector((state: RootState) => state.auth);
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
                    <Logo className={classes.logo} />
                    {/* <Typography variant='h6' color='primary'>GART</Typography> */}
                    <IconButton onClick={handleToggleDrawer}>
                        <ChevronLeft />
                    </IconButton>
                </Box>
                <Divider />
                <Box className={classes.menuItems}>
                    <ListItem
                        style={{ height: 56 }}
                        component={Link}
                        to='/app/home'
                        button
                    >
                        <ListItemText classes={{ primary: classes.bold }} primary='Inicio' />
                    </ListItem>
                </Box>
            </List>
        </Drawer>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 300,
        overflow: 'hidden',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: 200,
        }
    },
    logo: {
        // margin: '10px 10px',
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