import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, makeStyles, Theme, Typography, useTheme } from '@mui/material';
import { Close, Error, Info, Warning } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { closeInfoModal, resetInfoModalState } from 'redux/actions/ui';

export const InfoModal: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { infoModal } = useSelector<RootState, UIState>((state) => state.ui);

    const handleClose = () => {
        dispatch(closeInfoModal());
        setTimeout(() => {
            if (!!infoModal.onOk) infoModal.onOk();
            dispatch(resetInfoModalState());
        }, theme.transitions.duration.enteringScreen);
    };

    return (
        <Dialog
            open={infoModal.isOpen}
            onClose={handleClose}
            maxWidth={infoModal.size}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" style={{ padding: '5px 5px 5px 24px' }}>
                <Box className={`${classes.title} ${infoModal.type !== 'default' ? classes[infoModal.type] : ''}`}>
                    <Box display='flex' alignItems='center' >
                        {
                            infoModal.type === 'info' ? <Info className={classes.icon} />
                                : infoModal.type === 'warning' ? <Warning className={classes.icon} />
                                    : infoModal.type === 'error' ? <Error className={classes.icon} />
                                        : <div></div>
                        }
                        <Typography className='ellipsis' variant='h6' component={Box} title={infoModal.title}>
                            {infoModal.title}
                        </Typography>
                    </Box>
                    <IconButton aria-label='close' className={classes.closeButton} onClick={infoModal.isOpen ? handleClose : undefined}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            {infoModal.hideModalFooter && <Divider style={{width: '100%'}} />}
            <DialogContent dividers={!infoModal.hideModalFooter} style={{padding: !infoModal.hideModalFooter ? '16px 24px' : 0}}>
                <Typography id="alert-dialog-description" variant='body1' className={classes.body} component={Box}>
                    {infoModal.content}
                </Typography>
            </DialogContent>

            {
                !infoModal.hideModalFooter && <DialogActions>
                    <Button onClick={infoModal.isOpen ? handleClose : undefined} variant='text' color="primary" autoFocus>
                        {infoModal.buttonText}
                    </Button>
                </DialogActions>
            }
        </Dialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        width: '100%',
        margin: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    body: {
        width: '100%',
        overflow: 'hidden',
        wordBreak: 'break-word',
        margin: 0,
    },
    closeButton: {
        color: theme.palette.grey[500],
    },
    icon: {
        marginRight: 10,
    },
    warning: { color: theme.palette.warning.main },
    info: { color: theme.palette.info.main },
    error: { color: theme.palette.error.main },
}));
