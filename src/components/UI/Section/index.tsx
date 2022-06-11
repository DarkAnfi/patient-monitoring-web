import { Box, BoxProps, Button, makeStyles, PropTypes, Theme, Typography, useTheme } from '@material-ui/core';
import { ButtonMenu } from 'components/UI/ButtonMenu';
import React from 'react';

interface Action {
    label?: string,
    color?: string,
    icon?: JSX.Element,
    materialColor?: PropTypes.Color,
    variant?: 'text' | 'outlined' | 'contained',
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    type?: 'button' | 'menu' | 'component',
    children?: React.ReactNode,
    disabled?: boolean,
}

interface Props {
    label: string | React.ReactChild,
    subtitle?: string | React.ReactChild,
    actions?: Action[],
    children?: React.ReactNode,
};

//  Renderización de acciones (botones, en caso de ser más de 1 botón, genera menu dropdown ) para la sección.
const renderActions = (theme: Theme, actions?: Action[]) => {
    if (actions) {
        if (!actions.length) return (<Typography>No hay acciones</Typography>);
        if (actions.length === 1) {
            const variant = actions[0].variant ?? 'contained';
            if (!!actions[0].type && actions[0].type === 'menu' ) {
                return (
                    <ButtonMenu 
                        text={actions[0].label}
                        buttonColor={actions[0].materialColor}
                        size='small'
                        icon={actions[0].icon}
                        children={actions[0].children}
                        disabled={actions[0].disabled}
                    />
                );
            } else if (!!actions[0].type && actions[0].type === 'component' ) {
                return (
                    actions[0].children
                );
            } else {
                return (
                    <Button
                        size='small'
                        color={actions[0].materialColor ?? 'default'}
                        style={{
                            // color: variant === 'contained' ? theme.palette.getContrastText(actions[0].color ?? theme.palette.text.primary) : actions[0].color ?? '', 
                            borderColor: actions[0].color ?? '', 
                            backgroundColor:  variant === 'contained' ? actions[0].color ?? '' : '',
                        }}
                        variant={variant}
                        onClick={actions[0].onClick}
                        startIcon={actions[0].icon}
                        disabled={actions[0].disabled}
                        disableElevation
                    >
                        { actions[0].label }
                    </Button>
                );
            }
        } else {
            return <ButtonMenu
                options={actions.map((action: Action)=>({
                    label: action.label,
                    icon: action.icon,
                    onSelect: action.onClick,
                    disabled: action.disabled,
                }))}
            />
        }
    }
    return (<div></div>);
};

export const Section: React.FC<Props & BoxProps> = React.memo(({ label, subtitle, actions, children, ...props }) => {
    const theme = useTheme();
    const classes = useStyles();

    return (
        <Box {...props}>
            <Box className={classes.headerContent}>
                <Box className={classes.header}>
                    {
                        typeof label === 'string'
                            ? <Typography variant='body1' className={classes.label}>{label}</Typography>
                            : label
                    }
                    { renderActions(theme, actions) }
                </Box>
                <Box >
                    {
                        !!subtitle && typeof subtitle === 'string'
                            ? <Typography variant='body1' style={{fontSize: '1.2em', fontWeight: 300}} color='textSecondary' className={classes.label}>{subtitle}</Typography>
                            : subtitle
                    }
                </Box>
            </Box>
            <Box className={classes.body}>
                {children}
            </Box>
        </Box>
    );
});

const useStyles = makeStyles((theme) => ({
    headerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'space-between',
        justifyContent: 'center',
        marginBottom: 10,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        
        // justifyContent: 'space-between',
        // alignItems: 'center',
        // marginBottom: 10,
    },
    label: {
        fontSize: '1.5em',
    },
    body: {
        display: 'flex',
        flexWrap: 'wrap',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            flexWrap: 'nowrap',
        }
    },
}));