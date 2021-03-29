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

export default function AddCustomerView({ addCustomer, users, open, handleClose, selectedCustomer }) {
  const [companyName, setCompanyName] = useState('');
  const [contactId, setContactId] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedCustomer) {
      setCompanyName(selectedCustomer.companyName || '');
      setContactId(selectedCustomer.contactId || '');
      setNotes(selectedCustomer.notes || '');
      setActive(!!selectedCustomer.isActive);
    } else {
      setCompanyName('');
      setContactId('');
      setNotes('');
      setActive(true);
    }
  }, [selectedCustomer])
  const handleSubmit = e => {

    const newCustomer = {
      companyName,
      contactId,
      contactEmail,
      contactPhone,
      notes,
      isActive
    }

    addCustomer(newCustomer);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedCustomer ? 'Add Customer' : 'Edit Customer'}
          </DialogTitle>
          <DialogContent>
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
                />
              </Grid>
              <Grid item sm={12}>
                <FormControl fullWidth={true} variant="outlined">
                  <InputLabel>Contact</InputLabel>
                  <Select
                    fullWidth={true}
                    margin="dense"
                    id="contactId"
                    label="Contact"
                    variant="outlined"
                    value={contactId}
                    onChange={e => setContactId(e.target.value)}
                  >
                    {users.map(user => <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName} &lt;{user.email}&gt;</MenuItem>)}
                  </Select>
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