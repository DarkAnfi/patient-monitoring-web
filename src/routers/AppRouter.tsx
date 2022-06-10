import clsx from 'clsx';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from 'screens/App/HomeScreen';
import { InfoModal } from 'components/Modal/InfoModal';
import { ConfirmModal } from 'components/Modal/ConfirmModal';
import { BreadcrumbsCustom } from 'components/Breadcrumbs';
import { Navbar } from 'components/Navbar';
import { Sidebar } from 'components/Sidebar';
import { Footer } from 'components/Footer';
import { Box, makeStyles, Theme } from '@mui/material';

export const AppRouter: React.FC = () => {
    const classes = useStyles();
    const { paddingEnable, isMainMenuOpen } = useSelector((state: RootState) => state.ui);
    const contentRef = useRef<HTMLDivElement>(null);
    const location = window.location.pathname;

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
                        <Routes>
                            <Route path='/app/home' element={<HomeScreen />} />
                            <Route path="*" element={<Navigate to="/app/home" replace />} />
                        </Routes>
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