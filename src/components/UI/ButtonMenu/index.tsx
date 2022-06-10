import React, { useState } from 'react';
import { Box, Button, Divider, Icon, IconButton, ListItemIcon, Menu, MenuItem, PropTypes, Typography } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';

export interface Option {
    icon?: JSX.Element,
    label?: string,
    onSelect?: Function,
    component?: string | React.ReactChild,
}

interface Props {
    options?: Option[],
    icon?: string | React.ReactChild,
    size?: 'small' | 'medium' | 'large',
    text?: string,
    buttonVariant?: 'text' | 'outlined' | 'contained',
    buttonColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | "default" | undefined
    buttonStyle?: React.CSSProperties,
    fullWidth?: boolean,
    disabled?: boolean,
    children?: React.ReactNode;
}

export const ButtonMenu: React.FC<Props> = ({ options, icon, size = 'medium', text, buttonVariant = 'outlined', buttonColor = 'default', buttonStyle, fullWidth = false, children, disabled = false }) => {
    const [isOpen, setOpen] = useState<HTMLElement | null>(null);
    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setOpen(e.currentTarget);
    };

    const handleSelect = (e: React.MouseEvent<HTMLElement>, onSelect?: Function) => {
        if (onSelect && !!onSelect(e)) return;
        handleClose();
    };

    const handleClose = () => {
        setOpen(null);
    };

    //  Renderización de botón.
    const renderButton = () => {
        if (text) {
            return (
                <Button
                    fullWidth={fullWidth}
                    size={size}
                    variant={buttonVariant}
                    color={buttonColor == 'default' ? 'primary' : buttonColor}
                    onClick={handleOpen}
                    style={buttonStyle}
                    disabled={disabled}
                    startIcon={icon ? typeof icon === 'string' ? <Icon fontSize={size}>{icon}</Icon> : icon : <div></div>}
                >
                    {text}
                </Button>
            );
        } else {
            return (
                <IconButton
                    size={size === 'large' ? 'medium' : size}
                    color={buttonColor}
                    onClick={handleOpen}
                    disabled={disabled}
                >
                    {icon ? typeof icon === 'string' ? <Icon fontSize={size}>{icon}</Icon> : icon : <MoreVert fontSize={size} />}
                </IconButton>
            );
        }
    };

    //  Renderización de opciones del menu desplegable.
    const renderMenuOptions = () => {
        if (options && options.length) {
            return options.map(({ icon, label = '', onSelect, component }, index) => {
                if (label === 'divider') {
                    return (<Box
                        key={`option-divider-${uuid()}`}
                        height={'10px'}
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                    >
                        <Divider />
                    </Box>);
                } else if (!!component) {
                    return (<MenuItem key={`option-${index}-${label}`} onClick={(e) => handleSelect(e, onSelect)}> {component} </MenuItem>);
                }
                return (<MenuItem key={`option-${index}-${label}`} onClick={(e) => handleSelect(e, onSelect)}>
                    {
                        icon
                            ? <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            : <div></div>
                    }
                    <Typography>{label}</Typography>
                </MenuItem>);
            });
        } else if (children) {
            return children;
        } else {
            return (
                <Typography component='div'>
                    <Box fontStyle="italic">
                        No hay opciones especificadas.
                    </Box>
                </Typography>
            );
        }
    };

    return (
        <div style={{ width: fullWidth ? '100%' : 'auto' }}>
            {renderButton()}
            <Menu
                anchorEl={isOpen}
                open={Boolean(isOpen)}
                keepMounted
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={handleClose}
            >
                {renderMenuOptions()}
            </Menu>
        </div>
    );
};
