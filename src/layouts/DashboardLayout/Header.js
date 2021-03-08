import React from 'react'
import { Button, AppBar, Toolbar, Grid, IconButton, Badge, makeStyles, Typography, Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "transparent",
    },
    toolbar: {
        borderBottom: '1px solid #D8D8D8'
    },
    typo: {
        color: 'black',
        fontWeight: 'bolder'
    },
    logout: {
        color: theme.palette.error.main
    }
}))

function Header({ onMobileNavOpen, ...rest }) {
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
                        <Button size="medium" type="submit"  className={classes.logout}>Logout</Button>
                    </Grid>
                </Grid>

            </Toolbar >
        </AppBar >
    )
}

export default Header
