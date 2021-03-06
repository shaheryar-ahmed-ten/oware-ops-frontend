import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#005cfd",
      light: "#ffffff"
    },
    secondary: {
      main: "#2b3a53",
      light: "#8b96a8",
    }
  },
  overrides: {
    MuiAppBar: {
      root: {
        borderBottom: '0.5px solid #D3D3D3',
        boxShadow: '0px',
      }
    }
  },
  props: {
    MuiButton: {
      disableRipple: true,
    }
  },
  shadows,
  typography
});

export default theme;
