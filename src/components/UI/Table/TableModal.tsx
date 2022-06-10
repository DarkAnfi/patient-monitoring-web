import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';

interface TableModalProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    content: JSX.Element,
    maxWidth?: false | "xl" | "xs" | "sm" | "md" | "lg";
}

export const TableModal = ({ isOpen, onClose, title, content, maxWidth = 'xl' }: TableModalProps) => {
    const classes = useStyles();

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={onClose}
                maxWidth={maxWidth}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ padding: '5px 5px 5px 24px' }}>
                    <Box className={`${classes.title}`}>
                        <Box display='flex' alignItems='center' >
                            <Typography className='ellipsis' variant='h6' component={Box} title={title}>
                                {title}
                            </Typography>
                        </Box>
                        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography id="alert-dialog-description" variant='body1' className={classes.body} component={Box}>
                        {content}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant='text' color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};


const useStyles = makeStyles((theme) => ({
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
}));
