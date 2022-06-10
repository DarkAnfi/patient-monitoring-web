import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core';

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
