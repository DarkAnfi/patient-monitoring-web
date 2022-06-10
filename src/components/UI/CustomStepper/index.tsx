import React, { ReactNode, useCallback, useImperativeHandle } from 'react';
import { makeStyles, Theme } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, BoxProps } from '@mui/material';

interface CustomStepperProps {
    titles: string[],
    contents: ReactNode[],
    orientation?: 'horizontal' | 'vertical',
    disabledBack?: boolean,
    disabledNext?: boolean,
    enabledReset?: boolean,
    buttonStyle?: React.CSSProperties,
    onFinal?: () => void,
}

export interface StepperRef {
    setStepIndex(index: number): void,
    currentStep(): number,
    handleReset(): void
}

export const CustomStepper = React.forwardRef<StepperRef, CustomStepperProps & BoxProps>(({ titles, contents, orientation = 'horizontal', buttonStyle, disabledNext = false, disabledBack = false, enabledReset = false, onFinal, ...props }, ref) => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };
    const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1); };
    const handleReset = () => { setActiveStep(0); };

    useImperativeHandle(
        ref,
        () => ({
            setStepIndex: (index: number) => setActiveStep(index),
            currentStep: () => activeStep,
            handleReset,
        }),
        [activeStep],
    );

    const stepContent = useCallback((index: number) => {
        return <Box width='100%' {...props}>
            { contents[index] }
            <Box>
                {
                    !disabledBack &&

                    <Button
                        style={buttonStyle}
                        disabled={index === 0}
                        onClick={handleBack}
                        className={classes.button}
                    >
                        Atras
                    </Button>
                }
                {
                    !disabledNext &&
                    <Button
                        style={buttonStyle}
                        variant="contained"
                        color="primary"
                        // onClick={handleNext}
                        // disabled={index === titles.length - 1}
                        className={classes.button}
                        onClick={index === titles.length - 1 ? onFinal : handleNext}
                    >
                        {index === titles.length - 1 ? 'Final' : 'Siguiente'}
                    </Button>
                }
            </Box>
        </Box>;
    }, [buttonStyle, classes.button, contents, disabledBack, disabledNext,onFinal, props, titles.length]);

    return (
        <Box width='100%'>
            <Stepper activeStep={activeStep} orientation={orientation}>
                {titles.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        { orientation === 'vertical' && <StepContent>{ stepContent(index) }</StepContent> }
                    </Step>
                ))}
            </Stepper>
            {(activeStep === titles.length - 1 && enabledReset) && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>Todos los pasos estan completados</Typography>
                    <Button onClick={handleReset} className={classes.button}>Reiniciar</Button>
                </Paper>
            )}
            { orientation === 'horizontal' && stepContent(activeStep) }
        </Box>
    );
})

const useStyles = makeStyles((theme: Theme) => ({
        button: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        resetContainer: {
            padding: theme.spacing(3),
        },
    }),
);