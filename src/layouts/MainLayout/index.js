import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { SharedContext } from '../../utils/common';
import LoaderOverlay from '../DashboardLayout/LoaderOverlay';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const MainLayout = () => {
  const classes = useStyles();
  const { isLoading } = useContext(SharedContext);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            {/* {isLoading ? <LoaderOverlay /> : ''} */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
