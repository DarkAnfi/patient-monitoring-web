import clsx from 'clsx';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_amchartsdark from '@amcharts/amcharts4/themes/dark';
import { useRef, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { InfoModal } from 'components/Modal/InfoModal';
import { ConfirmModal } from 'components/Modal/ConfirmModal';
import { BreadcrumbsCustom } from 'components/Breadcrumbs';
import { Box, Theme } from '@material-ui/core'
import { Navbar } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { makeStyles } from '@material-ui/styles';
import { Footer } from 'components/Footer';
import { HomeScreen } from 'screens/App/HomeScreen';
import { PatientFollowUpScreen } from 'screens/App/PatientFollowUpScreen';

export const AppRouter: React.FC = () => {
    const classes = useStyles();
    const { paddingEnable, isMainMenuOpen } = useSelector((state: RootState) => state.ui);
    const contentRef = useRef<HTMLDivElement>(null);
    const history = useHistory();
    const location = history.location.pathname;

    useLayoutEffect(() => {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_amchartsdark);
        am4core.addLicense("ch-custom-attribution");
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.scrollBehavior = 'auto';
            contentRef.current.scroll({ top: 0, behavior: 'auto' });
            contentRef.current.style.scrollBehavior = 'smooth';
        }
    }, [contentRef, location]);

    return (
        <div style={{display: 'flex'}}>
            <Navbar />
            <Sidebar />
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: isMainMenuOpen,
                })}
            >
                <div className={classes.drawerHeader} />
                <div id="scroll-container" ref={contentRef}
                    style={{
                        position: 'relative',
                        maxHeight: 'calc(100vh - 89px)',
                        overflowY: 'auto',
                        scrollBehavior: 'smooth',
                        marginBottom: 25
                    }}>
                    <BreadcrumbsCustom />
                    <div style={paddingEnable ? { paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 40 } : {}}>
                        <Switch>
                            <Route exact path='/patient-monitoring-web/app/home' component={HomeScreen} />
                            <Route exact path='/patient-monitoring-web/app/patient-follow-up/:patientId' component={PatientFollowUpScreen} />
                            <Redirect to='/patient-monitoring-web/app/home' />
                        </Switch>
                    </div>
                </div>
                <Box style={{ marginTop: 25 }}></Box>
                <InfoModal />
                <ConfirmModal />
            </main>
            <Footer />
        </div>
    );
};

const useStyles = makeStyles((theme: Theme)=>({
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -300,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));