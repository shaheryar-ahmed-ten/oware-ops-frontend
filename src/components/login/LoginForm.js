import { Grid, makeStyles, Paper, Typography, TextField, Button, FormControl, InputLabel, BootstrapInput, Box } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    paperStyle: {
        backgroundColor: 'transparent',
        padding: 5,
        height: "55vh",
        maxWidth: "350px",
        minWidth: "auto",
        margin: "10% auto"
    },
    children: {
        margin: "5px auto",
    }
}))

const LoginForm = () => {
    const classes = useStyles();
    return (
        <form>
            <Grid>
                <Paper elevation={0} className={classes.paperStyle}>
                    <Grid align="center">
                        <Typography variant="h3" style={{ fontWeight: "bolder" }} component="div" color="primary">oware</Typography>
                    </Grid>

                    <Box mt={4}>
                        <TextField label="Username or Email" variant="outlined" placeholder="name@example.com" fullWidth="true" required />
                    </Box>
                    <Box mt={3}>
                        <TextField label="Password" variant="outlined" placeholder="*****" fullWidth="true" type="password" required />
                    </Box>
                    <Box mt={1}>
                        <Typography align="center" style={{ fontWeight: "bolder" }}>
                            {/* <Link to="/forget_password">Forgot your password?</Link> */}
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Button type="submit" color="primary" variant="contained" fullWidth="true">Login</Button>
                    </Box>
                </Paper>
            </Grid>
        </form >
    )
}

export default LoginForm
