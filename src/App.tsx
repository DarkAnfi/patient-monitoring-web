import { CssBaseline, makeStyles, Theme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "styles/theme";
import { BrowserRouter as Router } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import esLocale from 'date-fns/locale/es';
import { RootRouter } from "routers/RootRouter";



const useStyles = makeStyles((theme: Theme) => ({
  success: { backgroundColor: theme.palette.success.main },
  error: { backgroundColor: theme.palette.error.main },
  warning: { backgroundColor: theme.palette.warning.main },
  info: { backgroundColor: theme.palette.info.main },
  root: { marginBottom: 20 },
}));

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
        <LocalizationProvider locale={esLocale} dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Router>
            <RootRouter />
          </Router>
        </LocalizationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;