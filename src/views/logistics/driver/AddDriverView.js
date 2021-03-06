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
  Typography,
  makeStyles
} from '@material-ui/core'
import { isChar, isPhone, isRequired } from '../../../utils/validators';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useEffect, useState } from 'react'
import { upload } from '../../../utils/upload';
import { Autocomplete } from '@material-ui/lab';
import clsx from "clsx";
import MaskedInput from "react-text-mask";
// const useStyles = makeStyles((theme) => ({

// }))
const useStyles = makeStyles((theme) => ({
  textBox: {
    height: 34
  },
  labelBox: {
    "& label": {
      paddingTop: 7
    }
  }
}));

function AddDriverView({ selectedDriver, companies, formErrors, open, handleClose, addDriver }) {

  const classes = useStyles();
  
  const [driverName, setDriverName] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [validation, setValidation] = useState({});
  const [vendorName, setVendorName] = useState('')
  const [vendorId, setVendorId] = useState(null)
  const [cnicNumber, setCNICNumber] = useState('')
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('')
  const [drivingLicenseImage, setDrivingLicenseImage] = useState(null)
  const [CNICImage, setCNICImage] = useState(null)
  useEffect(() => {
    if (open)
      resetLocalStates()
    if (selectedDriver) {
      setDriverName(selectedDriver ? selectedDriver.name : '');
      setDriverPhone(selectedDriver ? selectedDriver.phone : '');
      setDrivingLicenseNumber(selectedDriver ? selectedDriver.drivingLicenseNumber : '');
      setVendorName(selectedDriver.Vendor ? selectedDriver.Vendor.name : '');
      setVendorId(selectedDriver.Vendor ? selectedDriver.Vendor.id : '');
      setCNICNumber(selectedDriver ? selectedDriver.cnicNumber : '');
    }
    else {
      resetLocalStates()
    }
  }, [open])
  const resetLocalStates = () => {
    setDriverName('');
    setDriverPhone('');
    setValidation({});
    setDrivingLicenseNumber('');
    setVendorName('');
    setVendorId(null);
    setCNICNumber(null);
    setDrivingLicenseImage(null);
    setCNICImage(null);
  }

  const handleSubmit = async () => {

    let strDriverNumber = driverPhone;
    let stringDriverNumber = strDriverNumber.replace(/-/g, "");
    const newDriver = {
      name: driverName,
      phone: stringDriverNumber,
      drivingLicenseNumber: drivingLicenseNumber,
      companyId: vendorId,
      cnicNumber: cnicNumber,
      drivingLicenseId: selectedDriver && selectedDriver.drivingLicenseId,
      cnicId: selectedDriver && selectedDriver.cnicId,
    }
    setValidation({
      driverName: true,
      driverPhone: true,
      validation: true,
      drivingLicenseNumber: true,
      vendorId: true,
      cnicNumber: true,
      drivingLicenseImage: true,
      CNICImage: true,
    });

    if (isRequired(driverName) &&
      isRequired(driverPhone) &&
      isPhone(driverPhone.replace(/-/g, "")) &&
      isRequired(validation) &&
      isRequired(drivingLicenseNumber) &&
      isRequired(vendorId) &&
      isRequired(cnicNumber)) {

      if (drivingLicenseImage) [newDriver.drivingLicenseId] = await upload([drivingLicenseImage], 'driver');
      if (CNICImage) [newDriver.cnicId] = await upload([CNICImage], 'driver');

      if (!isRequired(newDriver.drivingLicenseId) || !isRequired(newDriver.cnicId)) return

      if(!isPhone(driverPhone.replace(/-/g, ""))) return

      addDriver(newDriver);
    }
  }

  const validateDrivingLicenceImage = (event) => {
    const checkFile = event.target.files[0];
    // let dimentions
    if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      alert("Driving lisence image must be only image file!")
      return false;
    }
    const isLt2M = checkFile.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      alert("Driving lisence image must smaller than 1MB!");
      return false;
    }
    setDrivingLicenseImage(checkFile)
  }

  const validateCnicImage = (event) => {
    const checkFile = event.target.files[0];
    if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      alert("Driving lisence image must be only image file!")
      return false;
    }
    const isLt2M = checkFile.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      alert("Driving licence image must smaller than 1MB!");
      return false;
    }
    setCNICImage(checkFile)
  }

  const phoneNumberMask = [/[0]/, /[3]/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedDriver ? 'Add Driver' : 'Edit Driver'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    inputProps={{ className: classes.textBox }}
                    className={classes.labelBox}
                    margin="dense"
                    id="selectedDriver"
                    label="Driver Name"
                    type="text"
                    variant="outlined"
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                    onBlur={e => setValidation({ ...validation, driverName: true })}
                  />
                  {validation.driverName && !isRequired(driverName) ? <Typography color="error">Driver name is required!</Typography> : ''}
                  {validation.driverName && !isChar(driverName) ? <Typography color="error">Driver name is only characters!</Typography> : ''}
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    inputProps={{ className: classes.textBox }}
                    className={classes.labelBox}
                    margin="dense"
                    id="driverliceneNumber"
                    label="Driving License Number"
                    type="text"
                    variant="outlined"
                    value={drivingLicenseNumber}
                    onChange={e => setDrivingLicenseNumber(e.target.value)}
                    onBlur={e => setValidation({ ...validation, drivingLicenseNumber: true })}
                  />
                  {validation.drivingLicenseNumber && !isRequired(drivingLicenseNumber) ? <Typography color="error">License number is required!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="normal" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="companies"
                      key={companies}
                      options={companies}
                      defaultValue={selectedDriver ? selectedDriver.Vendor : ''}
                      renderInput={(params) => <TextField {...params} label="Vendor" variant="outlined" />}
                      getOptionLabel={(vendor) => vendor.name}
                      onBlur={e => setValidation({ ...validation, vendorId: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setVendorId(newValue.id)
                      }}
                    />
                    {validation.vendorId && !isRequired(vendorId) ? <Typography color="error">Vendor is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                      <MaskedInput
                      className={clsx({ ["mask-text"]: true })}
                      // guide={true}
                      // showMask={true}
                      variant="outlined"
                      name="phone"
                      mask={phoneNumberMask}
                      label="Driver Phone"
                      id="driverPhone"
                      type="text"
                      value={driverPhone}
                      placeholder="Driver Phone(e.g 032*-*******)"
                      onChange={(e) => {
                        setDriverPhone(e.target.value);
                      }}
                      style={{
                        // padding: "22px 10px",
                        // color: "#2f2727",
                        // fontWeight: 600,
                        // borderColor: "rgba(0,0,0,0.3)",
                        height: "17%",
                        width: "90%",
                        marginLeft: 0,
                        marginTop: 6,
                        borderColor: "#c4c4c4",
                        color: "#2f2727",
                        fontWeight: 600,
                        padding: "17px 12px"
                      }}
                      onBlur={(e) => setValidation({ ...validation, driverPhone: true })}
                    />
                    {validation.driverPhone && !isRequired(driverPhone) ? <Typography color="error">Phone number is required!</Typography> : ''}
                    {validation.driverPhone && !isPhone(driverPhone.replace(/-/g, "")) && isRequired(driverPhone) ? <Typography color="error">Incorrect Phone number!</Typography> : ''}
                    {/* {validation.driverPhone && !isPhone(driverPhone) && isRequired(driverPhone) ? <Typography color="error">Format: 0343XXXXX79</Typography> : ''} */}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <TextField
                    fullWidth={true}
                    inputProps={{ className: classes.textBox }}
                    className={classes.labelBox}
                    margin="dense"
                    id="cnic"
                    label="CNIC"
                    type="text"
                    variant="outlined"
                    value={cnicNumber}
                    placeholder="99999-9999999-3"
                    onChange={e => setCNICNumber(e.target.value)}
                    onBlur={e => setValidation({ ...validation, cnicNumber: true })}
                  />
                  {validation.cnicNumber && !isRequired(cnicNumber) ? <Typography color="error">CNIC number is required!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Button
                      variant="contained"
                      component="label"
                      color={((selectedDriver && selectedDriver.drivingLicenseId) || drivingLicenseImage) ? 'primary' : 'default'}
                      startIcon={<CloudUploadIcon />}
                    >
                      Driving License {((selectedDriver && selectedDriver.drivingLicenseId) || drivingLicenseImage) ? 'Uploaded' : ''}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => validateDrivingLicenceImage(e)}
                        accept=".jpg,.png,.jpeg"
                      />
                    </Button>
                    {!(selectedDriver && selectedDriver.drivingLicenseId) && validation.drivingLicenseImage && !isRequired(drivingLicenseImage) ? <Typography color="error">Driving License is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Button
                      variant="contained"
                      component="label"
                      color={((selectedDriver && selectedDriver.cnicId) || CNICImage) ? 'primary' : 'default'}
                      startIcon={<CloudUploadIcon />}
                    >
                      CNIC Image {((selectedDriver && selectedDriver.cnicId) || CNICImage) ? 'Uploaded' : ''}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => validateCnicImage(e)}
                        accept=".jpg,.png,.jpeg"
                      />
                    </Button>
                    {!(selectedDriver && selectedDriver.cnicId) && validation.CNICImage && !isRequired(CNICImage) ? <Typography color="error">CNIC image is required!</Typography> : ''}
                  </FormControl>
                </Grid>

              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedDriver ? 'Add Driver' : 'Update Driver'}
            </Button>
          </DialogActions>

        </Dialog>
      </form>
    </div>
  )
}

export default AddDriverView
