import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
    width: '100vw'
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
  },
  brand: {
    color: theme.palette.primary.light
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column">
      <Box
        alignItems="start"
        display="flex"
        flexDirection="column"
        p={2}>
        <Typography variant="h2" style={{ fontWeight: "bolder" }} component="div" className={classes.brand} color="primary">oware</Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
        >
          <TreeItem nodeId="1" label="Administration">
            <NavItem nodeId="2" title="Manage User" href="/administration/user" />
            <NavItem nodeId="3" title="Manage Customer" href="/administration/customer" />
            <NavItem nodeId="4" title="Manage Warehouse" href="/administration/warehouse" />
            <NavItem nodeId="5" title="Manage Brand" href="/administration/brand" />
            <NavItem nodeId="6" title="Manage UoM" href="/administration/uom" />
            <NavItem nodeId="7" title="Manage Category" href="/administration/category" />
            <NavItem nodeId="8" title="Manage Product" href="/administration/product" />
          </TreeItem>
          <TreeItem nodeId="9" label="Operations">
            <NavItem nodeId="10" title="Product Inward" href="/operations/product-inward" />
            <NavItem nodeId="11" title="Dispatch Order" href="/operations/dispatch-order" />
            <NavItem nodeId="12" title="Product Outward" href="/operations/product-outward" />
          </TreeItem>
          <TreeItem nodeId="13" label="Reporting">
            <NavItem nodeId="14" title="Inventory" href="#" />
            <NavItem nodeId="15" title="Export" href="#" />
          </TreeItem>
        </TreeView>
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
