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
    Divider
} from '@material-ui/core'
import { isPhone, isRequired } from '../../../utils/validators';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useEffect, useState } from 'react'
import { dateToPickerFormat } from '../../../utils/common';

function AddRideView({ selectedRide, formErrors, open, handleClose, Vehicles, PickupZones, PickupAreas, PickupCities, DropoffZones, DropoffAreas, DropoffCities, ProductCategories }) {
    const [validation, setValidation] = useState({});
    const [customerName, setCustomerName] = useState('')
    const [driverName, setDriverName] = useState('')
    const [vehicle, setVehicle] = useState('')
    const [pickupAddress, setPickupAddress] = useState('')
    const [pickupZone, setPickupZone] = useState('')
    const [pickupArea, setPickupArea] = useState('')
    const [pickupCity, setPickupCity] = useState('')
    const [dropoffAddress, setDropoffAddress] = useState('')
    const [dropoffZone, setDropoffZone] = useState('')
    const [dropoffArea, setDropoffArea] = useState('')
    const [dropoffCity, setDropoffCity] = useState('')
    const [pickupDateTime, setPickupDateTime] = useState(dateToPickerFormat(new Date()))
    const [dropoffDateTime, setDropoffDateTime] = useState(dateToPickerFormat(new Date()))
    const [productCategory, setProductCategory] = useState('')
    const [productName, setProductName] = useState('')
    const [productQuantity, setProductQuantity] = useState('')
    const handleSubmit = () => {

    }
    return (
        <div style={{ display: "inline" }}>
            <form>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle>
                        {!selectedRide ? 'Add Ride' : 'Edit Ride'}
                    </DialogTitle>
                    <DialogContent>
                        {formErrors}
                        <Grid container>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="customerName"
                                        label="Customer Name"
                                        type="text"
                                        variant="outlined"
                                        value={customerName}
                                        disabled={!!selectedRide}
                                        onChange={e => setCustomerName(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, customerName: true })}
                                    />
                                    {validation.customerName && !isRequired(customerName) ? <Typography color="error">Customer name is required!</Typography> : ''}
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="driverName"
                                        label="Driver Name"
                                        type="text"
                                        variant="outlined"
                                        value={driverName}
                                        disabled={!!selectedRide}
                                        onChange={e => setDriverName(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, driverName: true })}
                                    />
                                    {validation.driverName && !isRequired(driverName) ? <Typography color="error">Driver is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Vehicle</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="vehicle"
                                            label="Vehicle"
                                            variant="outlined"
                                            value={vehicle}
                                            disabled={!!selectedRide}
                                            onChange={e => setVehicle(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, vehicle: true })}
                                        >
                                            <MenuItem value="" disabled>Select Vehicle</MenuItem>
                                            {Vehicles.map(vehicle => <MenuItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</MenuItem>)}
                                        </Select>
                                        {validation.vehicle && !isRequired(vehicle) ? <Typography color="error">Vehicle is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="pickupAddress"
                                        label="Pickup Address"
                                        type="text"
                                        variant="outlined"
                                        value={pickupAddress}
                                        disabled={!!selectedRide}
                                        onChange={e => setPickupAddress(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, pickupAddress: true })}
                                    />
                                    {validation.pickupAddress && !isRequired(pickupAddress) ? <Typography color="error">Pickup Address is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Pickup Zone</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="pickupZone"
                                            label="Pickup Zone"
                                            variant="outlined"
                                            value={pickupZone}
                                            disabled={!!selectedRide}
                                            onChange={e => setPickupZone(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, pickupZone: true })}
                                        >
                                            <MenuItem value="" disabled>Select Pickup Zone</MenuItem>
                                            {PickupZones.map(pickupZone => <MenuItem key={pickupZone.id} value={pickupZone.id}>{pickupZone.name}</MenuItem>)}
                                        </Select>
                                        {validation.pickupZone && !isRequired(pickupZone) ? <Typography color="error">Pickup Zone is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Pickup Area</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="pickupArea"
                                            label="Pickup Area"
                                            variant="outlined"
                                            value={pickupArea}
                                            disabled={!!selectedRide}
                                            onChange={e => setPickupArea(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, pickupArea: true })}
                                        >
                                            <MenuItem value="" disabled>Select Pickup Area</MenuItem>
                                            {PickupAreas.map(pickupArea => <MenuItem key={pickupArea.id} value={pickupArea.id}>{pickupArea.name}</MenuItem>)}
                                        </Select>
                                        {validation.pickupArea && !isRequired(pickupArea) ? <Typography color="error">Pickup Area is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Pickup City</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="pickupCity"
                                            label="Pickup Zone"
                                            variant="outlined"
                                            value={pickupCity}
                                            disabled={!!selectedRide}
                                            onChange={e => setPickupCity(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, pickupCity: true })}
                                        >
                                            <MenuItem value="" disabled>Select Pickup Zone</MenuItem>
                                            {PickupCities.map(pickupCity => <MenuItem key={pickupCity.id} value={pickupCity.id}>{pickupCity.name}</MenuItem>)}
                                        </Select>
                                        {validation.pickupCity && !isRequired(pickupCity) ? <Typography color="error">Pickup Area is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="dropoffAddress"
                                        label="Dropoff Address"
                                        type="text"
                                        variant="outlined"
                                        value={dropoffAddress}
                                        disabled={!!selectedRide}
                                        onChange={e => setDropoffAddress(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, dropoffAddress: true })}
                                    />
                                    {validation.dropoffAddress && !isRequired(dropoffAddress) ? <Typography color="error">Dropoff Address is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Dropoff Zone</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="pickupZone"
                                            label="Pickup Zone"
                                            variant="outlined"
                                            value={dropoffZone}
                                            disabled={!!selectedRide}
                                            onChange={e => setDropoffZone(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, dropoffZone: true })}
                                        >
                                            <MenuItem value="" disabled>Select Pickup Zone</MenuItem>
                                            {DropoffZones.map(dropoffZone => <MenuItem key={dropoffZone.id} value={dropoffZone.id}>{dropoffZone.name}</MenuItem>)}
                                        </Select>
                                        {validation.dropoffZone && !isRequired(dropoffZone) ? <Typography color="error">Dropoff Zone is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Dropoff Area</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="pickupArea"
                                            label="Pickup Area"
                                            variant="outlined"
                                            value={dropoffArea}
                                            disabled={!!selectedRide}
                                            onChange={e => setDropoffArea(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, dropoffArea: true })}
                                        >
                                            <MenuItem value="" disabled>Select Pickup Area</MenuItem>
                                            {DropoffAreas.map(dropoffArea => <MenuItem key={dropoffArea.id} value={dropoffArea.id}>{dropoffArea.name}</MenuItem>)}
                                        </Select>
                                        {validation.dropoffArea && !isRequired(dropoffArea) ? <Typography color="error">Dropoff Area is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Dropoff City</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="pickupCity"
                                            label="Dropoff City"
                                            variant="outlined"
                                            value={dropoffCity}
                                            disabled={!!selectedRide}
                                            onChange={e => setDropoffCity(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, dropoffCity: true })}
                                        >
                                            <MenuItem value="" disabled>Select Dropoff City</MenuItem>
                                            {DropoffCities.map(dropoffCity => <MenuItem key={dropoffCity.id} value={dropoffCity.id}>{dropoffCity.name}</MenuItem>)}
                                        </Select>
                                        {validation.dropoffCity && !isRequired(dropoffCity) ? <Typography color="error">Dropoff City is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="pickupDate&Time"
                                        label="Pickup Date & Time"
                                        type="datetime-local"
                                        variant="outlined"
                                        value={pickupDateTime}
                                        onChange={e => setPickupDateTime(dateToPickerFormat(e.target.value))}
                                        onBlur={e => setValidation({ ...validation, pickupDateTime: true })}
                                    />
                                    {validation.pickupDateTime && !isRequired(pickupDateTime) ? <Typography color="error">Pickup date & time is required!</Typography> : ''}
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="dropoffDate&Time"
                                        label="Dropoff Date & Time"
                                        type="datetime-local"
                                        variant="outlined"
                                        value={dropoffDateTime}
                                        onChange={e => setDropoffDateTime(dateToPickerFormat(e.target.value))}
                                        onBlur={e => setValidation({ ...validation, dropoffDateTime: true })}
                                    />
                                    {validation.dropoffDateTime && !isRequired(dropoffDateTime) ? <Typography color="error">Dropoff date & time is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Product Category</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="productCategory"
                                            label="Product Category"
                                            variant="outlined"
                                            value={productCategory}
                                            disabled={!!selectedRide}
                                            onChange={e => setProductCategory(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, productCategory: true })}
                                        >
                                            <MenuItem value="" disabled>Select Product Category</MenuItem>
                                            {ProductCategories.map(productCategory => <MenuItem key={productCategory.id} value={productCategory.id}>{productCategory.name}</MenuItem>)}
                                        </Select>
                                        {validation.productCategory && !isRequired(productCategory) ? <Typography color="error">Product Category is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="productName"
                                        label="Product Name"
                                        variant="outlined"
                                        value={productName}
                                        onChange={e => setProductName((e.target.value))}
                                        onBlur={e => setValidation({ ...validation, productName: true })}
                                    />
                                    {validation.productName && !isRequired(productName) ? <Typography color="error">Product Name is required!</Typography> : ''}
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="productQuantity"
                                        label="Product Quantity"
                                        variant="outlined"
                                        type="number"
                                        value={productQuantity}
                                        onChange={e => setProductQuantity((e.target.value))}
                                        onBlur={e => setValidation({ ...validation, productQuantity: true })}
                                    />
                                    {validation.productQuantity && !isRequired(productQuantity) ? <Typography color="error">Product quantity is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
                        <Button onClick={handleSubmit} color="primary" variant="contained">
                            {!selectedRide ? 'Add Ride' : 'Update Ride'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    )
}

export default AddRideView
