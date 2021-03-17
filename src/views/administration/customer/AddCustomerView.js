import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox
} from '@material-ui/core'

export default function AddCustomerView({ addCustomer, open, handleClose, selectedCustomer }) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (!!selectedCustomer) {
      setCompanyName(selectedCustomer.companyName || '');
      setContactName(selectedCustomer.contactName || '');
      setContactEmail(selectedCustomer.contactEmail || '');
      setContactPhone(selectedCustomer.contactPhone || '');
      setNotes(selectedCustomer.notes || '');
      setActive(!!selectedCustomer.isActive);
    } else {
      setCompanyName('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setNotes('');
      setActive(false);
    }
  }, [selectedCustomer])
  const handleSubmit = e => {

    const newCustomer = {
      companyName,
      contactName,
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
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="contactName"
                  label="Contact Name"
                  type="text"
                  variant="outlined"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="contactEmail"
                  label="Contact Email"
                  type="text"
                  variant="outlined"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}

                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="contactPhone"
                  label="Contact Phone"
                  type="text"
                  variant="outlined"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}

                />
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