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

function AddVehicleTypeView({selectedDriver, companies, formErrors, open, handleClose, addDriver }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { viewOnly } = state || '';
    const classes = useStyles();
    const [selectedVehicleType, setSelectedVehicleType] = useState(state ? state.selectedVehicleType : null);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [showMessage, setShowMessage] = useState(null)
    const [addVehicleTypeView, setAddVehicleTypeView] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('');

    const [makeid, setCarMakeId] = useState('')
  const [modelid, setCarModelId] = useState('')
  const [vehicletype, setVehicleType] = useState({});
  const [vehiclename, setVehicleName] = useState('')
  const [vendorId, setVendorId] = useState(null)
  const [cnicNumber, setCNICNumber] = useState('')
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('')
  const [drivingLicenseImage, setDrivingLicenseImage] = useState(null)
  const [CNICImage, setCNICImage] = useState(null)
  useEffect(() => {
    if (open)
      resetLocalStates()
    if (selectedVehicleType) {
        setCarMakeId(selectedVehicleType ? selectedVehicleType.makeid : '');
        setCarModelId(selectedVehicleType ? selectedVehicleType.modelid : '');
        setVehicleType(selectedVehicleType ? selectedVehicleType.vehicletype : '');
        setVehicleName(selectedVehicleType ? selectedVehicleType.vehiclename : '');
    
    }
    else {
      resetLocalStates()
    }
  }, [open])

  useEffect(() => {
    if (!!selectedVehicleType) {
    //   setQuantity(0);
      setCarMakeId(selectedVehicleType.makeid || '');
      setCarModelId(selectedVehicleType.modelid || '');
      setVehicleType(selectedVehicleType.vehicletype || '');
      setVehicleName(selectedVehicleType.vehiclename || '');
    }
  }, [selectedVehicleType]);

  const resetLocalStates = () => {
    setCarMakeId('');
    setCarModelId('');
    // setValidation({});
    // setDrivingLicenseNumber('');
    setVehicleType('');
    setVehicleName('');
   
  }
  const handleSubmit = async () => {
    // navigate('/logistics/vehicle-type')
    // alert('Working')
    const newVehicleType = {
        // makeid : makeid,
        // modelid : modelid,
        // vehicletype : vehicletype,
        // vehiclename : vehiclename,
        makeid,
        modelid,
        vehicletype,
        vehiclename,
    }
//     return(<Link
//     to={{
//         pathname: "/page",
//         state: data // your data array of objects
//     }}
// >);

    navigate('/logistics/vehicle-type',newVehicleType)
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

    // if (isRequired(driverName) &&
    //   isRequired(driverPhone) &&
    //   isRequired(validation) &&
    //   isRequired(drivingLicenseNumber) &&
    //   isRequired(vendorId) &&
    //   isRequired(cnicNumber)) {

    //   if (drivingLicenseImage) [newDriver.drivingLicenseId] = await upload([drivingLicenseImage], 'driver');
    //   if (CNICImage) [newDriver.cnicId] = await upload([CNICImage], 'driver');

    //   if (!isRequired(newDriver.drivingLicenseId) || !isRequired(newDriver.cnicId)) return

    //   addDriver(newDriver);
    // }
  }

//   const validateDrivingLicenceImage = (event) => {
//     const checkFile = event.target.files[0];
//     // let dimentions
//     if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
//       alert("Driving lisence image must be only image file!")
//      return false;
//     }
//     const isLt2M = checkFile.size / 1024 / 1024 < 1;
//     if (!isLt2M) {
//       alert("Driving lisence image must smaller than 1MB!");
//       return false;
//     }  
//     setDrivingLicenseImage(checkFile)  
// }

//  const validateCnicImage  = (event) => {
//     const checkFile =  event.target.files[0];
//     if (!checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
//       alert("Driving lisence image must be only image file!")
//      return false;
//     }
//     const isLt2M = checkFile.size / 1024 / 1024 < 1;
//     if (!isLt2M) {
//       alert("Driving licence image must smaller than 1MB!");
//       return false;
//     } 
//     setCNICImage(checkFile)
//  }



    // const addVehicleTypeButton = <Button
    //     key={2}
    //     variant="contained"
    //     color="primary"
    //     size="small"
    //     onClick={}
    // >ADD VEHICLE TYPE</Button>;


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

        <Grid container className={classes.container} spacing={3}>
            <Grid container item xs={12} justifyContent="space-between">
            <Grid item xs={11}>
                <Typography variant="h3" className={classes.heading}>Add Vehicle Type</Typography>
            </Grid>
            <Grid item xs={1}>
                <Button variant="contained" color="primary" onClick={() => navigate('/logistics/vehicle-type')}>
                Cancel
                </Button>
            </Grid>
            </Grid>
       
            <Grid item sm={12}>
            <TextField
                fullWidth={true}
                margin="dense"
                id="makeid"
                label="Car Make"
                type="text"
                variant="outlined"
                value={makeid}
                disabled={viewOnly}
                onChange={e => setCarMakeId(e.target.value)}
                inputProps={{ maxLength: 30 }}
                // onBlur={e => setValidation({ ...validation, referenceId: true })}
            />
            {/* {validation.referenceId && !isRequired(referenceId) ? <Typography color="error">CarMake is required!</Typography> : ''} */}
            </Grid>
            <Grid item sm={12}>
            <TextField
                fullWidth={true}
                margin="dense"
                id="modelid"
                label="Car Model"
                type="text"
                variant="outlined"
                value={modelid}
                disabled={viewOnly}
                onChange={e => setCarModelId(e.target.value)}
                inputProps={{ maxLength: 30 }}
                // onBlur={e => setValidation({ ...validation, referenceId: true })}
            />
            {/* {validation.referenceId && !isRequired(referenceId) ? <Typography color="error">CarMake is required!</Typography> : ''} */}
            </Grid>
            <Grid item sm={12}>
            <TextField
                fullWidth={true}
                margin="dense"
                id="vehicletype"
                label="Vehicle Type"
                type="text"
                variant="outlined"
                value={vehicletype}
                disabled={viewOnly}
                onChange={e => setVehicleType(e.target.value)}
                inputProps={{ maxLength: 30 }}
                // onBlur={e => setValidation({ ...validation, referenceId: true })}
            />
            {/* {validation.referenceId && !isRequired(referenceId) ? <Typography color="error">CarMake is required!</Typography> : ''} */}
            </Grid>
            <Grid item sm={12}>
            <TextField
                fullWidth={true}
                margin="dense"
                id="vehiclename"
                label="Vehicle Name"
                type="text"
                variant="outlined"
                value={vehiclename}
                disabled={viewOnly}
                onChange={e => setVehicleName(e.target.value)}
                inputProps={{ maxLength: 30 }}
                // onBlur={e => setValidation({ ...validation, referenceId: true })}
            />
            {/* {validation.referenceId && !isRequired(referenceId) ? <Typography color="error">CarMake is required!</Typography> : ''} */}
            </Grid>
            
            {/* <Grid container className={classes.parentContainer} xs={12} spacing={3}> */}
                <Grid item xs={3}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    {/* {!selectedProductInward ? 'Add Products' : 'Update Product'} */}
                    </Button>
                </FormControl>
                </Grid>
            {/* </Grid> */}

    

      </Grid>

    );
}

export default AddVehicleTypeView