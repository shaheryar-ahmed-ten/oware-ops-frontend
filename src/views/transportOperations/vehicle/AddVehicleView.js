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

function AddVehicleView({ selectedVehicle, formErrors, open, handleClose, Vendors, Drivers, Makes, Models, Years, addVehicle }) {
    const [validation, setValidation] = useState({});
    const [vendorId, setVendorId] = useState(null)
    const [driverId, setDriverId] = useState(null)
    const [registrationNumber, setRegistrationNumber] = useState('')
    const [make, setMake] = useState('')
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')
    const [runningPaper, setRunningPaper] = useState(null)
    const [routePermit, setRoutePermit] = useState(null)

    useEffect(() => {
        if (open)
            resetLocalStates()
    }, [open])
    const resetLocalStates = () => {
        setValidation({});
        setVendorId(null);
        setDriverId(null);
        setRegistrationNumber('');
        setMake('');
        setModel('');
        setYear('');
        setRunningPaper(null);
        setRoutePermit(null);
    }

    const handleSubmit = () => {
        const newVehicle = {
            vendorId,
            driverId,
            registrationNumber,
            make,
            model,
            year,
            runningPaper,
            routePermit
        }
        setValidation({
            vendorId: true,
            driverId: true,
            registrationNumber: true,
            make: true,
            model: true,
            year: true,
            runningPaper: true,
            routePermit: true
        });
        if (isRequired(vendorId) &&
            isRequired(driverId) &&
            isRequired(registrationNumber) &&
            isRequired(make) &&
            isRequired(model) &&
            isRequired(year) &&
            isRequired(runningPaper) &&
            isRequired(routePermit)) {
            addVehicle(newVehicle);
        }
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
                                        <InputLabel>Vendor</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="vendorId"
                                            label="Vendor"
                                            variant="outlined"
                                            value={vendorId}
                                            disabled={!!selectedVehicle}
                                            onChange={e => setVendorId(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, vendorId: true })}
                                        >
                                            <MenuItem value="" disabled>Select Vendor</MenuItem>
                                            {Vendors.map(vendor => <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>)}
                                        </Select>
                                        {validation.vendorId && !isRequired(vendorId) ? <Typography color="error">Vendor is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Driver</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="driverId"
                                            label="Driver"
                                            variant="outlined"
                                            value={driverId}
                                            disabled={!!selectedVehicle}
                                            onChange={e => setDriverId(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, driverId: true })}
                                        >
                                            <MenuItem value="" disabled>Select Vendor</MenuItem>
                                            {Drivers.map(driver => <MenuItem key={driver.id} value={driver.id}>{driver.name}</MenuItem>)}
                                        </Select>
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
                                        disabled={!!selectedVehicle}
                                        onChange={e => setRegistrationNumber(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, registrationNumber: true })}
                                    />
                                    {validation.registrationNumber && !isRequired(registrationNumber) ? <Typography color="error">Registraion Number is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Make</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="make"
                                            label="Make"
                                            variant="outlined"
                                            value={make}
                                            disabled={!!selectedVehicle}
                                            onChange={e => setMake(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, make: true })}
                                        >
                                            <MenuItem value="" disabled>Select Vendor</MenuItem>
                                            {Makes.map(make => <MenuItem key={make.id} value={make.id}>{make.name}</MenuItem>)}
                                        </Select>
                                        {validation.make && !isRequired(make) ? <Typography color="error">Make is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Model</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="modelId"
                                            label="Model"
                                            variant="outlined"
                                            value={model}
                                            disabled={!!selectedVehicle}
                                            onChange={e => setModel(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, model: true })}
                                        >
                                            <MenuItem value="" disabled>Select Model</MenuItem>
                                            {Models.map(model => <MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>)}
                                        </Select>
                                        {validation.model && !isRequired(model) ? <Typography color="error">Model is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="year"
                                            label="Year"
                                            variant="outlined"
                                            value={year}
                                            disabled={!!selectedVehicle}
                                            onChange={e => setYear(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, year: true })}
                                        >
                                            <MenuItem value="" disabled>Select Year</MenuItem>
                                            {Years.map(year => <MenuItem key={year.id} value={year.id}>{year.name}</MenuItem>)}
                                        </Select>
                                        {validation.year && !isRequired(year) ? <Typography color="error">Year is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={runningPaper ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Running Paper {runningPaper ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setRunningPaper(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.runningPaper && !isRequired(runningPaper) ? <Typography color="error">Running paper is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={routePermit ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Route Permit {routePermit ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setRoutePermit(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.routePermit && !isRequired(routePermit) ? <Typography color="error">Route Permit is required!</Typography> : ''}
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
        </div>
    )
}

export default AddVehicleView
