import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox
} from '@material-ui/core'

export default function AddUserView({ addUser, roles, open, handleClose, selectedUser, formErrors }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [password, setPassword] = useState('');
  const [isActive, setActive] = useState(false)

  useEffect(() => {
    if (!!selectedUser) {
      setFirstName(selectedUser.firstName || '');
      setLastName(selectedUser.lastName || '');
      setEmail(selectedUser.email || '');
      setUsername(selectedUser.username || '');
      setPhone(selectedUser.phone || '');
      setRoleId(selectedUser.roleId || '');
      setActive(!!selectedUser.isActive);
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPhone('');
      setRoleId('');
      setActive(true);
    }
  }, [selectedUser])
  const handleSubmit = e => {

    const newUser = {
      firstName,
      lastName,
      username,
      email,
      roleId,
      phone,
      isActive,
      password
    }

    addUser(newUser);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedUser ? 'Add User' : 'Edit User'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
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
                  required
                  fullWidth={true}
                  margin="dense"
                  id="username"
                  disabled={!!selectedUser}
                  label="Username"
                  type="text"
                  variant="outlined"
                  value={username}
                  onChange={e => setUsername(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  required
                  fullWidth={true}
                  margin="dense"
                  disabled={!!selectedUser}
                  id="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={e => setEmail(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <FormControl fullWidth={true} variant="outlined">
                  <InputLabel htmlFor="outlined-age-native-simple">Role</InputLabel>
                  <Select
                    required
                    fullWidth={true}
                    margin="dense"
                    id="roleId"
                    label="Role"
                    variant="outlined"
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                  >
                    {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}::{role.type}</MenuItem>)}
                  </Select>
                </FormControl>
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
              {!selectedUser ? <Grid item sm={12}>
                <TextField
                  required
                  fullWidth={true}
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid> : ''}
              <Grid item sm={12}>
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setActive(e.target.checked)}
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                  Active
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedUser ? 'Add User' : 'Update User'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}