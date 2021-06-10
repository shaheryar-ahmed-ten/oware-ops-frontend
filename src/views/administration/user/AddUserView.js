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
import { SharedContext } from '../../../utils/common';
import { isSuperAdmin } from '../../../utils/auth';
import { isRequired, isEmail, isUsername, isPhone } from '../../../utils/validators';

export default function AddUserView({ addUser, roles, customers, portals, open, handleClose, selectedUser, formErrors }) {
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [validation, setValidation] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [portal, setPortal] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [companyId, setCompanyId] = useState(null);

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
      setPortal((selectedUser.Role && selectedUser.Role.allowedApps) || '');
      setRoleId(selectedUser.roleId || null);
      setCompanyId(selectedUser.companyId || null);
      setActive(!!selectedUser.isActive);
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setPhone('');
      setRoleId(null);
      setPortal(null);
      setCompanyId(null);
      setActive(true);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (!portal) return setFilteredRoles([]);
    setFilteredRoles(roles.filter(role => role.allowedApps === portal));
  }, [portal]);


  const changePortal = portal => {
    setRoleId(null);
    setCompanyId(null);
    setPortal(portal);
  }

  const handleSubmit = e => {

    const newUser = {
      firstName,
      lastName,
      username,
      email,
      roleId,
      companyId,
      phone,
      isActive,
      password
    }

    setValidation({
      firstName: true,
      lastName: true,
      username: true,
      portal: true,
      roleId: true,
      companyId: portal === 'CUSTOMER',
      phone: true,
      email: true,
      password: !!selectedUser
    });
    if (isRequired(firstName) &&
      isRequired(lastName) &&
      isRequired(portal) &&
      isRequired(roleId) &&
      (portal != 'CUSTOMER' || isRequired(companyId)) &&
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
                    <InputLabel htmlFor="outlined-age-native-simple">Portal</InputLabel>
                    <Select
                      required
                      fullWidth={true}
                      id="portal"
                      label="Portal"
                      variant="outlined"
                      value={portal}
                      onChange={e => changePortal(e.target.value)}
                      onBlur={e => setValidation({ ...validation, portal: true })}
                    >
                      <MenuItem value="" disabled>Select a portal</MenuItem>
                      {portals.map(portal => <MenuItem key={portal.id} value={portal.id}>{portal.label}</MenuItem>)}
                    </Select>
                    {validation.portal && !isRequired(portal) ? <Typography color="error">Please select a portal!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
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
                      {filteredRoles.map(role => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                    </Select>
                    {validation.roleId && !isRequired(roleId) ? <Typography color="error">Role is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
              {(!isCurrentUser() && portal == 'CUSTOMER') ?
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel htmlFor="outlined-age-native-simple">Customer</InputLabel>
                    <Select
                      required
                      fullWidth={true}
                      id="companyId"
                      label="Customer"
                      variant="outlined"
                      value={companyId}
                      onChange={e => setCompanyId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, companyId: true })}
                    >
                      <MenuItem value="" disabled>Select a customer</MenuItem>
                      {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>)}
                    </Select>
                    {validation.companyId && !isRequired(companyId) ? <Typography color="error">Customer is required!</Typography> : ''}
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