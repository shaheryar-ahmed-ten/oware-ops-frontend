import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core'
import { isRequired } from '../../../utils/validators';
import { dateToPickerFormat } from '../../../utils/common';

export default function AddRideView({ addRide, open, handleClose, selectedRide,
  vehicles, drivers, statuses, areas, companies, productCategories, formErrors }) {
  const [validation, setValidation] = useState({});
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [status, setStatus] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [pickupAreaId, setPickupAreaId] = useState('');
  const [dropoffAreaId, setDropoffAreaId] = useState('');
  const [productCategoryId, setProductCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedRide) {
      setStatus(selectedRide.status || '');
      setVehicleId(selectedRide.vehicleId || '');
      setDriverId(selectedRide.driverId || '');
      setPickupAddress(selectedRide.pickupAddress || '');
      setDropoffAddress(selectedRide.dropoffAddress || '');
      setCustomerId(selectedRide.customerId || '');
      setPickupAreaId(selectedRide.pickupAreaId || '');
      setDropoffAreaId(selectedRide.dropoffAreaId || '');
      setProductCategoryId(selectedRide.productCategoryId || '');
      setProductName(selectedRide.productName || '');
      setProductQuantity(selectedRide.productQuantity || '');
      setPickupDate(selectedRide.pickupDate || '');
      setDropoffDate(selectedRide.dropoffDate || '');
      setActive(!!selectedRide.isActive);
    } else {
      setStatus('');
      setVehicleId('');
      setDriverId('');
      setPickupAddress('');
      setDropoffAddress('');
      setCustomerId('');
      setPickupAreaId('');
      setDropoffAreaId('');
      setProductCategoryId('');
      setProductName('');
      setProductQuantity('');
      setPickupDate('');
      setDropoffDate('');
      setActive(true);
    }
  }, [selectedRide]);
  const handleSubmit = e => {

    const newRide = {
      status,
      vehicleId,
      driverId,
      pickupAddress,
      dropoffAddress,
      customerId,
      pickupAreaId,
      dropoffAreaId,
      productCategoryId,
      productName,
      productQuantity,
      pickupDate,
      dropoffDate,
      isActive
    };

    setValidation({
      status: true,
      vehicleId: true,
      driverId: true,
      pickupAddress: true,
      dropoffAddress: true,
      customerId: true,
      pickupAreaId: true,
      dropoffAreaId: true,
      productCategoryId: true,
      productName: true,
      productQuantity: true,
      pickupDate: true,
      dropoffDate: true,
      isActive: true
    });
    if (isRequired(status) &&
      isRequired(vehicleId) &&
      isRequired(driverId) &&
      isRequired(pickupAddress) &&
      isRequired(dropoffAddress) &&
      isRequired(customerId) &&
      isRequired(pickupAreaId) &&
      isRequired(dropoffAreaId) &&
      isRequired(productCategoryId) &&
      isRequired(productName) &&
      isRequired(productQuantity) &&
      isRequired(pickupDate) &&
      isRequired(dropoffDate)) {
      addRide(newRide);
    }
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
              <Grid item sm={12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <InputLabel>Customer</InputLabel>
                  <Select
                    fullWidth={true}
                    id="customerId"
                    label="Customer"
                    variant="outlined"
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                    onBlur={e => setValidation({ ...validation, customerId: true })}
                  >
                    <MenuItem value="" disabled>Select a customer</MenuItem>
                    {companies.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>)}
                  </Select>
                  {validation.customerId && !isRequired(customerId) ? <Typography color="error">Customer is required!</Typography> : ''}
                </FormControl>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Pickup Area</InputLabel>
                    <Select
                      fullWidth={true}
                      id="pickupAreaId"
                      label="Pickup Area"
                      variant="outlined"
                      value={pickupAreaId}
                      onChange={e => setPickupAreaId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, pickupAreaId: true })}
                    >
                      <MenuItem value="" disabled>Select a PickupArea</MenuItem>
                      {areas.map(area => <MenuItem key={area.id} value={area.id}>
                        {area.name}, {area.Zone.name}, {area.Zone.City.name}
                      </MenuItem>)}
                    </Select>
                    {validation.pickupAreaId && !isRequired(pickupAreaId) ? <Typography color="error">Pickup Area is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Dropoff Area</InputLabel>
                    <Select
                      fullWidth={true}
                      id="dropoffAreaId"
                      label="Drop-off Area"
                      variant="outlined"
                      value={dropoffAreaId}
                      onChange={e => setDropoffAreaId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, dropoffAreaId: true })}
                    >
                      <MenuItem value="" disabled>Select a DropoffArea</MenuItem>
                      {areas.map(area => <MenuItem key={area.id} value={area.id}>
                        {area.name}, {area.Zone.name}, {area.Zone.City.name}
                      </MenuItem>)}
                    </Select>
                    {validation.dropoffAreaId && !isRequired(dropoffAreaId) ? <Typography color="error">Dropoff Area is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="pickupAddress"
                    label="Pickup address"
                    type="text"
                    variant="outlined"
                    value={pickupAddress}
                    onChange={e => setPickupAddress(e.target.value)}
                    onBlur={e => setValidation({ ...validation, pickupAddress: true })}
                  />
                  {validation.pickupAddress && !isRequired(pickupAddress) ? <Typography color="error">Pickup address is required!</Typography> : ''}
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="dropoffAddress"
                    label="Dropoff address"
                    type="text"
                    variant="outlined"
                    value={dropoffAddress}
                    onChange={e => setDropoffAddress(e.target.value)}
                    onBlur={e => setValidation({ ...validation, dropoffAddress: true })}
                  />
                  {validation.dropoffAddress && !isRequired(dropoffAddress) ? <Typography color="error">Dropoff address is required!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="pickupDate"
                    label="Pickup Date"
                    placeholder="Pickup Date"
                    type="datetime-local"
                    variant="outlined"
                    value={pickupDate}
                    onChange={e => setPickupDate(dateToPickerFormat(e.target.value))}
                    onBlur={e => setValidation({ ...validation, pickupDate: true })}
                  />
                  {validation.pickupDate && !isRequired(pickupDate) ? <Typography color="error">Pickup date is required!</Typography> : ''}
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="dropoffDate"
                    label="Dropoff Date"
                    placeholder="Dropoff Date"
                    type="datetime-local"
                    variant="outlined"
                    value={dropoffDate}
                    onChange={e => setDropoffDate(dateToPickerFormat(e.target.value))}
                    onBlur={e => setValidation({ ...validation, dropoffDate: true })}
                  />
                  {validation.dropoffDate && !isRequired(dropoffDate) ? <Typography color="error">Dropoff date is required!</Typography> : ''}
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      fullWidth={true}
                      id="status"
                      label="Status"
                      variant="outlined"
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      onBlur={e => setValidation({ ...validation, status: true })}
                    >
                      <MenuItem value="" disabled>Select a status</MenuItem>
                      {Object.keys(statuses).map(status => <MenuItem key={status} value={status}>{statuses[status]}</MenuItem>)}
                    </Select>
                    {validation.status && !isRequired(status) ? <Typography color="error">Status is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Vehicle</InputLabel>
                    <Select
                      fullWidth={true}
                      id="vehicleId"
                      label="Vehicle"
                      variant="outlined"
                      value={vehicleId}
                      onChange={e => setVehicleId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, vehicleId: true })}
                    >
                      <MenuItem value="" disabled>Select a vehicle</MenuItem>
                      {vehicles.map(vehicle => <MenuItem key={vehicle.id} value={vehicle.id}>{vehicle.type}</MenuItem>)}
                    </Select>
                    {validation.vehicleId && !isRequired(vehicleId) ? <Typography color="error">Vehicle is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
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
                      <MenuItem value="" disabled>Select a Driver</MenuItem>
                      {drivers.map(driver => <MenuItem key={driver.id} value={driver.id}>{driver.name}</MenuItem>)}
                    </Select>
                    {validation.driverId && !isRequired(driverId) ? <Typography color="error">Driver is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>ProductCategory</InputLabel>
                    <Select
                      fullWidth={true}
                      id="productCategoryId"
                      label="Product Category"
                      variant="outlined"
                      value={productCategoryId}
                      onChange={e => setProductCategoryId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, productCategoryId: true })}
                    >
                      <MenuItem value="" disabled>Select a product category</MenuItem>
                      {productCategories.map(productCategory => <MenuItem key={productCategory.id} value={productCategory.id}>{productCategory.name}</MenuItem>)}
                    </Select>
                    {validation.productCategoryId && !isRequired(productCategoryId) ? <Typography color="error">Product Category is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="productName"
                    label="Product name"
                    type="text"
                    variant="outlined"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    onBlur={e => setValidation({ ...validation, productName: true })}
                  />
                  {validation.productName && !isRequired(productName) ? <Typography color="error">Product name is required!</Typography> : ''}
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="productQuantity"
                    label="Product quantity"
                    type="text"
                    variant="outlined"
                    value={productQuantity}
                    onChange={e => setProductQuantity(e.target.value)}
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
  );
}