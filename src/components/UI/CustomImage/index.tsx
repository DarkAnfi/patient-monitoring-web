import { Box, CircularProgress, Typography, Tooltip, makeStyles, Fab, Theme, BoxProps } from '@material-ui/core';
import { BrokenImage, Fullscreen } from '@material-ui/icons';
import { useCallback, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { openInNewTab } from 'utils/window';

interface Props {
    src?: string,
    alt?: string,
    canZoom?: boolean,
    height?: number,
    width?: number,
    animationDuration?: number,
}

export const CustomImage = ({ src, alt, canZoom = false, height = 380, width = 380, animationDuration = 500, ...props }: Props & BoxProps) => {
    const classes = useStyles({ height, width, animationDuration });
    const [img, setImg] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    const onLoad = useCallback(() => {
        setImg(src ?? './unknown.png');
    }, [src]);

    const onError = useCallback(() => {
        setError(true);
    }, [setError]);

    useEffect(() => {
        const image = new Image();
        image.src = src as string;
        image.addEventListener("load", onLoad);
        image.addEventListener("error", onError);

        return () => {
            image.removeEventListener("load", onLoad);
            image.removeEventListener("error", onError);
        };
    }, [src, onLoad, onError]);

    return (
        <Box className={`center-content`} flexDirection='column' marginTop='20px' {...props}>
            <Box className={`center-content ${classes.imgContainer}`}>
                <Box className={`center-content`} style={{ position: 'relative' }} height={height} width={width}>
                    {
                        !error
                            ? !img
                                ? <CircularProgress />
                                : canZoom
                                    ? <TransformWrapper
                                        initialScale={1}
                                    >
                                        <Tooltip
                                            title='Pantalla completa'
                                            placement='top'
                                            arrow
                                        >
                                            <Fab
                                                size='small'
                                                className={classes.showImage}
                                                color='primary'
                                                onClick={() => openInNewTab(src ?? './unknown.jpg')}
                                            >
                                                <Fullscreen />
                                            </Fab>
                                        </Tooltip>
                                        <TransformComponent
                                            contentStyle={{ borderRadius: '4px', display: 'flex', alignItems: 'center', }}
                                            wrapperStyle={{ borderRadius: '4px', display: 'flex', alignItems: 'center', }}
                                        >
                                            <img className={classes.img} src={src} alt={alt} />
                                        </TransformComponent>
                                    </TransformWrapper>
                                    : <img className={classes.img} src={src} alt={alt} />
                            : <BrokenImage className={classes.noImage} />
                    }
                </Box>
            </Box>
            {
                canZoom && <Typography className={`italic ${classes.wheelInfo}`} variant='body2' align='center' >Gira la rueda del mouse sobre la imagen para hacer zoom</Typography>
            }
        </Box>
    );
};

interface StyleProps {
    height: number,
    width: number,
    animationDuration: number,
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
    wheelInfo: {
        marginTop: 10,
        color: theme.palette.grey[500],
    },
    imgContainer: {
        borderRadius: '5px',
        border: `1px solid ${theme.palette.divider}`,
    },
    img: ({height, width, animationDuration}) => ({
        objectFit: 'contain',
        height: height,
        width: width,
        animation: `fadeIn ${animationDuration}ms`,
        '-webkit-animation': `fadeIn ${animationDuration}ms`,
        '-moz-animation': `fadeIn ${animationDuration}ms`,
        '-o-animation': `fadeIn ${animationDuration}ms`,
        '-ms-animation': `fadeIn ${animationDuration}ms`,
    }),
    noImage: {
        height: 80,
        width: 80,
        color: theme.palette.divider,
    },
    showImage: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
    }
}));