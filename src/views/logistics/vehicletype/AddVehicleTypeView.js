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
import { isRequired } from '../../../utils/validators';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// import { upload } from '../../../utils/upload';
import { useNavigate, useLocation } from 'react-router';
import { Autocomplete } from '@material-ui/lab';



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

function AddVehicleTypeView({ selectedVehicleType, formErrors, open, handleClose, addVehicleType, carmakes, carmodels, types }) {
  const [validation, setValidation] = useState({});
  const { state } = useLocation();
  const { viewOnly } = state || '';
  const classes = useStyles();
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [makeid, setCarMakeId] = useState('')
  const [carMake, setCarMake] = useState('')
  const [modelid, setCarModelId] = useState('')
  const [carModel, setCarModel] = useState('')
  const [typeid, setTypeId] = useState('')
  const [catType, setCatType] = useState('')

  useEffect(() => {
    if (open)
      resetLocalStates()
    if (selectedVehicleType) {
      setCarMakeId(selectedVehicleType ? selectedVehicleType.makeId : '');
      setCarMake(selectedVehicleType ? selectedVehicleType.CarMake.name : '');
      setCarModelId(selectedVehicleType ? selectedVehicleType.modelId : '');
      setCarModel(selectedVehicleType ? selectedVehicleType.CarModel.name : '');
      setTypeId(selectedVehicleType ? selectedVehicleType.vehicleTypeId : '');
      setCatType(selectedVehicleType ? selectedVehicleType.VehicleType.name : '')
    }
    else {
      resetLocalStates()
    }
  }, [open])

  useEffect(() => {
    if (!!selectedVehicleType) {
      setCarMakeId(selectedVehicleType.makeId || '');
      setCarMake(selectedVehicleType.CarMake.name || '');
      setCarModelId(selectedVehicleType.modelId || '');
      setCarModel(selectedVehicleType.CarModel.name || '');
      setTypeId(selectedVehicleType.vehicleTypeId || '');
      setCatType(selectedVehicleType.VehicleType.name || '')
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
      makeId: makeid,
      modelId: modelid,
      vehicleTypeId: typeid
    }

    setValidation({
      makeid: true,
      modelid: true,
      typeid: true
    });

    if (isRequired(typeid) &&
      isRequired(makeid) &&
      isRequired(modelid)) {

      try {
        await addVehicleType(newVehicleType);
      } catch (err) {
        // setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
      }
    }
  }
  return (

    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth="sm">
          <DialogTitle>
            {!selectedVehicleType ? 'Add Vehicle Type' : 'Edit Vehicle Type'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container >
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="makeid"
                      key={carmakes}
                      options={carmakes}
                      defaultValue={!!selectedVehicleType && !!selectedVehicleType.CarMake ? selectedVehicleType.CarMake : ''}
                      renderInput={(params) => <TextField {...params} label="Car Make" variant="outlined" />}
                      getOptionLabel={(carmake) => carmake.name || ""}
                      onBlur={e => setValidation({ ...validation, makeid: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setCarMakeId(newValue.id)
                      }}
                    />
                    {validation.makeid && !isRequired(makeid) ? <Typography color="error">Car Make is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="modelid"
                      key={carmodels}
                      options={carmodels}
                      defaultValue={!!selectedVehicleType && !!selectedVehicleType.CarModel ? selectedVehicleType.CarModel : ''}
                      renderInput={(params) => <TextField {...params} label="Car Model" variant="outlined" />}
                      getOptionLabel={(carmodel) => carmodel.name || ""}
                      onBlur={e => setValidation({ ...validation, modelid: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setCarModelId(newValue.id)
                      }}
                    />
                    {validation.modelid && !isRequired(modelid) ? <Typography color="error">Car Model is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="typeid"
                      key={types}
                      options={types}
                      defaultValue={!!selectedVehicleType && !!selectedVehicleType.VehicleType ? selectedVehicleType.VehicleType : ''}
                      renderInput={(params) => <TextField {...params} label="Vehicle Category" variant="outlined" />}
                      getOptionLabel={(type) => type.name || ""}
                      onBlur={e => setValidation({ ...validation, typeid: true })}
                      onChange={(event, newValue) => {
                        if (newValue)
                          setTypeId(newValue.id)
                      }}
                    />
                    {validation.typeid && !isRequired(typeid) ? <Typography color="error">Vehicle Category is required!</Typography> : ''}
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