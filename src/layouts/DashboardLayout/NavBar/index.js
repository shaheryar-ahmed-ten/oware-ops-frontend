import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavItem from './NavItem';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};

const items = [
  {
    href: '/administration/user',
    title: 'Manage User'
  },
  {
    href: '/administration/customer',
    title: 'Manage Customer'
  },
  {
    href: '/administration/warehouse',
    title: 'Manage Warehouse'
  },
  {
    href: '/administration/brand',
    title: 'Manage Brand'
  },
  {
    href: '/administration/uom',
    title: 'Manage UoM'
  },
  {
    href: '/administration/category',
    title: 'Manage Category'
  },
  {
    href: '/administration/product',
    title: 'Manage Product'
  },
  {
    href: '/operations/product-inward',
    title: 'Product Inward'
  },
  {
    href: '/operations/dispatch-order',
    title: 'Dispatch Order'
  },
  {
    href: '/operations/product-outward',
    title: 'Product Outward'
  },
];

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 0,
    backgroundColor: theme.palette.secondary.main,
    height: '100vh'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column">
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}>
        <Typography variant="h3" style={{ fontWeight: "bolder" }} component="div" color="">oware</Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title} />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box
        p={2}
        m={2}
        bgcolor="background.dark">

      </Box>
    </Box >
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary">
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
