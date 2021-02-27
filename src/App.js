import { createMuiTheme, CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import './App.css';
// import Login from './components/login/Login';
// import 'antd/dist/antd.css';
// import { Route } from 'react-router-dom';
// import Routing from './components/routers/Routing';
// import Layout from './components/Layout'
import Login from './components/login/LoginForm'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#003152",
      light: "#4B0082"
    },
    secondary: {
      main: "#E32636",
      light: "#CD5700",
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
  }
})


function App() {
  return (
    <ThemeProvider theme={theme} className="App">
      {/* <Layout /> */}
      <Login />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
