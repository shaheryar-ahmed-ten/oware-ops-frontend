import React, { useEffect, useState } from 'react'
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
  Typography
} from '@material-ui/core'
import { isRequired } from '../../../utils/validators';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { upload } from '../../../utils/upload';
import { Autocomplete } from '@material-ui/lab';

function AddVehicleView({ selectedVehicle, formErrors, open, handleClose, companies, addVehicle, cars }) {
  const [validation, setValidation] = useState({});
  const [vendorName, setVendorName] = useState('')
  const [vendorId, setVendorId] = useState(null)
  const [driverName, setDriverName] = useState('')
  const [driverId, setDriverId] = useState(null)
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [carName, setCarName] = useState('')
  const [carId, setCarId] = useState('')
  const [runningPaperImage, setRunningPaperImage] = useState(null)
  const [routePermitImage, setRoutePermit] = useState(null)
  const [drivers, setDrivers] = useState([])


  cars.sort(function (a, b) {
    var nameA = a.CarMake.name[0].toUpperCase(); // ignore upper and lowercase
    var nameB = b.CarMake.name[0].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  useEffect(() => {
    if (open)
      resetLocalStates()
    if (!!selectedVehicle) {
      setVendorName(selectedVehicle.Vendor ? selectedVehicle.Vendor.name : '');
      setVendorId(selectedVehicle.Vendor ? selectedVehicle.Vendor.id : '');
      setDriverName(selectedVehicle.Driver ? selectedVehicle.Driver.name : '');
      setDriverId(selectedVehicle.Driver ? selectedVehicle.Driver.id : '');
      setRegistrationNumber(selectedVehicle ? selectedVehicle.registrationNumber : '');
      setCarName(selectedVehicle.Car && selectedVehicle.Car.CarMake && selectedVehicle.Car.CarModel ? selectedVehicle.Car.CarMake.name + " " + selectedVehicle.Car.CarModel.name : '');
      setCarId(selectedVehicle.Car ? selectedVehicle.Car.id : '');
    }
    else {
      resetLocalStates()
    }
  }, [open])

  useEffect(() => {
    if (vendorId) {
      companies.forEach(company => {
        if (company.id === vendorId) {
          setDrivers(company.Drivers)
        }
      });
    }
  }, [vendorId])

  const resetLocalStates = () => {
    setValidation({});
    setVendorName('');
    setVendorId(null);
    setDriverName('');
    setDriverId(null);
    setRegistrationNumber('');
    setCarName('');
    setCarId(null);
    setRunningPaperImage(null);
    setRoutePermit(null);
  }

  const handleSubmit = async () => {
    let newVehicle = {
      companyId: vendorId,
      driverId: driverId,
      registrationNumber: registrationNumber,
      carId: carId,
      runningPaperId: selectedVehicle && selectedVehicle.runningPaperId,
      routePermitId: selectedVehicle && selectedVehicle.routePermitId,
    }
    setValidation({
      vendorId: true,
      driverId: true,
      registrationNumber: true,
      make: true,
      model: true,
      runningPaperImage: true,
      routePermitImage: true
    });


    if (isRequired(vendorId) &&
      isRequired(driverId) &&
      isRequired(registrationNumber) &&
      isRequired(carId)) {

      if (runningPaperImage) [newVehicle.runningPaperId] = await upload([runningPaperImage], 'vehicle');
      if (routePermitImage) [newVehicle.routePermitId] = await upload([routePermitImage], 'vehicle');

      if (!isRequired(newVehicle.runningPaperId) || !isRequired(newVehicle.routePermitId)) return

      try {
        await addVehicle(newVehicle);
      } catch (err) {
        // setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
      }
    }
  }


  const validateRunningPaperImage = (event) => {
    const checkFile = event.target.files[0];
    // let dimentions
    if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      alert("Running Paper image must be only image file!")
      return false;
    }
    const isLt2M = checkFile.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      alert("Running Paper image must smaller than 1MB!");
      return false;
    }
    setRunningPaperImage(checkFile)
  }

  const validatePermitFileImage = (event) => {
    const checkFile = event.target.files[0];
    if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      alert("Route Permit image must be only image file!")
      return false;
    }
    const isLt2M = checkFile.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      alert("Route Permit image must smaller than 1MB!");
      return false;
    }
    setRoutePermit(checkFile)
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedVehicle ? 'Add Vehicle' : 'Edit Vehicle'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="vendorId"
                      key={vendorId}
                      options={companies}
                      defaultValue={!!selectedVehicle ? { name: selectedVehicle.Vendor.name, id: selectedVehicle.Vendor.id } : ''}
                      renderInput={(params) => <TextField {...params} label="Vendor" variant="outlined" />}
                      getOptionLabel={(vendor) => vendor.name || ""}
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
                    <Autocomplete
                      id="driverId"
                      key={driverId}
                      options={drivers}
                      defaultValue={!!selectedVehicle ? { name: selectedVehicle.Driver.name, id: selectedVehicle.Driver.id } : ''}
                      renderInput={(params) => <TextField {...params} label="Driver" variant="outlined" />}
                      getOptionLabel={(vendor) => vendor.name || ""}
                      onBlur={e => setValidation({ ...validation, driverId: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setDriverId(newValue.id)
                      }}
                    />
                    {validation.driverId && !isRequired(driverId) ? <Typography color="error">Driver is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="RegistrationNumber"
                    label="Registration Number"
                    type="text"
                    variant="outlined"
                    value={registrationNumber}
                    onChange={e => {
                      const regex = /^[a-zA-Z0-9_-]*$/
                      if (regex.test(e.target.value))
                        setRegistrationNumber(e.target.value)
                    }}
                    onBlur={e => setValidation({ ...validation, registrationNumber: true })}
                  />
                  {validation.registrationNumber && !isRequired(registrationNumber) ? <Typography color="error">Registraion Number is required!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    {!!selectedVehicle ? console.log(selectedVehicle.Car.CarMake.name, selectedVehicle.Car.CarModel.name) : ''}
                    <Autocomplete
                      id="carId"
                      key={carId}
                      options={cars}
                      defaultValue={!!selectedVehicle ? { name: `${selectedVehicle.Car.CarMake.name} ${selectedVehicle.Car.CarModel.name}`, id: selectedVehicle.Car.id } : ''}
                      renderInput={(params) => <TextField {...params} label="Vehicle Type" variant="outlined" />}
                      getOptionLabel={(car) => {
                        return (
                          car && car.name ?
                            car.name
                            :
                            car && car.CarMake && car.CarModel ?
                              `${car.CarMake.name} ${car.CarModel.name}`
                              :
                              ''
                        )
                      }}
                      onBlur={e => setValidation({ ...validation, modelId: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setCarId(newValue.id)
                      }}
                    />
                    {validation.carId && !isRequired(carId) ? <Typography color="error">Vehicle type is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Button
                      variant="contained"
                      component="label"
                      color={((selectedVehicle && selectedVehicle.runningPaperId) || runningPaperImage) ? 'primary' : 'default'}
                      startIcon={<CloudUploadIcon />}
                    >
                      Running Paper {((selectedVehicle && selectedVehicle.runningPaperId) || runningPaperImage) ? 'Uploaded' : ''}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => validateRunningPaperImage(e)}
                        accept=".jpg,.png,.jpeg"
                      />
                    </Button>
                    {!(selectedVehicle && selectedVehicle.runningPaperId) && validation.runningPaperImage && !isRequired(runningPaperImage) ? <Typography color="error">Running paper is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Button
                      variant="contained"
                      component="label"
                      color={((selectedVehicle && selectedVehicle.routePermitId) || routePermitImage) ? 'primary' : 'default'}
                      startIcon={<CloudUploadIcon />}
                    >
                      Route Permit {((selectedVehicle && selectedVehicle.routePermitId) || routePermitImage) ? 'Uploaded' : ''}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => validatePermitFileImage(e)}
                        accept=".jpg,.png,.jpeg"
                      />
                    </Button>
                    {validation.routePermitImage && !isRequired(routePermitImage) ? <Typography color="error">Route Permit is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedVehicle ? 'Add Vehicle' : 'Update Vehicle'}
            </Button>
          </DialogActions>

        </Dialog>
      </form>
    </div >
  )
}

export default AddVehicleView
