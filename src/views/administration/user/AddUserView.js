import React, { useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  active: {
    color: theme.palette.success.main
  }
}));

export default function UserView({ addUser }) {
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setActive] = useState(false)
  const [user, setUser] = useState([]);
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      password

    }
    setUser(users => {
      return [...users, newUser]
    })
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  }

  return (
    <div style={{ display: "inline" }}>
      <Button variant="contained" color="primary" size="small" onClick={handleClickOpen}>ADD USER</Button>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            Add User
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid container spacing={2} justify="space-around">
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    autoFocus
                    margin="dense"
                    id="firstName"
                    label="First Name"
                    type="text"
                    variant="outlined"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="lastName"
                    label="Last Name"
                    type="text"
                    variant="outlined"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}

                  />
                </Grid>
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={e => setEmail(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="phone"
                  label="Phone Number"
                  type="phone"
                  variant="outlined"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={e => setPassword(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <Checkbox
                  defaultChecked
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                  Active
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onSubmit={handleSubmit} color="primary" variant="contained">Add User</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}