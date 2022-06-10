import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Theme, Typography, useTheme } from '@mui/material';
import { Close, Error, Info, Warning } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { closeConfirmModal, resetConfirmModalState } from 'redux/actions/ui';

export const ConfirmModal: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { confirmModal } = useSelector<RootState, UIState>((state) => state.ui);

    const handleClose = () => {
        dispatch(closeConfirmModal());
        confirmModal.onCancel();
        setTimeout(() => {
            dispatch(resetConfirmModalState());
        }, theme.transitions.duration.enteringScreen);
    };

    const handleConfirm = () => {
        if (confirmModal.onConfirm() === false) return;
        handleClose();
    };

    // const handleCancel = () => {
    //     confirmModal.onCancel();
    //     handleClose();
    // };

    return (
        <Dialog
            open={confirmModal.isOpen}
            maxWidth={confirmModal.size}
            fullWidth={confirmModal.fullWidth}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" style={{ padding: '5px 5px 5px 24px' }}>
                <Box className={`${classes.title} ${confirmModal.type !== 'default' ? classes[confirmModal.type] : ''}`}>
                    <Box display='flex' alignItems='center' >
                        {
                            confirmModal.type === 'info' ? <Info className={classes.icon} />
                                : confirmModal.type === 'warning' ? <Warning className={classes.icon} />
                                    : confirmModal.type === 'error' ? <Error className={classes.icon} />
                                        : <div></div>
                        }
                        <Typography className='ellipsis' variant='h6' component={Box} title={confirmModal.title}>
                            {confirmModal.title}
                        </Typography>
                    </Box>
                    <IconButton aria-label='close' className={classes.closeButton} onClick={confirmModal.isOpen ? handleClose : undefined}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Typography id="alert-dialog-description" variant='body1' className={classes.body} component={Box}>
                    {confirmModal.content}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmModal.isOpen ? handleClose : undefined} variant='text' style={{ color: theme.palette.text.secondary }} autoFocus>
                    Cancelar
                </Button>
                <Button onClick={confirmModal.isOpen ? handleConfirm : undefined} variant='text' color="primary" autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
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
