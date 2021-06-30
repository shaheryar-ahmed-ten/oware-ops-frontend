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

function AddVehicleView({ selectedVehicle, formErrors, open, handleClose, companies, addVehicleImages, addVehicle, cars }) {
    const [validation, setValidation] = useState({});
    const [vendorName, setVendorName] = useState('')
    const [vendorId, setVendorId] = useState(null)
    const [driverName, setDriverName] = useState('')
    const [driverId, setDriverId] = useState(null)
    const [registrationNumber, setRegistrationNumber] = useState('')
    const [carName, setCarName] = useState('')
    const [carId, setCarId] = useState('')
    const [runningPaper, setRunningPaper] = useState(null)
    const [routePermit, setRoutePermit] = useState(null)
    const [drivers, setDrivers] = useState([])

    useEffect(() => {
        if (open)
            resetLocalStates()
        if (selectedVehicle) {
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
        setRunningPaper(null);
        setRoutePermit(null);
    }

    const handleSubmit = async () => {
        let newVehicle = {
            companyId: vendorId,
            driverId: driverId,
            registrationNumber: registrationNumber,
            carId: carId
        }
        const runningPaperImage = {
            image: runningPaper
        }
        const routePermitImage = {
            image: routePermit
        }
        setValidation({
            vendorId: true,
            driverId: true,
            registrationNumber: true,
            make: true,
            model: true,
            runningPaper: true,
            routePermit: true
        });
        if (isRequired(vendorId) &&
            isRequired(driverId) &&
            isRequired(registrationNumber) &&
            isRequired(carId)) {
            let fileIds = await addVehicleImages(runningPaperImage.image, routePermitImage.image, newVehicle)
            newVehicle = { ...newVehicle, ...fileIds }
            await addVehicle(newVehicle);
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
                                        onChange={e => setRegistrationNumber(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, registrationNumber: true })}
                                    />
                                    {validation.registrationNumber && !isRequired(registrationNumber) ? <Typography color="error">Registraion Number is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Car</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="modelId"
                                            label="Model"
                                            variant="outlined"
                                            value={carId}
                                            onChange={e => setCarId(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, modelId: true })}
                                        >
                                            {
                                                carId && carId !== "" ?
                                                    <MenuItem value={carId} disabled>{carName}</MenuItem>
                                                    :
                                                    <MenuItem value={""} disabled>Select Car</MenuItem>
                                            }
                                            {cars.map(car => <MenuItem key={car.id} value={car.id}> {`${car.CarMake.name} ${car.CarModel.name}`} </MenuItem>)}
                                        </Select>
                                        {validation.carId && !isRequired(carId) ? <Typography color="error">Car is required!</Typography> : ''}
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
