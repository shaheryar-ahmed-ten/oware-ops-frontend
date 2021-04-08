import {
  Grid,
  makeStyles,
  Paper,
  TextField,
  Button,
  Box
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setUserToken, setUser, getURL, removeUserToken, removeUser } from '../../utils/common';
import Logo from '../../components/Logo';

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

export default function LoginView({ }) {
  const logout = () => {
    removeUserToken();
    removeUser();
  };
  logout();

  const [formErrors, setFormErrors] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleSubmit = e => {
    e.preventDefault();
    setFormErrors(null);
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
      .then(() => {
        navigate('/administration')
      })
      .catch(err => {
        setLoading(false);
        let errorMsg;
        if (err.status === 401 || 400) {
          errorMsg = err.response.data.message;
        }
        else {
          errorMsg = "Something went wrong!";
        }
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{errorMsg}</Alert>);
      })
  }
  return (
    <form onSubmit={handleSubmit}>
      <Grid>
        <Paper elevation={0} className={classes.paperStyle}>
          <Grid align="center">
            <Logo variant="h1" />
          </Grid>
          {formErrors}
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
}
