import React from 'react'
import { Button, AppBar, Toolbar, Grid, IconButton, Badge, makeStyles, Typography, Box } from '@material-ui/core'
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { findByLabelText } from '@testing-library/dom';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        backgroundColor: "transparent",

    },
    toolbar: {
        borderBottom: '1px solid #D8D8D8'
    },
    typo: {
        color: 'black',
        fontWeight: 'bolder'
    }



})

function Header({ ...rest }) {
    const classes = useStyles();
    return (
        <AppBar position="static" className={classes.root} elevation={0} {...rest}>
            <Toolbar className={classes.toolbar}>
                <Grid container align="right" >
                    <Grid item sm></Grid>
                    <Grid item>
                        <Box mr={4} mt={1}>
                            <Typography variant="h5" component="div" className={classes.typo}>Welcome, User</Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button size="medium" type="submit" color="error">Logout</Button>
                    </Grid>
                </Grid>

            </Toolbar >
        </AppBar >
    )
}

export default Header
