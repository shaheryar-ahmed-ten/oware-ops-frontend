import React from 'react'
import { Button, AppBar, Toolbar, Grid, IconButton, Badge, makeStyles, Typography } from '@material-ui/core'
import AcUnitIcon from '@material-ui/icons/AcUnit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles({
    root: {
        backgroundColor: "transparent",

    }
})

function Header() {
    const classes = useStyles();
    return (
        <AppBar position="static" className={classes.root} elevation={0}>
            <Toolbar>
                <Grid container align="right">
                    <Grid item sm ></Grid>
                    <Grid item sm>
                        <Typography variant="h6" component="div" color="primary">Welcome, User</Typography>
                        <Button>Logout</Button>
                    </Grid>

                </Grid>

            </Toolbar>
        </AppBar >
    )
}

export default Header
