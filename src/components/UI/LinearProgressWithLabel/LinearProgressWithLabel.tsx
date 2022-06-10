import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/material';

export function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress classes={{ colorPrimary:classes.colorPrimary, barColorPrimary:classes.barColorPrimary }} variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );

}


const useStyles = makeStyles((theme) => ({
  colorPrimary: {
    backgroundColor: '#eeeeee',
  },
  barColorPrimary: {
    backgroundColor: '#66bb6a',
  }
}))
