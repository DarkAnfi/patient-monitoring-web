import { createTheme } from '@material-ui/core';
import { esES } from '@material-ui/core/locale';

export const getTheme = (isDarkActive: boolean) => {
  const theme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#00796b',
        light: '#48a999',
        dark: '#004c40',

      },
      secondary: {
        main: '#546e7a',
        light: '#819ca9',
        dark: '#29434e',
      },
      success: {
        main: '#2e7d32',
        light: '#60ad5e',
        dark: '#005005',
      },
      info: {
        main: '#00acc1',
        light: '#5ddef4',
        dark: '#007c91',
      },
      warning: {
        main: '#f57c00',
        light: '#ffad42',
        dark: '#bb4d00',
      },
      error: {
        main: '#e53935',
        light: '#ff6f60',
        dark: '#ab000d',
      },
      text: {
        primary: '#212121',
        secondary: '#263238',
      },
      background: {
        default: '#fafafa',
        paper: '#eceff1',
      }
    },
  }, esES);
  return theme;
};