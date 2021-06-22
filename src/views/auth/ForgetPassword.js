import { Paper, Grid, Typography, TextField, Button, makeStyles, Box } from '@material-ui/core';
import React from 'react';

const useStyle = makeStyles(theme => ({
    paperStyle: {
        marginBottom: '20px',
        padding: 5,
        height: '55vh',
        maxWidth: '350px',
        minWidth: 'auto',
        margin: '10% auto'
    },
    text: {
        fontSize: '14px',
        opacity: '0.6',
        padding: '0px',
        marginTop: '20px',
    }
}))

const ForgetPassword = () => {
    const classes = useStyle();
    return (
        <Grid>
            <Paper elevation={0} className={classes.paperStyle}>
                <Grid align="center">
                    <Typography variant="h3" fullWidth="true" component="div" style={{ fontWeight: "bolder" }} color="primary">oware</Typography>
                </Grid>
                <Grid>
                    <Typography className={classes.text} variant="p" component="div" align="center">Forget your password? Enter your email address
                    Or Username and we'll email you password reset link</Typography>
                </Grid>

                <Box mt={4}>
                    <TextField placeholder="name@example.com" label="Username or Email" variant="outlined" fullWidth="true" required />
                </Box>

                <Box mt={2}>
                    <Button variant="contained" color="primary" fullWidth="true">Sent Reset Code</Button>
                </Box>
            </Paper>
        </Grid>
    )
};

export default ForgetPassword;
