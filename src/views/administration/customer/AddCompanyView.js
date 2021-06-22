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

export default function AddCompanyView({ addCompany, users, customerTypes, relationTypes, open, handleClose, selectedCompany, formErrors }) {
  const [validation, setValidation] = useState({});
  const [name, setName] = useState('');
  const [contactId, setContactId] = useState('');
  const [relationType, setRelationType] = useState('');
  const [type, setType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setActive] = useState(true);


  useEffect(() => {
    if (!!selectedCompany) {
      setName(selectedCompany.name || '');
      setType(selectedCompany.type || '');
      setRelationType(selectedCompany.relationType || '');
      setContactId(selectedCompany.contactId || '');
      setNotes(selectedCompany.notes || '');
      setActive(!!selectedCompany.isActive);
    } else {
      setName('');
      setType('');
      setRelationType('');
      setContactId('');
      setNotes('');
      setActive(true);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (relationType == 'VENDOR') setType(null);
  }, [relationType]);

  const handleSubmit = e => {
    const newCompany = {
      name,
      contactId,
      relationType,
      type,
      contactEmail,
      contactPhone,
      notes,
      isActive
    }
    setValidation({
      name: true,
      contactId: true,
      relationType: true,
      type: relationType == 'CUSTOMER'
    });
    if (isRequired(name) && isRequired(contactId) &&
      (relationType == 'VENDOR' || isRequired(type)) &&
      isRequired(relationType)) {
      addCompany(newCompany);
    }
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedCompany ? 'Add Company' : 'Edit Company'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="name"
                  label="Company Name"
                  type="text"
                  variant="outlined"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={e => setValidation({ ...validation, name: true })}
                />
                {validation.name && !isRequired(name) ? <Typography color="error">Company name is required!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <InputLabel>Relation Type</InputLabel>
                  <Select
                    fullWidth={true}
                    id="type"
                    label="Relation Type"
                    variant="outlined"
                    value={relationType}
                    onChange={e => setRelationType(e.target.value)}
                    onBlur={e => setValidation({ ...validation, relationType: true })}
                  >
                    <MenuItem value="" disabled>Select a relation type</MenuItem>
                    {Object.keys(relationTypes).map(key => <MenuItem key={key} value={key}>{relationTypes[key]}</MenuItem>)}
                  </Select>
                  {validation.relationType && !isRequired(relationType) ? <Typography color="error">Relation type is required!</Typography> : ''}
                </FormControl>
              </Grid>
              {relationType == 'CUSTOMER' ?
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Company Type</InputLabel>
                    <Select
                      fullWidth={true}
                      id="type"
                      label="Company Type"
                      variant="outlined"
                      value={type}
                      onChange={e => setType(e.target.value)}
                      onBlur={e => setValidation({ ...validation, type: true })}
                    >
                      <MenuItem value="" disabled>Select a customer type</MenuItem>
                      {customerTypes.map(customerType => <MenuItem key={customerType} value={customerType}>{customerType}</MenuItem>)}
                    </Select>
                    {validation.type && !isRequired(type) ? <Typography color="error">Company type is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                : ''}
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
                    <MenuItem value="" disabled>Select a contact</MenuItem>
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
              {!selectedCompany ? 'Add Company' : 'Update Company'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}