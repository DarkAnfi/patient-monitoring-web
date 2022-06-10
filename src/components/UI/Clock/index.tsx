import { Box, Typography, useTheme } from "@material-ui/core"
import moment from "moment"
import { useEffect, useState } from "react";

export const ClockCustom = () => {
    const [clock, setClock] = useState(new Date());
    const theme = useTheme();

    useEffect(() => {
        const interval = setInterval(
            () => setClock(new Date()),
            1000
        );

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <Box display='flex' flexDirection='column' alignContent='center' justifyContent='center' style={{ paddingTop: '25px', color: theme.palette.grey[400] }} >
            <Typography variant='caption' align='center'>
                En caso que el código no sea válido, revisar fecha y hora del dispositivo del conductor:
            </Typography>
            <Typography style={{ fontStyle: 'italic' }} variant='caption' align='center'>
                {moment(clock).format('DD-MM-yyyy HH:mm:ss')}
            </Typography>
        </Box>
    )
}
