import { Grid, makeStyles, Paper, Typography, TextField, Button, FormControl, InputLabel, BootstrapInput, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { setUserToken, setUser, getURL, removeUserToken } from '../../utils/common';


const api = "http://localhost:3000/users";
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

const LoginForm = (props) => {
    const logout = () => {
        removeUserToken();
    };
    logout();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        axios.post(getURL('/users/auth/login'), {
            username,
            password
        })
            .then(res => {
                setLoading(false);
                setUserToken(res.data.token)
            })
            .then(() => axios.get(getURL('/users/me')))
            .then(res => {
                setUser(res.data)
            })
            .catch(err => {
                console.log(err)
                setLoading(false);
                if (err.data.status === 401 || 400) {
                    setError(err.data.message);
                }
                else {
                    setError("Something went wrong!");
                }
            })
    }
    return (
        <form onSubmit={handleSubmit}>
            <Grid>
                <Paper elevation={0} className={classes.paperStyle}>
                    <Grid align="center">
                        <Typography variant="h3" style={{ fontWeight: "bolder" }} component="div" color="primary">oware</Typography>
                    </Grid>

                    <Box mt={4}>
                        <TextField
                            label="Username or Email"
                            variant="outlined"
                            placeholder="name@example.com"
                            fullWidth="true"
                            required
                            value={username}
                            onChange={(e => setUsername(e.target.value))}
                        />
                    </Box>
                    <Box mt={3}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            placeholder="*****"
                            fullWidth="true"
                            required
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
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
