import { Box, Typography } from '@mui/material';

interface Props {
  message: string;
  width?: any;
  height?: any;
}

export const BoxError: React.FC<Props> = ({ message, width = '100%', height = '500px' }) => {
  return <Box p={2} width={width} height={height} className='center-content'>
    <Typography className='italic'>{message}</Typography>
  </Box>;
};
