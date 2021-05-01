import { useState, useEffect, useContext } from 'react';
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
  Checkbox,
  Typography
} from '@material-ui/core'
import { getUser, isSuperAdmin, SharedContext } from '../../../utils/common';
import { isRequired, isEmail, isUsername, isPhone } from '../../../utils/validators';

export default function AddUserView({ addUser, roles, open, handleClose, selectedUser, formErrors }) {
  const [validation, setValidation] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [password, setPassword] = useState('');
  const [isActive, setActive] = useState(false);
  const { currentUser } = useContext(SharedContext);
  const isCurrentUser = () => selectedUser && currentUser.id == selectedUser.id;

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
      setPassword('');
      setPhone('');
      setRoleId(0);
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

    setValidation({
      firstName: true,
      lastName: true,
      username: true,
      roleId: true,
      phone: true,
      email: true,
      password: !!selectedUser
    });
    if (isRequired(firstName) &&
      isRequired(lastName) &&
      isUsername(username) &&
      (!!selectedUser || isRequired(password)) &&
      isEmail(email) &&
      isPhone(phone)) {
      addUser(newUser);
    }
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
                    onBlur={e => setValidation({ ...validation, firstName: true })}
                  />
                  {validation.firstName && !isRequired(firstName) ? <Typography color="error">First name is required!</Typography> : ''}
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
                    onBlur={e => setValidation({ ...validation, lastName: true })}
                  />
                  {validation.lastName && !isRequired(lastName) ? <Typography color="error">Last name is required!</Typography> : ''}
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
                  onBlur={e => setValidation({ ...validation, username: true })}
                />
                {validation.username && !isRequired(username) ? <Typography color="error">Username is required!</Typography> : ''}
                {validation.username && !isUsername(username) ? <Typography color="error">Username should contain only letters and numbers!</Typography> : ''}
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
                  onBlur={e => setValidation({ ...validation, email: true })}
                />
                {validation.email && !isRequired(email) ? <Typography color="error">Email is required!</Typography> : ''}
                {validation.email && !isEmail(email) ? <Typography color="error">Incorrect email!</Typography> : ''}
              </Grid>
              {!isCurrentUser() ?
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel htmlFor="outlined-age-native-simple">Role</InputLabel>
                    <Select
                      required
                      fullWidth={true}
                      id="roleId"
                      label="Role"
                      variant="outlined"
                      value={roleId}
                      onChange={e => setRoleId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, roleId: true })}
                    >
                      <MenuItem value="" disabled>Select a role</MenuItem>
                      {roles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                    </Select>
                    {validation.roleId && !isRequired(roleId) ? <Typography color="error">Role is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
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
                  onBlur={e => setValidation({ ...validation, phone: true })}
                />
                {validation.phone && !isRequired(phone) ? <Typography color="error">Phone number is required!</Typography> : ''}
                {validation.phone && !isPhone(phone) ? <Typography color="error">Incorrect phone number!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <TextField
                  required
                  fullWidth={true}
                  margin="dense"
                  id="password"
                  label={(selectedUser ? 'Change ' : '') + 'Password'}
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={e => setValidation({ ...validation, password: true })}
                />
                {!selectedUser && validation.password && !isRequired(password) ? <Typography color="error">Password is required!</Typography> : ''}
              </Grid>
              {(isSuperAdmin(currentUser) && !isCurrentUser()) ?
                <Grid item sm={12}>
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setActive(e.target.checked)}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                  Active
              </Grid>
                : ''}
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