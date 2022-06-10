import { createTheme } from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";

export const getTheme = (isDarkActive: boolean) => {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#F2B100',// '#A88F1F',
      },
      secondary: {
        main: '#F2C23E',// '#C3B46F',
      },
      success: {
        main: green[400],
      },
      info: {
        main: grey[400],
      },
      warning: {
        main: orange[400],
      },
      error: {
        main: red[400],
      },
      text: {
        primary: '#F4F4F4',
      },
      background: {
        default: '#001935',
        paper: '#001935',
      }
    },
  });
  return theme;
};