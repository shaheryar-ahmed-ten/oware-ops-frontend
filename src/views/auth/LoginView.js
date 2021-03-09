import { Grid, makeStyles, Paper, Typography, TextField, Button, FormControl, InputLabel, BootstrapInput, Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setUserToken, setUser, getURL, removeUserToken, removeUser } from '../../utils/common';


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

const LoginView = (props => {
  const logout = () => {
    removeUserToken();
    removeUser();
  };
  logout();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    axios.post(getURL('/user/auth/login'), {
      username,
      password
    })
      .then(res => {
        setLoading(false);
        setUserToken(res.data.token)
      })
      .then(() => axios.get(getURL('/user/me')))
      .then(res => setUser(res.data.data))
      .then(() => navigate('/administration/user'))
      .catch(err => {
        setLoading(false);
        if (err.status === 401 || 400) {
          setError(err.message);
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
            <Typography variant="h1" style={{ fontWeight: "bolder" }} component="div" color="primary">oware</Typography>
          </Grid>

          <Box mt={4}>
            <TextField
              label="Username or Email"
              variant="outlined"
              placeholder="name@example.com"
              fullWidth
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
              fullWidth
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Box>
          <Box mt={2}>
            <Button type="submit" color="primary" variant="contained" fullWidth>Login</Button>
          </Box>
        </Paper>
      </Grid>
    </form >
  )
})

export default LoginView
