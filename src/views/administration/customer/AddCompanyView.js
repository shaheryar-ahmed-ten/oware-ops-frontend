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
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import { isChar, isRequired } from '../../../utils/validators';
import { upload } from '../../../utils/upload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { getURL } from '../../../utils/common';
import { Autocomplete } from '@material-ui/lab';

export default function AddCompanyView({ relationType, addCompany, users, customerTypes, open, handleClose, selectedCompany, formErrors, removeLogoId, isEdit }) {
  const [validation, setValidation] = useState({});
  const [name, setName] = useState('');
  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');
  const [contactId, setContactId] = useState('');

  const [type, setType] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isActive, setActive] = useState(true);
  const [logoImage, setLogoImage] = useState(null);
  const [logoImageSrc, setLogoImageSrc] = useState(null);
  const [logoDimension, setLogoDimension] = useState(false);
  const [logoType, setLogoType] = useState(false);
  const [logoSize, setLogoSize] = useState(false);


  const [selectedCompanyTempLogoId, setSelectedCompanyTempLogoId] = useState(null)
  const [explicitReRender, setExplicitReRender] = useState(false)


  useEffect(() => {
    if (!!selectedCompany) {
      // will work on edit
      setName(selectedCompany.name || '');
      setInternalIdForBusiness(selectedCompany.internalIdForBusiness || '');
      setType(selectedCompany.type || '');
      setContactId(selectedCompany.contactId || '');
      setNotes(selectedCompany.notes || '');
      setActive(!!selectedCompany.isActive);

      selectedCompany.logoId = !selectedCompany.logoId ? selectedCompanyTempLogoId : selectedCompany.logoId
      { selectedCompany && selectedCompany.logoId ? setLogoImageSrc(getURL('preview', selectedCompany.logoId)) : setLogoImageSrc(null) }
    } else {
      setName('');
      setInternalIdForBusiness('');
      setType('');
      setContactId('');
      setNotes('');
      setLogoImageSrc('');
      setActive(true);
    }
  }, [selectedCompany, explicitReRender]);

  useEffect(() => {
    if (relationType == 'VENDOR') setType(null);
  }, [relationType]);

  const handleSubmit = async () => {
    const newCompany = {
      name,
      internalIdForBusiness,
      contactId,
      relationType,
      type,
      contactEmail,
      contactPhone,
      logoId: selectedCompany && selectedCompany.logoId || logoImage || null,
      notes,
      isActive
    }
    setValidation({
      name: true,
      internalIdForBusiness: true,
      contactId: true,
      relationType: true,
      // logoImage: true,
      type: relationType == 'CUSTOMER'
    });
    if (isRequired(name)
      && isRequired(internalIdForBusiness)
      && isRequired(contactId)
      && (relationType == 'VENDOR' || isRequired(type))
      && isRequired(relationType)) {

      if (logoImage) [newCompany.logoId] = await upload([logoImage], 'customer');

      setSelectedCompanyTempLogoId(null);
      addCompany(newCompany);
    }
  }

  const newValidateLogoImage = (event) => {
    const checkFile = event.target.files[0];
    setLogoType(false);
    setLogoSize(false);
    setLogoDimension(false);
    if (checkFile && !checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setLogoType(true);
      return false;
    }
    const isLt2M = checkFile && checkFile.size / 1024 / 1024 < 1; // < 1mb
    if (checkFile && !isLt2M) {
      setLogoSize(true);
      return false;
    }
    const reader = new FileReader();
    checkFile && reader.readAsDataURL(checkFile);
    reader.addEventListener('load', event => {
      const _loadedImageUrl = event.target.result;
      const image = document.createElement('img');
      image.src = _loadedImageUrl;
      image.addEventListener('load', () => {
        const { width, height } = image;
        if (image && width > 142 && height > 37) {
          setLogoDimension(true);
          setLogoImageSrc(null);
          setLogoImage(null);
          return false;
        }
        else {
          setLogoImageSrc(_loadedImageUrl);
          const logoFile = checkFile ? checkFile : null;
          setLogoImage(logoFile)
        }
      });
    })
  }

  const removePreviewId = (event) => {
    setLogoImage(null);
    setLogoImageSrc(null);
    // setCurrentFileName(null)
    setSelectedCompanyTempLogoId(selectedCompany.logoId)
    selectedCompany.logoId = null;
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
                    label={relationType == 'CUSTOMER' ? ` Company Name*` : ` Vendor Name*`}
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
                    label={relationType == 'CUSTOMER' ? ` Company ID*` : ` Vendor ID*`}
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
                      {/* <InputLabel>Company Type*</InputLabel>
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
                      </Select> */}
                      <Autocomplete
                        id="customerTypes"
                        key={customerTypes}
                        options={customerTypes}
                        defaultValue={type ? type : ''}
                        renderInput={(params) => <TextField {...params} label="Company Type" variant="outlined" />}
                        getOptionLabel={(customerType) => customerType || ""}
                        onBlur={e => setValidation({ ...validation, type: true })}
                        onChange={(event, newValue) => {
                          if (newValue)
                            setType(newValue)
                        }}
                      />
                      {validation.type && !isRequired(type) ? <Typography color="error"> {relationType == 'CUSTOMER' ? 'Company' : 'Vendor'}  type is required!</Typography> : ''}
                    </FormControl>
                  </Grid>
                </Grid>
                : ''}
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Contact*</InputLabel>
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


              <p>&nbsp;</p>
              {relationType == 'CUSTOMER' ?
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <Typography color="#03a9f4"><strong>Note</strong>: Company logo needs to be 142 px x 37px or smaller. Size should be less than 1 MB. Only .jpg, .jpeg or .png formats are allowed.</Typography>
                    <p>&nbsp;</p>
                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                      <Button
                        variant="contained"
                        component="label"
                        color={(logoImageSrc) ? 'primary' : 'default'}
                        startIcon={<CloudUploadIcon />}
                      >
                        {relationType == 'CUSTOMER' ? ` Company Logo Image` : ` Vendor Logo Image`} {(logoImageSrc) ? 'Uploaded' : ''}


                        <input
                          type="file"
                          hidden
                          value={(e) => e.target.value + 1}
                          onChange={(e) => newValidateLogoImage(e)}
                          accept=".jpg,.png,.jpeg"
                        />
                        {/* <img id="previewImage" src="#" alt="Company Logo" /> */}
                      </Button>
                      {(logoSize == true) ? <Typography color="error">Logo image size should be less than 1 MB</Typography> : ''}
                      {(logoType == true) ? <Typography color="error">Logo image accepted formats are .jpg, .jpeg or .png</Typography> : ''}
                      {(logoDimension == true) ? <Typography color="error">Logo image dimensions should be 142 px x 37 px or smaller</Typography> : ''}
                      {/* {!(selectedCompany && selectedCompany.logoId) && validation.logoImage && !isRequired(logoImage) ? <Typography color="error">Logo image is required!</Typography> : ''} */}
                    </FormControl>

                    <Grid style={{ textAlign: 'center' }}>

                      {!logoImageSrc ? '' :
                        <Grid item xs={12} style={{ marginLeft: 380 }}>
                          <DeleteSharpIcon
                            onClick={() => removePreviewId()}
                          />
                        </Grid>
                      }
                      {/* {logoImageSrc == null ? '' : */}

                      {
                        logoImageSrc ?
                          <img id="previewImage" src={logoImageSrc} /> :
                          null
                      }

                      {/* } */}
                    </Grid>

                    {/* Remove Logo Trash Bin */}

                    {/* {(selectedCompany && !logoImageSrc && selectedCompany.logoId) ?

                      <Grid item xs={12} style={{ marginLeft: 380 }}>
                        {(selectedCompany && selectedCompany.logoId) ?
                          <DeleteSharpIcon 
                          // onClick={() => removeLogoId()}
                           />
                          : ''}
                      </Grid>
                      : ''}

                    {(selectedCompany && !logoImageSrc && selectedCompany.logoId) ?
                      <Grid item xs={12} style={{ textAlign: 'center' }}>
                        {(selectedCompany && selectedCompany.logoId) ?
                          <a target="_blank" href={getURL('preview', selectedCompany.logoId)}>
                            <img src={getURL('preview', selectedCompany.logoId)} alt="oware logo" />
                          </a>
                          // <DeleteSharpIcon onClick={() => removeLogoId()} />
                          : ''}
                      </Grid>
                      : ''} */}

                  </Grid>

                </Grid>
                : ''}


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
            <Button onClick={() => {
              setExplicitReRender(!explicitReRender);
              handleClose()
            }
            } color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedCompany ? `Add ${relationType == 'CUSTOMER' ? 'COMPANY' : 'VENDOR'}` : `Update ${relationType == 'CUSTOMER' ? 'COMPANY' : 'VENDOR'}`}
            </Button>
          </DialogActions>
        </Dialog>
      </form>

    </div>
  );
}