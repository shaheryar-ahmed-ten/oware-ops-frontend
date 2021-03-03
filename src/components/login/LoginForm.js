import { Grid, makeStyles, Paper, Typography, TextField, Button, FormControl, InputLabel, BootstrapInput, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { setUserSession } from '../utils/Common';


const api = "http://localhost:9000/users";
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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const handleSubmit = e => {
        setError(null);
        setLoading(true);
        axios.post(api, {
            username: username,
            password: password
        })
            .then(res => {
                setLoading(false);
                setUserSession(res.data.token, res.data.user)
                props.history.push("/");

                res.json()
            })
            .catch(err => {
                setLoading(false);
                if (err.res.status === 401 || 400) {
                    setError(err.res.data.message);
                }
                else {
                    setError("Something wents wrong");
                }
            })
        // e.preventDefault();
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
                    <Box mt={1}>
                        <Typography align="center" style={{ fontWeight: "bolder" }}>
                            <Link to="/forgetpassword">Forgot your password?</Link>
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
