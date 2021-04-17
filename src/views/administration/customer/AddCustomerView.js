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
  Checkbox,
  Typography
} from '@material-ui/core'
import { isRequired } from '../../../utils/validators';

export default function AddCustomerView({ addCustomer, users, customerTypes, open, handleClose, selectedCustomer, formErrors }) {
  const [validation, setValidation] = useState({});
  const [companyName, setCompanyName] = useState('');
  const [contactId, setContactId] = useState('');
  const [type, setType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setActive] = useState(true);


  useEffect(() => {
    if (!!selectedCustomer) {
      setCompanyName(selectedCustomer.companyName || '');
      setType(selectedCustomer.type || '');
      setContactId(selectedCustomer.contactId || '');
      setNotes(selectedCustomer.notes || '');
      setActive(!!selectedCustomer.isActive);
    } else {
      setCompanyName('');
      setType('');
      setContactId('');
      setNotes('');
      setActive(true);
    }
  }, [selectedCustomer]);

  const handleSubmit = e => {
    const newCustomer = {
      companyName,
      contactId,
      type,
      contactEmail,
      contactPhone,
      notes,
      isActive
    }
    setValidation({
      companyName: true,
      contactId: true,
      type: true
    });
    if (isRequired(companyName) && isRequired(contactId) && isRequired(type)) {
      addCustomer(newCustomer);
    }
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedCustomer ? 'Add Customer' : 'Edit Customer'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="companyName"
                  label="Company Name"
                  type="text"
                  variant="outlined"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  onBlur={e => setValidation({ ...validation, companyName: true })}
                />
                {validation.companyName && !isRequired(companyName) ? <Typography color="error">Company name is required!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    fullWidth={true}
                    id="type"
                    label="Customer Type"
                    variant="outlined"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    onBlur={e => setValidation({ ...validation, type: true })}
                  >
                    {customerTypes.map(customerType => <MenuItem key={customerType} value={customerType}>{customerType}</MenuItem>)}
                  </Select>
                  {validation.type && !isRequired(type) ? <Typography color="error">Customer type is required!</Typography> : ''}
                </FormControl>
              </Grid>
              <Grid item sm={12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <InputLabel>Contact</InputLabel>
                  <Select
                    fullWidth={true}
                    id="contactId"
                    label="Contact"
                    variant="outlined"
                    value={contactId}
                    onChange={e => setContactId(e.target.value)}
                    onBlur={e => setValidation({ ...validation, contactId: true })}
                  >
                    {users.map(user => <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName} &lt;{user.email}&gt;</MenuItem>)}
                  </Select>
                  {validation.contactId && !isRequired(contactId) ? <Typography color="error">Contact is required!</Typography> : ''}
                </FormControl>
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="notes"
                  label="Notes"
                  type="text"
                  variant="outlined"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </Grid>
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
              {!selectedCustomer ? 'Add Customer' : 'Update Customer'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}