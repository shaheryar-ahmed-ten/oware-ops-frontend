import React from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary.light,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  title: {
    marginRight: 'auto',
    color: theme.palette.secondary.light,
  },
  active: {
    color: theme.palette.primary.light,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  titleActive: {
    color: theme.palette.primary.light,
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'none'
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  activeRouteName,
  ...rest
}) => {
  const classes = useStyles();
  const location = useLocation();
  const currentPathName = location.pathname.split('/')[2]
  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        activeClassName={classes.active}
        className={activeRouteName && currentPathName.toLowerCase() === activeRouteName.toLowerCase() ? classes.active : classes.button}
        component={RouterLink}
        to={href}
      >
        <span className={activeRouteName && currentPathName.toLowerCase() === activeRouteName.toLowerCase() ? classes.titleActive : classes.title}>
          {title}
        </span>
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;
