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
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core'
import { isRequired, isNotEmptyArray } from '../../../utils/validators';
import { dateToPickerFormat } from '../../../utils/common';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { upload } from '../../../utils/upload';

export default function AddRideView({ addRide, open, handleClose, selectedRide,
  vehicles, drivers, statuses, areas, companies, productCategories, formErrors }) {
  const productCategoriesMap = productCategories.reduce(
    (acc, category) => ({ ...acc, [category.id]: category }),
    {});
  const [validation, setValidation] = useState({});
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [status, setStatus] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [pickupAreaId, setPickupAreaId] = useState('');
  const [dropoffAreaId, setDropoffAreaId] = useState('');
  const [products, setProducts] = useState([]);

  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationComment, setCancellationComment] = useState('');

  const [productCategoryId, setProductCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [isActive, setActive] = useState(true);
  const [productManifestId, setProductManifestId] = useState(null)
  const [productManifests, setProductManifests] = useState({})

  useEffect(() => {
    if (!!selectedRide) {
      setStatus(selectedRide.status || '');
      setVehicleId(selectedRide.vehicleId || '');
      setDriverId(selectedRide.driverId || '');
      setPickupAddress(selectedRide.pickupAddress || '');
      setDropoffAddress(selectedRide.dropoffAddress || '');
      setCustomerId(selectedRide.customerId || '');
      setCancellationComment(selectedRide.cancellationComment || '');
      setCancellationReason(selectedRide.cancellationReason || '');
      setPickupAreaId(selectedRide.pickupAreaId || '');
      setDropoffAreaId(selectedRide.dropoffAreaId || '');
      setProducts(selectedRide.RideProducts || '');
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
      setCancellationComment('');
      setCancellationReason('');
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

  useEffect(() => {
    setProductName('');
    setProductQuantity('');
    setProductCategoryId(null);
    // setProductManifests({});
  }, [products]);

  useEffect(() => {
    const vehicle = vehicles.find(vehicle => vehicle.id == vehicleId);
    if (vehicle) setDriverId(vehicle.driverId);
  }, [vehicleId]);

  const handleSubmit = async e => {
    let newRide = {
      status,
      vehicleId,
      driverId,
      pickupAddress,
      dropoffAddress,
      customerId,
      pickupAreaId,
      dropoffAreaId,
      cancellationReason,
      cancellationComment,
      products,
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
      cancellationReason: true,
      cancellationComment: true,
      products: true,
      pickupDate: true,
      dropoffDate: true,
      isActive: true
    });
    if (isRequired(status) &&
      isRequired(vehicleId) &&
      (status == 'UNASSIGNED' || isRequired(driverId)) &&
      isRequired(pickupAddress) &&
      isRequired(dropoffAddress) &&
      isRequired(customerId) &&
      isRequired(pickupAreaId) &&
      isRequired(dropoffAreaId) &&
      (status != 'CANCELLED' || isRequired(cancellationReason)) &&
      (status != 'CANCELLED' || isRequired(cancellationComment)) &&
      isNotEmptyArray(products) &&
      isRequired(pickupDate) &&
      isRequired(dropoffDate)) {
      const productManifestsIndexes = Object.keys(productManifests);
      let fileIds = await upload(productManifestsIndexes.map(index => productManifests[index]), 'ride')
      const productManifestFiles = productManifestsIndexes.reduce((acc, index, fileIndex) => ({ ...acc, [index]: fileIds[fileIndex] }), {})
      newRide.products.forEach((product, index) => Object.assign(product, { manifestId: productManifestFiles[index] }))
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
                      {vehicles.map(vehicle => <MenuItem key={vehicle.id} value={vehicle.id}>{vehicle.registrationNumber}</MenuItem>)}
                    </Select>
                    {validation.vehicleId && !isRequired(vehicleId) ? <Typography color="error">Vehicle is required!</Typography> : ''}
                  </FormControl>
                </Grid>
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
              </Grid>
              {status == 'CANCELLED' ?
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <TextField
                      fullWidth={true}
                      margin="dense"
                      id="cancellationReason"
                      label="Cancellation reason"
                      type="text"
                      variant="outlined"
                      value={cancellationReason}
                      onChange={e => setCancellationReason(e.target.value)}
                      onBlur={e => setValidation({ ...validation, cancellationReason: true })}
                    />
                    {validation.cancellationReason && !isRequired(cancellationReason) ? <Typography color="error">Cancellation reason is required!</Typography> : ''}
                  </Grid>
                  <Grid item sm={6}>
                    <TextField
                      fullWidth={true}
                      margin="dense"
                      id="cancellationComment"
                      label="Cancellation comment"
                      type="text"
                      variant="outlined"
                      value={cancellationComment}
                      onChange={e => setCancellationComment(e.target.value)}
                      onBlur={e => setValidation({ ...validation, cancellationComment: true })}
                    />
                    {validation.cancellationComment && !isRequired(cancellationComment) ? <Typography color="error">Cancellation comment is required!</Typography> : ''}
                  </Grid>
                </Grid>
                : ''}
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
                    {validation.driverId && status == 'ASSIGNED' && !isRequired(driverId) ? <Typography color="error">Driver is required!</Typography> : ''}
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
              <Grid item sm={12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Button
                    variant="contained"
                    component="label"
                    color={productManifests ? 'primary' : 'default'}
                    startIcon={<CloudUploadIcon />}
                  >
                    Product Manifest {productManifests ? 'Uploaded' : ''}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        setProductManifests({
                          ...productManifests,
                          [products.length]: e.target.files[0]
                        })
                      }}
                    />
                  </Button>
                  {validation.productManifests && !isRequired(productManifests) ? <Typography color="error">Product Manifest is required!</Typography> : ''}
                </FormControl>
              </Grid>
            </Grid>
            <Grid item sm={12}>
              <Button variant="contained" onClick={() => setProducts([...products, {
                // category: productCategories.find(category => category.id == productCategoryId),
                categoryId: productCategoryId,
                manifestId: productManifestId,
                name: productName,
                quantity: productQuantity
              }])} color="primary" variant="contained">Add Product</Button>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Category
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Name
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Quantity
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(product => {
                    return (
                      <TableRow hover role="checkbox">
                        <TableCell>
                          {productCategoriesMap[product.categoryId].name}
                        </TableCell>
                        <TableCell>
                          {product.name}
                        </TableCell>
                        <TableCell>
                          {product.quantity}
                        </TableCell>
                        <TableCell>
                          <DeleteIcon color="error" key="delete" onClick={() =>
                            setProducts(products.filter(_product => _product.id != product.id))
                          } />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>


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
