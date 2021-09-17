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
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import { isRequired } from '../../../utils/validators';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import { upload } from '../../../utils/upload';
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

function AddVehicleTypeView({selectedVehicleType, formErrors, open, handleClose, addVehicleType, carmakes, carmodels ,types }) {
    const [validation, setValidation] = useState({});
    const { state } = useLocation();
    const { viewOnly } = state || '';
    const classes = useStyles();
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
  const [makeid, setCarMakeId] = useState('')
  const [modelid, setCarModelId] = useState('')
  const [typeid, setTypeId] = useState('')

  useEffect(() => {
    if (open)
      resetLocalStates()
    if (selectedVehicleType) {
        setCarMakeId(selectedVehicleType ? selectedVehicleType.makeId : '');
        setCarModelId(selectedVehicleType ? selectedVehicleType.modelId : '');
        setTypeId(selectedVehicleType ? selectedVehicleType.vehicleTypeId : '');
    }
    else {
      resetLocalStates()
    }
  }, [open])

  useEffect(() => {
    if (!!selectedVehicleType) {
      setCarMakeId(selectedVehicleType.makeId || '');
      setCarModelId(selectedVehicleType.modelId || '');
      setTypeId(selectedVehicleType.vehicleTypeId || '');
    }
  }, [selectedVehicleType]);

  const resetLocalStates = () => {
    setCarMakeId('');
    setCarModelId('');
    setValidation({});
    setTypeId('');
   
  }
  const handleSubmit = async () => {
    const newVehicleType = {
        makeId : makeid,
        modelId : modelid,
        vehicleTypeId : typeid
    }

    setValidation({
      makeid: true,
      modelid: true,
      typeid: true
    });

    if (isRequired(typeid) &&
    isRequired(makeid) &&
    isRequired(modelid)) 
    {

    try {
      await addVehicleType(newVehicleType);
    } catch (err) {
      // setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
    }
  }
  }
    return(

        <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedVehicleType ? 'Add Vehicle Type' : 'Edit Vehicle Type'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container > 
               <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <FormControl margin="dense" fullWidth={true} variant="outlined">
                            <InputLabel>Car Make</InputLabel>
                            <Select
                            fullWidth={true}
                            id="makeid"
                            label="Car Make"
                            variant="outlined"
                            value={makeid}
                            onChange={e => setCarMakeId(e.target.value)}
                            onBlur={e => setValidation({ ...validation, makeid: true })}
                            >
                            {
                                makeid && makeid !== "" ?
                                <MenuItem value={makeid} disabled>{makeid}</MenuItem>
                                :
                                <MenuItem value={""} disabled>Select Car Make</MenuItem>
                            }
                            {carmakes && carmakes.map(carmake => <MenuItem key={carmake.id} value={carmake.id}>{carmake.name}</MenuItem>)}
                            </Select>
                            {validation.makeid && !isRequired(makeid) ? <Typography color="error">Car Make is required!</Typography> : ''}
                        </FormControl>
                    </Grid>
                    <Grid item sm={6}>
                        <FormControl margin="dense" fullWidth={true} variant="outlined">
                            <InputLabel>Car Model</InputLabel>
                            <Select
                            fullWidth={true}
                            id="modelid"
                            label="Car Model"
                            variant="outlined"
                            value={modelid}
                            onChange={e => setCarModelId(e.target.value)}
                            onBlur={e => setValidation({ ...validation, modelid: true })}
                            >

                            {
                                modelid && modelid !== "" ?
                                <MenuItem value={modelid} disabled>{modelid}</MenuItem>
                                :
                                <MenuItem value={""} disabled>Select Car Model</MenuItem>
                            } 
                            {carmodels && carmodels.map(carmodel => <MenuItem key={carmodel.id} value={carmodel.id}>{carmodel.name}</MenuItem>)}
                            </Select>
                            {validation.modelid && !isRequired(modelid) ? <Typography color="error">Car Model is required!</Typography> : ''}
                        </FormControl>
                    </Grid> 
               </Grid>
               <Grid container spacing={2}>
                    <Grid item sm={12}>
                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                        <InputLabel>Type</InputLabel>
                        <Select
                        fullWidth={true}
                        id="typeid"
                        label="Vehicle Type"
                        variant="outlined"
                        value={typeid}
                        onChange={e => setTypeId(e.target.value)}
                        onBlur={e => setValidation({ ...validation, typeid: true })}
                        >
                        {
                            typeid && typeid !== "" ?
                            <MenuItem value={typeid} disabled>{typeid}</MenuItem>
                            :
                            <MenuItem value={""} disabled>Select Type</MenuItem>
                        }
                        {types && types.map(type => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
                        </Select>
                        {validation.typeid && !isRequired(typeid) ? <Typography color="error">Car Type is required!</Typography> : ''}
                    </FormControl>
                    </Grid>
               </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedVehicleType ? 'Add Vehicle Type' : 'Update Vehicle Type'}
            </Button>
          </DialogActions>

        </Dialog>
      </form>
    </div >

    );
}

export default AddVehicleTypeView