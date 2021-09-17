import {
    makeStyles,
    TextField,
    Grid,
    InputBase,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@material-ui/core';
import React, { useState, useCallback, useEffect } from 'react'
import TableHeader from '../../../components/TableHeader';
import { Alert, Pagination } from '@material-ui/lab';
import MessageSnackbar from '../../../components/MessageSnackbar';
// import AddVehicleView from './AddVehicleView';
// import VehicleDetailsView from './VehicleDetailsView';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import { isChar, isPhone, isRequired } from '../../../utils/validators';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { upload } from '../../../utils/upload';
import { useNavigate,useLocation } from 'react-router';
// import { isRequired } from '../../../utils/validators';



const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginBottom: '20px'
    },
    container: {
        // maxHeight: 450,
        padding: 20,
    },
    active: {
        color: theme.palette.success.main
    },
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        padding: '0px 8px',
        marginRight: 7,
        height: 30,
    },
}))

function AddVehicleTypeView({selectedVehicleType, companies, formErrors, open, handleClose, addVehicleType, cars }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { viewOnly } = state || '';
    const classes = useStyles();
    // const [selectedVehicleType, setSelectedVehicleType] = useState(state ? state.selectedVehicleType : null);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [showMessage, setShowMessage] = useState(null)
    const [addVehicleTypeView, setAddVehicleTypeView] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('');

    const [make, setCarMake] = useState('')
  const [model, setCarModel] = useState('')
  const [vehicletype, setVehicleType] = useState({});
  const [vehiclename, setVehicleName] = useState('')
  const [carName, setCarName] = useState('')
  const [vendorId, setVendorId] = useState(null)
  const [carId, setCarId] = useState('')
  const [cnicNumber, setCNICNumber] = useState('')
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('')
  const [drivingLicenseImage, setDrivingLicenseImage] = useState(null)
  const [CNICImage, setCNICImage] = useState(null)
  useEffect(() => {
    if (open)
      resetLocalStates()
    if (selectedVehicleType) {
        setCarMake(selectedVehicleType ? selectedVehicleType.makeid : '');
        setCarModel(selectedVehicleType ? selectedVehicleType.modelid : '');
        setVehicleType(selectedVehicleType ? selectedVehicleType.vehicletype : '');
        setVehicleName(selectedVehicleType ? selectedVehicleType.vehiclename : '');
    
    }
    else {
      resetLocalStates()
    }
  }, [open])

  useEffect(() => {
    if (carId) {
      cars.forEach(car => {
        if (car.id === carId) {
          setCarId(car.car)
        }
      });
    }
  }, [carId])

  useEffect(() => {
    if (!!selectedVehicleType) {
    //   setQuantity(0);
      setCarMake(selectedVehicleType.make || '');
      setCarModel(selectedVehicleType.model || '');
      setVehicleType(selectedVehicleType.vehicletype || '');
      setVehicleName(selectedVehicleType.vehiclename || '');
    }
  }, [selectedVehicleType]);

  const resetLocalStates = () => {
    setCarMake('');
    setCarModel('');
    // setValidation({});
    // setDrivingLicenseNumber('');
    setVehicleType('');
    setVehicleName('');
   
  }
  const handleSubmit = async () => {
    // navigate('/logistics/vehicle-type')
    // alert('Working')
    const newVehicleType = {
        make : make,
        model : model,
        vehicletype : vehicletype,
        vehiclename : vehiclename,
        // makeid,
        // modelid,
        // vehicletype,
        // vehiclename,
    }
//     return(<Link
//     to={{
//         pathname: "/page",
//         state: data // your data array of objects
//     }}
// >);

    // navigate('/logistics/vehicle-type',newVehicleType)
    // alert(newVehicleType)
    // console.log(newVehicleType)
    // console.log(this.state.makeid)

    // const newDriver = {
    //   name: driverName,
    //   phone: driverPhone,
    //   drivingLicenseNumber: drivingLicenseNumber,
    //   companyId: vendorId,
    //   cnicNumber: cnicNumber,
    //   drivingLicenseId: selectedDriver && selectedDriver.drivingLicenseId,
    //   cnicId: selectedDriver && selectedDriver.cnicId,
    // }
    // setValidation({
    //   driverName: true,
    //   driverPhone: true,
    //   validation: true,
    //   drivingLicenseNumber: true,
    //   vendorId: true,
    //   cnicNumber: true,
    //   drivingLicenseImage: true,
    //   CNICImage: true,
    // });

    if (isRequired(carId) &&
    isRequired(make) &&
    isRequired(model) 
    // &&
    // isRequired(carId)
    ) 
    {

    // if (runningPaperImage) [newVehicle.runningPaperId] = await upload([runningPaperImage], 'vehicle');
    // if (routePermitImage) [newVehicle.routePermitId] = await upload([routePermitImage], 'vehicle');

    // if (!isRequired(newVehicle.runningPaperId) || !isRequired(newVehicle.routePermitId)) return

    try {
      await addVehicleType(newVehicleType);
    } catch (err) {
      // setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
    }
  }
  }




    const searchInput = <InputBase
        placeholder="Search"
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        onChange={e => setSearchKeyword(e.target.value)}
        />;

    const headerButtons = []
    return(

        <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedVehicleType ? 'Add Vehicle Type' : 'Edit Vehicle Type'}
          </DialogTitle>
          <DialogContent>
            {/* {formErrors}
            <Grid container> */}
              {/* <Grid container spacing={2}> */}
                {/* <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      fullWidth={true}
                      id="vendorId"
                      label="Vendor"
                      variant="outlined"
                      value={vendorId}
                      onChange={e => setVendorId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, vendorId: true })}
                    >
                      {
                        vendorId && vendorId !== "" ?
                          <MenuItem value={vendorId} disabled>{vendorName}</MenuItem>
                          :
                          <MenuItem value={""} disabled>Select Vendor</MenuItem>
                      }
                      {companies.map(vendor => <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>)}
                    </Select>
                    {validation.vendorId && !isRequired(vendorId) ? <Typography color="error">Vendor is required!</Typography> : ''}
                  </FormControl>
                </Grid> */}
                {/* <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Driver</InputLabel>
                    <Select
                      fullWidth={true}
                      id="driverId"
                      label="Driver"
                      variant="outlined"
                      value={driverId}
                      onChange={e => setDriverId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, driverId: true })}
                    >
                      {
                        driverId && driverId !== "" ?
                          <MenuItem value={driverId} disabled>{driverName}</MenuItem>
                          :
                          <MenuItem value={""} disabled>Select Driver</MenuItem>
                      }
                      {drivers.map(driver => <MenuItem key={driver.id} value={driver.id}>{driver.name}</MenuItem>)}
                    </Select>
                    {validation.driverId && !isRequired(driverId) ? <Typography color="error">Driver is required!</Typography> : ''}
                  </FormControl>
                </Grid> */}
              {/* </Grid> */}
              {/* <Grid container spacing={2}>
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
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                      fullWidth={true}
                      id="modelId"
                      label="Vehicle type"
                      variant="outlined"
                      value={carId}
                      onChange={e => setCarId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, modelId: true })}
                    >
                      {
                        carId && carId !== "" ?
                          <MenuItem value={carId} disabled>{carName}</MenuItem>
                          :
                          <MenuItem value={""} disabled>Select vehicle type</MenuItem>
                      }
                      {cars.map(car => <MenuItem key={car.id} value={car.id}> {`${car.CarMake.name} ${car.CarModel.name}`} </MenuItem>)}
                    </Select>
                    {validation.carId && !isRequired(carId) ? <Typography color="error">Vehicle type is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>

              
            </Grid> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedVehicleType ? 'Add Vehicle' : 'Update Vehicle'}
            </Button>
          </DialogActions>

        </Dialog>
      </form>
    </div >

    );
}

export default AddVehicleTypeView