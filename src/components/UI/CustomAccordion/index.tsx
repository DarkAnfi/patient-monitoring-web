import { CSSProperties, ReactNode, useState } from 'react';
import { Box, Typography, withStyles, AccordionProps, AccordionDetailsProps, AccordionSummaryProps, useTheme } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { ExpandMore } from '@material-ui/icons';

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        // backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

interface CustomAccordionOption {
    title: string | React.ReactChild;
    content: ReactNode;
}

interface CustomAccordionProps {
    name: string;
    active?: string | null;
    controlled?: boolean;
    icon?: ReactNode;
    options: CustomAccordionOption[];
    onChangeExpand?: (panel: string) => void;
    titleStyle?: CSSProperties;
    accordionSummaryProps?: AccordionSummaryProps;
    accordionDetailsProps?: AccordionDetailsProps;
}

export const CustomAccordion: React.FC<CustomAccordionProps & Partial<AccordionProps>> = ({
    name,
    active,
    controlled = false,
    icon = <ExpandMore />,
    options,
    onChangeExpand,
    titleStyle,
    accordionSummaryProps,
    accordionDetailsProps,
    ...props
}) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState<string | false>(active ?? '');

    const handleChange = (panel: string, newExpanded: boolean) => {
        if (!!controlled) setExpanded(newExpanded ? panel : false);
        if (!!onChangeExpand) onChangeExpand(panel);
    };

    return (
        <Box width='100%'>
            {
                options.length > 0
                    ? options.map(({ title, content }, i) => {
                        return (
                            <Accordion
                                key={`${name}-${typeof title === 'string' ? title : i}`}
                                id={`${name}-${typeof title === 'string' ? title : i}`}
                                aria-controls={`${name}-${typeof title === 'string' ? title : i}-content`}
                                style={{ borderTop: `1px solid ${theme.palette.divider}`, ...(i === options.length - 1 ? {borderBottom: `1px solid ${theme.palette.divider}`}: {}), borderRadius: 0, userSelect: 'none' }}
                                expanded={controlled ? expanded === `${name}-${typeof title === 'string' ? title : i}` : undefined}
                                onChange={(event, newExpanded) => handleChange(`${name}-${typeof title === 'string' ? title : i}`, newExpanded)}
                                {...props}
                            >
                                <AccordionSummary {...accordionSummaryProps} expandIcon={icon}>
                                    {
                                        typeof title === 'string'
                                            ? <Typography>{title}</Typography>
                                            : title
                                    }
                                </AccordionSummary>
                                <AccordionDetails {...accordionDetailsProps}>{ content }</AccordionDetails>
                            </Accordion>
                        );
                    })
                    : <Typography className='italic' color="textSecondary">
                        No hay opciones para renderizar...
                    </Typography>
            }
        </Box>
    )
}
