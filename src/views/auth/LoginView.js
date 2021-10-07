import {
  Grid,
  makeStyles,
  Paper,
  TextField,
  Button,
  Box
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { getURL, SharedContext } from '../../utils/common';
import { getUserToken, setUser, setUserToken } from '../../utils/auth';
import Logo from '../../components/Logo';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paperStyle: {
    marginBottom: '20px',
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
  const [formErrors, setFormErrors] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthToken, setCurrentUser, currentUser } = useContext(SharedContext);
  const navigate = useNavigate();
  const classes = useStyles();

  const setToken = token => {
    setUserToken(token);
    return setAuthToken(token);
  }

  useEffect(() => {
    if (currentUser) {
      navigate('/administration')
    }
  }, [currentUser])

  useEffect(async () => {
    if (getUserToken()) {
      const resTwo = await axios.get(getURL('user/me'))
      if (resTwo) {
        setUser(resTwo.data.data);
        setCurrentUser(resTwo.data.data);
      }
    }
  }, [getUserToken()])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(null);
    try {
      const resOne = await axios.post(getURL('user/auth/login'), {
        username,
        password
      })
      if (resOne) {
        setToken(resOne.data.token);
      }
    } catch (err) {
      console.log("error", err)
      let errorMsg;
      errorMsg = err.response.data.message;
      setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{errorMsg}</Alert>);
    }



    // axios.post(getURL('user/auth/login'), {
    //   username,
    //   password
    // })
    //   .then((response) => {
    //     console.log('1', response)
    //     if (response.data) {
    //       setToken(res.data.token);
    //       if(res.data.token){

    //         axios.get(getURL('user/me'))
    //         .then((res) => {
    //           console.log('than 3', res)
    //           setUser(res.data.data);
    //           setCurrentUser(res.data.data);
    //         })
    //         .then(() => {
    //           if (currentUser && user) {
    //             navigate('/administration')
    //           }
    //         })
    //       }
    //     }
    //   })
    //   .catch(err => {
    //     console.log('err', err)
    //     console.log('err.response', err.response)
    //     console.log('err.status', err.status)
    //     let errorMsg;
    //     errorMsg = err.response.data.message;
    //     // if (err.status === 401 || err.status === 400) {
    //     // }
    //     // else {
    //     //   errorMsg = "Something went wrong!";
    //     // }
    //     setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{errorMsg}</Alert>);
    //   })
    // .then(res => {
    //   console.log("than 1", res)
    //   setToken(res.data.token)})
    // .then(() => {
    //   axios.get(getURL('user/me'))
    // })
    // .then(res => {
    //   console.log('than 3', res)
    //   setUser(res.data.data);
    //   return setCurrentUser(res.data.data);
    // })
    // .then(() => {
    //   navigate('/administration')
    // })
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
