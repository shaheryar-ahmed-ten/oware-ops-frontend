import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TreeItem, TreeView } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { SharedContext } from '../../../utils/common';

import {
  Box,
  Divider,
  Drawer,
  Hidden,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavItem from './NavItem';
import { checkPermission } from '../../../utils/auth';

const navTreeData = [
  {
    title: 'Administration',
    nodeId: 'administration',
    children: [
      {
        canActivate: user => checkPermission(user, 'OPS_USER_FULL'),
        href: '/administration/user',
        title: 'User',
        activeRouteName: 'user'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_CUSTOMER_FULL'),
        href: '/administration/customer',
        title: 'Customer',
        activeRouteName: 'customer'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_WAREHOUSE_FULL'),
        href: '/administration/warehouse',
        title: 'Warehouse',
        activeRouteName: 'warehouse'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_BRAND_FULL'),
        href: '/administration/brand',
        title: 'Brand',
        activeRouteName: 'brand'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_UOM_FULL'),
        href: '/administration/uom',
        title: 'UoM',
        activeRouteName: 'uom'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_CATEGORY_FULL'),
        href: '/administration/category',
        title: 'Category',
        activeRouteName: 'category'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCT_FULL'),
        href: '/administration/product',
        title: 'Product',
        activeRouteName: 'product'
      },
    ]
  },
  {
    title: 'Warehouse Ops',
    nodeId: 'operations',
    children: [
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCTINWARD_FULL'),
        href: '/operations/product-inward',
        title: 'Product Inward',
        activeRouteName: 'product-inward'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_DISPATCHORDER_FULL'),
        href: '/operations/dispatch-order',
        title: 'Dispatch Order',
        activeRouteName: 'dispatch-order'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCTOUTWARD_FULL'),
        href: '/operations/product-outward',
        title: 'Product Outward',
        activeRouteName: 'product-outward'
      }
    ]
  },
  {
    title: 'Reporting',
    nodeId: 'reporting',
    children: [
      {
        canActivate: user => checkPermission(user, 'OPS_INVENTORY_FULL'),
        href: '/reporting/inventory',
        title: 'Inventory',
        activeRouteName: 'inventory'
      }
    ]
  },
  {
    title: 'Transporation Ops',
    nodeId: 'transporat-operations',
    children: [
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCTINWARD_FULL'),
        href: '/operations/vendor',
        title: 'Vendor',
        activeRouteName: 'vendor'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCTINWARD_FULL'),
        href: '/operations/driver',
        title: 'Driver',
        activeRouteName: 'driver'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCTINWARD_FULL'),
        href: '/operations/vehicle',
        title: 'Vehicle',
        activeRouteName: 'vehicle'
      },
      {
        canActivate: user => checkPermission(user, 'OPS_PRODUCTINWARD_FULL'),
        href: '/operations/ride',
        title: 'Ride',
        activeRouteName: 'ride'
      },
    ]
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
  },
  treeNode: {
    color: theme.palette.primary.light,
  },
  treeItem: {
    "&:hover": {
      color: "white"
    }
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const [expanded, setExpanded] = React.useState([`${location.pathname.split('/')[1]}`]);
  const [selected, setSelected] = React.useState([]);
  const classes = useStyles();
  const { currentUser } = useContext(SharedContext);

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

          {navTreeData.map((treeData, i) => (
            <TreeItem nodeId={treeData.nodeId} key={i} label={treeData.title} className={classes.treeNode}>
              {treeData.children.map((treeItem, j) => (
                treeItem.canActivate(currentUser) ? <NavItem key={j} title={treeItem.title} className={classes.treeItem} href={treeItem.href} activeRouteName={treeItem.activeRouteName} /> : ''
              ))}
            </TreeItem>
          ))}
        </TreeView>

      </Box>
      <Divider />

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
