import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles, Grid, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../../components/Logo';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  avatar: {
    width: 60,
    height: 60
  },
  typo: {
    color: theme.palette.primary.dark,
    fontWeight: 'bolder'
  },
  logout: {
    color: theme.palette.error.main
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [notifications] = useState([]);

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Grid container align="right" >
          <Grid item sm></Grid>
          <Grid item>
            <Box mr={4} mt={1}>
              <Typography variant="h5" component="div" className={classes.typo}>Welcome, User</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button size="medium" type="submit" to="/login" component={RouterLink} className={classes.logout}>Logout</Button>
          </Grid>
        </Grid>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
