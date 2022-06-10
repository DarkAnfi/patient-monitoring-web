import { Box, BoxProps, makeStyles, Tab, Tabs, Theme, Typography } from '@mui/material';
import { CSSProperties } from '@material-ui/styles';
import { JSXElementConstructor, ReactElement, useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface CustomTab {
    icon?: string | ReactElement<any, string | JSXElementConstructor<any>>,
    label: string | React.ReactChild,
    content: React.ReactNode,
}

interface CustomTabsProps {
    name: string;
    controlledValue?: number;
    controlledSetValue?: Dispatch<SetStateAction<number>>;
    tabs: CustomTab[];
    defaultIndex?: number;
    fullWidth?: boolean; 
    tabPanelStyle?: CSSProperties;
    orientation?: 'horizontal' | 'vertical';
}

export const CustomTabs: React.FC<CustomTabsProps & BoxProps> = ({ name, orientation = 'horizontal', tabPanelStyle, defaultIndex = 0, controlledValue, controlledSetValue, tabs, fullWidth = false, ...props }) => {
    const classes = useStyles();
    const [value, setValue] = useState<number>(controlledValue ?? defaultIndex);

    useEffect(() => {
        if(controlledValue !== undefined && controlledValue !== null && controlledValue !== value) {
            setValue(controlledValue);
        }
    }, [value, controlledValue]);

    const handleSwitchTab = (event: React.ChangeEvent<{}>, newValue: number) => {
        if (newValue !== value){
            if(!!controlledSetValue) controlledSetValue(newValue);
            else setValue(newValue);
        }
    };

    const renderedTabs = useMemo(() => {
        return tabs.map((tab, index) => <Tab
            fullWidth={fullWidth} 
            style={{width: fullWidth ? '100%' : 'auto'}}
            key={`tab-${name}-${orientation}-${index}`}
            className={classes.tab}
            label={tab.icon && orientation === 'vertical' ? <Box display='flex' width='100%'>
                <Box width='40px' display='flex' alignItems='center'>
                    {tab.icon}
                </Box>
                <Typography style={{ textAlign: 'left' }}>{tab.label}</Typography>
            </Box> : tab.label}
            icon={orientation === 'horizontal' ? tab.icon : undefined}
            {...a11yProps(0, name, orientation)}
        />);
    }, [classes.tab, name, orientation, tabs, fullWidth]);

    const renderedTabPanels = useMemo(() => {
        return tabs.map((tab, index) => <TabPanel key={`tabpanel-${name}-${orientation}-${index}`} style={tabPanelStyle} value={value} index={index} name={name} orientation={orientation}>{tab.content}</TabPanel>);
    }, [name, orientation, tabs, value, tabPanelStyle]);

    return (
        <Box {...props}>
            {
                !tabs.length
                    ? <Typography className='italic' color='textSecondary'>Debe haber al menos una pestaña en la lista de pestañas... </Typography>
                    : <>
                        {
                            orientation === 'horizontal'
                                ? <Box display='flex' style={{width: fullWidth ? '100%' : 'auto'}}>
                                    <Tabs
                                        style={{width: fullWidth ? '100%' : 'auto'}}
                                        orientation={orientation}
                                        variant='fullWidth'
                                        value={value}
                                        onChange={handleSwitchTab}
                                        aria-label={`tabs-${name}`}
                                        className={classes.tabsHorizontal}
                                    >
                                        {renderedTabs}
                                    </Tabs>
                                </Box>
                                : <Tabs
                                    orientation={orientation}
                                    variant='scrollable'
                                    value={value}
                                    onChange={handleSwitchTab}
                                    aria-label={`tabs-${name}`}
                                    className={orientation === 'vertical' ? classes.tabsVertical : ''}
                                >
                                    {renderedTabs}
                                </Tabs>
                        }
                        {renderedTabPanels}
                    </>
            }
        </Box>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    tabsVertical: {
        width: 300,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    tabsHorizontal: {
        width: '100%',
    },
    tab: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        textTransform: "capitalize",
    },
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    name: string;
    orientation: string;
    style?: CSSProperties;
}

export const TabPanel: React.FC<TabPanelProps> = ({children, value, index, name, style, orientation, ...other}) => {
    return (
        <div
            style={{ width: '100%', ...(!!style ? style : {height: 'auto'} ), overflow: 'auto' }}
            role='tabpanel'
            hidden={value !== index}
            id={`${name}-${orientation}-tabpanel-${index}`}
            aria-labelledby={`${name}-${orientation}-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box width='100%' style={{height: '100%'}}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: number, name: string, orientation: string) => {
    return {
        id: `${name}-${orientation}-tab-${index}`,
        'aria-controls': `${name}-${orientation}-tabpanel-${index}`,
    };
};