import { Box, Typography } from "@material-ui/core";

export const SplashScreen: React.FC = () => {
    return (
        <Box className='center-content' height={'100vh'} width={'100%'} flexDirection='column'>
            <Typography variant='h5' color='textSecondary' align='center'>Espere un momento...</Typography>
        </Box>
    );
};
