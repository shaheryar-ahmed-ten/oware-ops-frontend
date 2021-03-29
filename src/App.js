import React from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from '../src/components/GlobalStyles';
import theme from '../src/theme';
import routes from '../src/routes';
import { getUser } from './utils/common';

const App = () => {
  const routing = useRoutes(routes(getUser()));
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
