import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3936BE',
    },
    secondary: {
      main: '#F47500',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#171822',
    },
  },
});

export default theme;
