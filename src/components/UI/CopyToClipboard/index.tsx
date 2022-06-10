import { Tooltip, IconButton, makeStyles, useTheme } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { useState } from 'react';
import { setTimeout } from 'timers';

interface Props {
    text: string,
    placement?: 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'right-end' | 'right-start' | 'top-end' | 'top-start',
}

export const CopyToClipboard = ({ text, placement='top' }: Props) => {
    const theme = useTheme();
    const classes = useStyles();
    const [copied, setCopied] = useState<boolean>(false);

    const handleClose = () => {
        if(copied) setTimeout(() => setCopied(false), theme.transitions.duration.shorter);
    };

    const handleCopy = () => {
        if(!copied) {
            navigator.clipboard.writeText(text);
            setCopied(true);
        }
    };

    return (
        <Tooltip
            title={ copied ? '✔ ¡Copiado!': 'Copiar'}
            classes={{ tooltip: classes.tooltip }}
            placement={placement}
            onClose={handleClose}
            arrow
        >
            <IconButton color='primary' onClick={handleCopy}>
                <FileCopy/>
            </IconButton>
        </Tooltip>
    );
};

const useStyles = makeStyles((theme) => ({
    tooltip: {
        minWidth: 70,
        textAlign: 'center',
    }
}));
