import { createMuiTheme, CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import './App.css';
import Login from './components/login/LoginForm'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ForgetPassword from './components/login/ForgetPassword'
import Layout from './components/Layout';

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
      <Router>
        <Route path="/" exact component={Layout} />
        <Route path="/login" component={Login} />
        <Route path="/forgetpassword" component={ForgetPassword} />
      </Router>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
