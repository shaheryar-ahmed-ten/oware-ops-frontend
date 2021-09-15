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
import { capitalize } from 'lodash';
import { isChar, isRequired } from '../../../utils/validators';
import { upload } from '../../../utils/upload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { getURL, digitize } from '../../../utils/common';

export default function AddCompanyView({ relationType, addCompany, users, customerTypes, open, handleClose, selectedCompany, formErrors }) {
  const [validation, setValidation] = useState({});
  const [name, setName] = useState('');
  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');
  const [contactId, setContactId] = useState('');
  // const [relationType, setRelationType] = useState('');
  const [type, setType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setActive] = useState(true);
  const [logoImage, setLogoImage] = useState(null)


  useEffect(() => {
    if (!!selectedCompany) {
      setName(selectedCompany.name || '');
      setInternalIdForBusiness(selectedCompany.internalIdForBusiness || '');
      setType(selectedCompany.type || '');
      setContactId(selectedCompany.contactId || '');
      setNotes(selectedCompany.notes || '');
      setActive(!!selectedCompany.isActive);
    } else {
      setName('');
      setInternalIdForBusiness('');
      setType('');
      setContactId('');
      setNotes('');
      setLogoImage(null);
      setActive(true);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (relationType == 'VENDOR') setType(null);
  }, [relationType]);

  const handleSubmit = async() => {
    const newCompany = {
      name,
      internalIdForBusiness,
      contactId,
      relationType,
      type,
      contactEmail,
      contactPhone,
      logoId: selectedCompany && selectedCompany.logoId,
      notes,
      isActive
    }
    setValidation({
      name: true,
      internalIdForBusiness: true,
      contactId: true,
      relationType: true,
      logoImage:true,
      type: relationType == 'CUSTOMER'
    });
    if (isRequired(name)
      && isRequired(internalIdForBusiness)
      && isRequired(contactId)
      && (relationType == 'VENDOR' || isRequired(type))
      && isRequired(relationType)) {

      if (logoImage) [newCompany.logoId] = await upload([logoImage], 'customer');

      if (!isRequired(newCompany.logoId)) return
      console.log(newCompany)

      addCompany(newCompany);
    }
  }
  const validateLogoImage  = (event) => {
    const checkFile =  event.target.files[0];
    if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      alert("Company Logo image must be only image file!")
     return false;
    }
    const isLt2M = checkFile.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      alert("Company Logo image must smaller than 1MB!");
      return false;
    } 
    setLogoImage(checkFile)
 }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedCompany ? `Add ` : `Edit `}{relationType == 'CUSTOMER' ? 'Company' : 'Vendor'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="name"
                    label={relationType == 'CUSTOMER' ? ` Company Name` : ` Vendor Name`}
                    type="text"
                    variant="outlined"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={e => setValidation({ ...validation, name: true })}
                  />
                  {validation.name && !isRequired(name) ? <Typography color="error">{relationType == 'CUSTOMER' ? 'Company' : 'Vendor'} name is required!</Typography> : ''}
                  {validation.name && !isChar(name) ? <Typography color="error">{relationType == 'CUSTOMER' ? 'Company' : 'Vendor'} name is only characters!</Typography> : ''}
              
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="internalIdForBusiness"
                    label={relationType == 'CUSTOMER' ? ` Company ID` : ` Vendor ID`}
                    type="text"
                    variant="outlined"
                    value={internalIdForBusiness}
                    onChange={e => setInternalIdForBusiness(e.target.value)}
                    onBlur={e => setValidation({ ...validation, internalIdForBusiness: true })}
                  />
                  {validation.internalIdForBusiness && !isRequired(internalIdForBusiness) ? <Typography color="error">{relationType == 'CUSTOMER' ? 'Company' : 'Vendor'} ID is required!</Typography> : ''}
                </Grid>
              </Grid>
              {relationType == 'CUSTOMER' ?
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                      <InputLabel>Company Type</InputLabel>
                      <Select
                        fullWidth={true}
                        id="type"
                        label={'Company Type'}
                        variant="outlined"
                        value={type}
                        onChange={e => setType(e.target.value)}
                        onBlur={e => setValidation({ ...validation, type: true })}
                      >
                        <MenuItem value="" disabled>Select a customer type</MenuItem>
                        {customerTypes.map(customerType => <MenuItem key={customerType} value={customerType}>{customerType}</MenuItem>)}
                      </Select>
                      {validation.type && !isRequired(type) ? <Typography color="error"> {relationType == 'CUSTOMER' ? 'Company' : 'Vendor'}  type is required!</Typography> : ''}
                    </FormControl>
                  </Grid>
                </Grid>
                : ''}
              <Grid container spacing={2}>
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
              </Grid>
              <Grid container spacing={2}>
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
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Button
                      variant="contained"
                      component="label"
                      color={((selectedCompany && selectedCompany.logoId) || logoImage) ? 'primary' : 'default'}
                      startIcon={<CloudUploadIcon />}
                    >
                      {relationType == 'CUSTOMER' ? ` Company Logo Image` : ` Vendor Logo Image`} {((selectedCompany && selectedCompany.logoId) || logoImage) ? 'Uploaded' : ''}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => validateLogoImage(e) }
                        accept=".jpg,.png,.jpeg"
                      />
                    </Button>
                    {!(selectedCompany && selectedCompany.logoId) && validation.logoImage && !isRequired(logoImage) ? <Typography color="error">Logo image is required!</Typography> : ''}
                  </FormControl>
                  {(selectedCompany && selectedCompany.logoId) ?
                  <Grid item xs={12} style={{textAlign: 'center'}}>
                      {(selectedCompany && selectedCompany.logoId) ?
                          <a target="_blank" href={getURL('preview', selectedCompany.logoId)}><img src={getURL('preview', selectedCompany.logoId)} alt="oware logo" /></a>
                      : ''}
                  </Grid>
                  : ''}
                  {/* <TextField
                    fullWidth={true}
                    margin="dense"
                    id="notes"
                    label="gggg"
                    type="text"
                    variant="outlined"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  /> */}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedCompany ? `Add ${relationType.toLowerCase()}` : `Update ${relationType.toLowerCase()}`}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
   
    </div>
  );
}