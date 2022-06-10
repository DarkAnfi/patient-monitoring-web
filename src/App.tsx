import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline, makeStyles, Theme, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import es from 'date-fns/locale/es';

import { SnackbarProvider } from 'notistack';

import { getTheme } from 'styles/theme';
import { RootRouter } from 'routers/RootRouter';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const { isDarkActive } = useSelector<RootState, UIState>(state => state.ui);
  const theme = getTheme(isDarkActive);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('isDarkActive', JSON.stringify(isDarkActive));
  }, [isDarkActive]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        autoHideDuration={3000}
        classes={{
          variantSuccess: classes.success,
          variantError: classes.error,
          variantWarning: classes.warning,
          variantInfo: classes.info,
          containerAnchorOriginBottomLeft: classes.root,
        }}
      >
        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
          <CssBaseline />
          <Router>
            <RootRouter />
          </Router>
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  success: { backgroundColor: theme.palette.success.main },
  error: { backgroundColor: theme.palette.error.main },
  warning: { backgroundColor: theme.palette.warning.main },
  info: { backgroundColor: theme.palette.info.main },
  root: { marginBottom: 20 },
}));

export default App;
