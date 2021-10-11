import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AppBar, Box, Hidden, IconButton, Toolbar, makeStyles, Grid, Typography, Button, Link } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Alert from '@material-ui/lab/Alert';
import Logo from '../../components/Logo';
import { getURL, SharedContext } from '../../utils/common';
import { setUser, removeAuth } from '../../utils/auth';
import AddUserView from '../../views/administration/user/AddUserView';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  avatar: {
    width: 60,
    height: 60
  },
  userLink: {
    color: theme.palette.primary.dark,
    fontWeight: 'bolder',
    cursor: 'pointer'
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
  const { currentUser, setCurrentUser } = useContext(SharedContext);
  const [formErrors, setFormErrors] = useState('');
  const [addUserViewOpen, setAddUserViewOpen] = useState(false);
  const [roles] = useState([]);
  const navigate = useNavigate();

  const updateUser = data => {
    setFormErrors('');
    axios.put(getURL(`user/me`), data)
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        let _user = res.data.data;
        currentUser.firstName = _user.firstName;
        currentUser.lastName = _user.lastName;
        currentUser.phone = _user.phone;
        setUser(currentUser);
        setCurrentUser(currentUser);
        setAddUserViewOpen(false);
      });
  };

  const logout = () => {
    setCurrentUser(null);
    removeAuth();
    navigate('/login');
  }

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <AddUserView
        key={3}
        formErrors={formErrors}
        roles={roles}
        selectedUser={currentUser}
        open={addUserViewOpen}
        addUser={updateUser}
        handleClose={() => setAddUserViewOpen(false)} />
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Grid container align="right" >
          <Grid item sm></Grid>
          <Grid item>
            <Box mr={4} mt={1}>
              <Typography variant="h5" component="div" className={classes.userLink} onClick={e => setAddUserViewOpen(true)}>Welcome, {currentUser.firstName}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button size="medium" type="submit" onClick={logout} to="/login" component={RouterLink} className={classes.logout}>Logout</Button>
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
