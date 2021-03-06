import { useState, useEffect, useContext } from 'react';
import {
  makeStyles,
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
import { checkPermission } from '../../../utils/auth';
import { isRequired, isEmail, isUsername, isPhone, isChar } from '../../../utils/validators';
import MaskedInput from 'react-text-mask';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  textBox: {
    height: 34
  },
  labelBox: {
    "& label": {
      paddingTop: 7
    }
  },
  labelPadding: {
    paddingTop: 5,
  },
  selectBox: {
    height: 55,
  }
}));

export default function AddUserView({ addUser, roles, customers, portals, open, handleClose, selectedUser, formErrors }) {
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [validation, setValidation] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [portal, setPortal] = useState('');
  const [roleId, setRoleId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const classes = useStyles();

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
      setRoleId(selectedUser.roleId || '');
      setCompanyId(selectedUser.companyId || '');
      setActive(!!selectedUser.isActive);
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setPhone('');
      setRoleId('');
      setPortal('');
      setCompanyId('');
      setActive(true);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!portal) return setFilteredRoles([]);
    setFilteredRoles(roles.filter(role => role.allowedApps === portal));
  }, [portal]);

  const resetStates = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setPhone('');
    setRoleId('');
    setPortal('');
    setCompanyId('');
    setActive(true);
  }

  const changePortal = portal => {
    setRoleId('');
    setCompanyId('');
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
      phone: phone.replace('-', ''),
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
      isEmail(email)) {
      if (portal != 'CUSTOMER') {
        delete newUser.companyId;
      }
      addUser(newUser);
      setValidation({})
      resetStates()
    }
  }

  const phoneNumberMask = [
    /[0-9]/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={() => {
          setValidation({})
          resetStates()
          handleClose()
        }} aria-labelledby="form-dialog-title" onBackdropClick={() => {
          setValidation('')
        }}>
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
                    inputProps={{ className: classes.textBox }}
                    className={classes.labelBox}
                    autoFocus
                    margin="dense"
                    id="firstName"
                    label="First Name"
                    type="text"
                    variant="outlined"
                    value={firstName}
                    onChange={e => {
                      const regex = /^[a-zA-Z]*$/
                      if (regex.test(e.target.value))
                        setFirstName(e.target.value)
                    }}
                    onBlur={e => setValidation({ ...validation, firstName: true })}
                  />
                  {validation.firstName && !isRequired(firstName) ? <Typography color="error">First name is required!</Typography> : ''}
                  {validation.firstName && !isChar(firstName) ? <Typography color="error">First name is only characters!</Typography> : ''}
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    inputProps={{ className: classes.textBox }}
                    className={classes.labelBox}
                    margin="dense"
                    id="lastName"
                    label="Last Name"
                    type="text"
                    variant="outlined"
                    value={lastName}
                    onChange={e => {
                      const regex = /^[a-zA-Z]*$/
                      if (regex.test(e.target.value))
                        setLastName(e.target.value)
                    }}
                    onBlur={e => setValidation({ ...validation, lastName: true })}
                  />
                  {validation.lastName && !isRequired(lastName) ? <Typography color="error">Last name is required!</Typography> : ''}
                  {validation.lastName && !isChar(lastName) ? <Typography color="error">Last name is only characters!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid item sm={12}>
                <TextField
                  required
                  fullWidth={true}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
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
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
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
                    <Autocomplete
                      id="portal"
                      key={portals}
                      options={portals}
                      defaultValue={portal ? portal : ''}
                      renderInput={(params) => <TextField {...params} label="Portal" variant="outlined" />}
                      getOptionLabel={(portal) => {
                        return (
                          portal.label ?
                            portal.label || ""
                            :
                            portal ?
                              portal
                              :
                              ''
                        )

                      }}
                      onBlur={e => setValidation({ ...validation, portal: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          changePortal(newValue.id)
                      }}
                    />
                    {validation.portal && !isRequired(portal) ? <Typography color="error">Please select a portal!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
              {!isCurrentUser() ?
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="portal"
                      key={filteredRoles}
                      options={filteredRoles}
                      defaultValue={selectedUser ? selectedUser.Role : ''}
                      renderInput={(params) => <TextField {...params} label="Role" variant="outlined" />}
                      getOptionLabel={(role) => {
                        return (
                          role && role.name ?
                            role.name || ""
                            :
                            ''
                        )

                      }}
                      onBlur={e => setValidation({ ...validation, roleId: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setRoleId(newValue.id)
                      }}
                    />
                    {validation.roleId && !isRequired(roleId) ? <Typography color="error">Role is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
              {(!isCurrentUser() && portal == 'CUSTOMER') ?
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    {/* <InputLabel htmlFor="outlined-age-native-simple" className={classes.labelPadding}>Company</InputLabel>
                    <Select
                      className={classes.selectBox}
                      required
                      fullWidth={true}
                      id="companyId"
                      label="Company"
                      variant="outlined"
                      value={companyId}
                      onChange={e => setCompanyId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, companyId: true })}
                    >
                      <MenuItem value="" disabled>Select a company</MenuItem>
                      {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>)}
                    </Select> */}
                    <Autocomplete
                      id="customers"
                      key={customers}
                      options={customers}
                      defaultValue={selectedUser && selectedUser.companyId ? selectedUser : ''}
                      renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
                      getOptionLabel={(customer) => {
                        return (
                          customer && customer.name ?
                            customer.name || ""
                            :
                            customer.Company ?
                              customer.Company.name
                              :
                              ''
                        )
                      }}
                      onBlur={e => setValidation({ ...validation, companyId: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setCompanyId(newValue.id)
                      }}
                    />
                    {validation.companyId && !isRequired(companyId) ? <Typography color="error">Customer is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
              <Grid item sm={12}>
                <MaskedInput
                  className="mask-text"
                  // guide={false}
                  // showMask={true}
                  margin="dense"
                  variant="outlined"
                  name="phone"
                  mask={phoneNumberMask}
                  label="Phone"
                  id="Phone"
                  type="text"
                  value={phone}
                  placeholder="Phone ( 032*-******* )"
                  onChange={e => {
                    setPhone(e.target.value)
                  }}
                  onBlur={e => setValidation({ ...validation, phone: true })}
                  style={{ padding: '22px 10px', color: '#2f2727', fontWeight: 600, borderColor: 'rgba(0,0,0,0.3)', marginTop: 10 }}
                />
                {validation.phone && !isRequired(phone) ? <Typography color="error">Phone number is required!</Typography> : ''}
                {/* {validation.phone && !isRequired(phone) ? <Typography color="error">Incorrect phone number!</Typography> : ''} */}
              </Grid>
              <Grid item sm={12}>
                <TextField
                  required
                  fullWidth={true}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
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
              {(checkPermission(currentUser, 'OPS_USER_FULL') && !isCurrentUser()) ?
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
            <Button onClick={() => {
              // setExplicitReRender(!explicitReRender);
              setValidation({})
              resetStates()
              handleClose()
            }
            } color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedUser ? 'Add User' : 'Update User'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}