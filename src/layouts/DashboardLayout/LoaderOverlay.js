import React from 'react';
import { makeStyles } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    background: '#a59e9e1c',
    height: 'calc(100% - 60px)',
    position: 'fixed',
    width: 'calc(100% - 256px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3051
  }
}));

const LoaderOverlay = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
};
export default LoaderOverlay;
