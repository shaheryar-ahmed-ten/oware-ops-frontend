import { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core'
import { isRequired, isNotEmptyArray, isChar } from '../../../utils/validators';
import { dateToPickerFormat, getURL, digitize } from '../../../utils/common';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { upload } from '../../../utils/upload';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import { isNumber } from '@material-ui/data-grid';
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  parentContainer: {
    boxSizing: 'border-box',
    padding: "30px 30px",
  },
  pageHeading: {
    fontWeight: 600
  },
  pageSubHeading: {
    fontWeight: 300
  }
}));
function AddRideView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const [selectedRide, setSelectedRide] = useState(state ? state.selectedRide : null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [areas, setAreas] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [cities, setCities] = useState([]);
  const [manifestImage, setManifestImage] = useState(null)

  useEffect(() => {
    getRelations();
  }, []);

  const addRide = data => {
    let apiPromise = null;
    if (!selectedRide) apiPromise = axios.post(getURL('ride'), data);
    else apiPromise = axios.put(getURL(`ride/${selectedRide.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      navigate('/logistics/ride');
      // setShowMessage({
      //     message: "New ride has been created."
      // })
      // closeAddRideView(false);
      // getRides();
    });
  };

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
  const [pickupZones, setPickupZones] = useState([]);
  const [pickupAreas, setPickupAreas] = useState([]);
  const [pickupCityId, setPickupCityId] = useState('');
  const [pickupCityZoneId, setPickupCityZoneId] = useState('');
  const [pickupAreaId, setPickupAreaId] = useState('');
  const [dropoffZones, setDropoffZones] = useState([]);
  const [dropoffAreas, setDropoffAreas] = useState([]);
  const [dropoffCityId, setDropoffCityId] = useState('');
  const [dropoffCityZoneId, setDropoffCityZoneId] = useState('');
  const [dropoffAreaId, setDropoffAreaId] = useState('');
  const [products, setProducts] = useState([]);

  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationComment, setCancellationComment] = useState('');

  const [productCategoryId, setProductCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const [price, setPrice] = useState();
  const [cost, setCost] = useState();
  const [customerDiscount, setCustomerDiscount] = useState();
  const [driverIncentive, setDriverIncentive] = useState();

  const [pickupDate, setPickupDate] = useState(dateToPickerFormat(new Date()));
  const [dropoffDate, setDropoffDate] = useState(dateToPickerFormat(new Date()));

  const [isActive, setActive] = useState(true);

  const getRelations = () => {
    axios.get(getURL('ride/relations'))
      .then(res => {
        setVehicles(res.data.vehicles);
        setDrivers(res.data.drivers);
        setStatuses(res.data.statuses);
        setAreas(res.data.areas);
        setCities(res.data.cities);
        setCompanies(res.data.companies);
        setProductCategories(res.data.productCategories);
      });
  };

  const addProduct = () => {
    setValidation({
      ...validation,
      productCategoryId: true,
      productName: true,
      productQuantity: true
    });
    if (productCategoryId && productName && productQuantity) {

      setProducts([...products, {
        categoryId: productCategoryId,
        name: productName,
        quantity: productQuantity
      }]);
      setValidation({
        ...validation,
        productCategoryId: false,
        productName: false,
        productQuantity: false
      });
    }

  };


  useEffect(() => {
    if (!!selectedRide) {
      setStatus(selectedRide.status || '');
      setVehicleId(selectedRide.Vehicle.id || '');
      setDriverId(selectedRide.Driver.id || '');
      setPickupAddress(selectedRide.pickupAddress || '');
      setDropoffAddress(selectedRide.dropoffAddress || '');
      setCustomerId(selectedRide.Customer.id || '');
      setCancellationComment(selectedRide.cancellationComment || '');
      setCancellationReason(selectedRide.cancellationReason || '');
      setPickupCityId(selectedRide.PickupArea.Zone.City.id || '');
      setPickupCityZoneId(selectedRide.PickupArea.Zone.id || '');
      setPickupAreaId(selectedRide.PickupArea.id || '');
      setDropoffCityId(selectedRide.DropoffArea.Zone.City.id || '');
      setDropoffCityZoneId(selectedRide.DropoffArea.Zone.id || '');
      setDropoffAreaId(selectedRide.DropoffArea.id || '');
      setProducts(selectedRide.RideProducts || '');
      setPickupDate(dateToPickerFormat(selectedRide.pickupDate) || '');
      setDropoffDate(dateToPickerFormat(selectedRide.dropoffDate) || '');
      setActive(!!selectedRide.isActive);
      setPrice(selectedRide.price || '');
      setCost(selectedRide.cost || '');
      setCustomerDiscount(selectedRide.customerDiscount || '');
      setDriverIncentive(selectedRide.driverIncentive || '');

    }
  }, [selectedRide]);

  useEffect(() => {
    setProductName('');
    setProductQuantity('');
    setProductCategoryId(null);
  }, [products]);

  useEffect(() => {
    const vehicle = vehicles.find(vehicle => vehicle.id == vehicleId);
    if (vehicle) setDriverId(vehicle.driverId);
  }, [vehicleId]);

  useEffect(() => {
    if (pickupCityId) {
      const getCity = cities.find(city => city.id == pickupCityId)
      if (getCity)
        setPickupZones(getCity.Zones)
    }

  }, [pickupCityId, cities])

  useEffect(() => {
    if (dropoffCityId) {
      const getCity = cities.find(city => city.id == dropoffCityId)
      if (getCity)
        setDropoffZones(getCity.Zones)
    }

  }, [dropoffCityId, cities])

  useEffect(() => {
    if (pickupCityZoneId) {
      const getZone = pickupZones.find(zone => zone.id == pickupCityZoneId)
      if (getZone)
        setPickupAreas(getZone.Areas)
    }
  }, [pickupCityZoneId, pickupZones])

  useEffect(() => {
    if (dropoffCityZoneId) {
      const getZone = dropoffZones.find(zone => zone.id == dropoffCityZoneId)
      if (getZone)
        setDropoffAreas(getZone.Areas)
    }
  }, [dropoffCityZoneId, dropoffZones])

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
      price,
      cost,
      customerDiscount,
      driverIncentive,
      products,
      pickupDate: new Date(pickupDate),
      dropoffDate: new Date(dropoffDate),
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
      price: true,
      cost: true,
      customerDiscount: true,
      driverIncentive: true,
      products: true,
      pickupDate: true,
      dropoffDate: true,
      isActive: true
    });

    if (isRequired(vehicleId) &&
      (status === 'UNASSIGNED' || isRequired(driverId)) &&
      isRequired(pickupAddress) &&
      isRequired(dropoffAddress) &&
      isRequired(customerId) &&
      isRequired(pickupAreaId) &&
      isRequired(dropoffAreaId) &&
      (status != 'CANCELLED' || isRequired(cancellationReason)) &&
      (status != 'CANCELLED' || isRequired(cancellationComment)) &&
      isRequired(price) &&
      isRequired(cost) &&
      isRequired(customerDiscount) &&
      isRequired(driverIncentive) &&
      isNotEmptyArray(products) &&
      isRequired(pickupDate) &&
      isRequired(dropoffDate)) {
      if (manifestImage) {
        const [manifestId] = await upload([manifestImage], 'ride');
        newRide.manifestId = manifestId;
      }
      addRide(newRide);
    }
  }

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.pageHeading}>
              {!selectedRide ? 'Create' : 'Edit'} Ride
            </Typography>
            {selectedRide &&
              <Typography variant="p">
                Ride ID: {digitize(selectedRide.id, 6)}
              </Typography>
            }
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate('/logistics/ride')}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>Company & Vehicle</Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel>Company</InputLabel>
              <Select
                fullWidth={true}
                id="customerId"
                label="Company"
                variant="outlined"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                onBlur={e => setValidation({ ...validation, customerId: true })}
              >
                <MenuItem value="" disabled>Select a company</MenuItem>
                {companies.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>)}
              </Select>
              {validation.customerId && !isRequired(customerId) ? <Typography color="error">Company is required!</Typography> : ''}
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
          <Grid container item xs={12} spacing={3}>
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
        <Grid container item xs={12} spacing={3}>
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
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>Pickup & Drop-off</Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={4}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel>Pickup City</InputLabel>
              <Select
                fullWidth={true}
                id="pickupAreaId"
                label="Pickup Area"
                variant="outlined"
                value={pickupCityId}
                onChange={e => setPickupCityId(e.target.value)}
                onBlur={e => setValidation({ ...validation, pickupCityId: true })}
              >
                <MenuItem value="" disabled>Select a PickupCity</MenuItem>
                {cities.map(city => <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>)}
              </Select>
              {validation.pickupCityId && !isRequired(pickupCityId) ? <Typography color="error">Pickup City is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={4}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel>Pickup Zone</InputLabel>
              <Select
                fullWidth={true}
                id="pickupAreaId"
                label="Pickup Zone"
                variant="outlined"
                value={pickupCityZoneId}
                onChange={e => setPickupCityZoneId(e.target.value)}
                onBlur={e => setValidation({ ...validation, pickupCityZoneId: true })}
              >
                <MenuItem value="" disabled>Select a PickupZone</MenuItem>
                {pickupZones.map(zone => <MenuItem key={zone.id} value={zone.id}>
                  {zone.name}
                </MenuItem>)}
              </Select>
              {validation.pickupCityZoneId && !isRequired(pickupCityZoneId) ? <Typography color="error">Pickup Zone is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={4}>
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
                {pickupAreas.map(area => <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>)}
              </Select>
              {validation.pickupAreaId && !isRequired(pickupAreaId) ? <Typography color="error">Pickup Area is required!</Typography> : ''}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={12}>
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
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={4}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel>Dropoff City</InputLabel>
              <Select
                fullWidth={true}
                id="dropoffCityId"
                label="Drop-off City"
                variant="outlined"
                value={dropoffCityId}
                onChange={e => setDropoffCityId(e.target.value)}
                onBlur={e => setValidation({ ...validation, dropoffCityId: true })}
              >
                <MenuItem value="" disabled>Select a DropoffCity</MenuItem>
                {cities.map(city => <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>)}
              </Select>
              {validation.dropoffCityId && !isRequired(dropoffCityId) ? <Typography color="error">Dropoff City is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={4}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel>Dropoff Zone</InputLabel>
              <Select
                fullWidth={true}
                id="dropoffAreaId"
                label="Drop-off Area"
                variant="outlined"
                value={dropoffCityZoneId}
                onChange={e => setDropoffCityZoneId(e.target.value)}
                onBlur={e => setValidation({ ...validation, dropoffCityZoneId: true })}
              >
                <MenuItem value="" disabled>Select a DropoffArea</MenuItem>
                {dropoffZones.map(zone => <MenuItem key={zone.id} value={zone.id}>
                  {zone.name}
                </MenuItem>)}
              </Select>
              {validation.dropoffCityZoneId && !isRequired(dropoffCityZoneId) ? <Typography color="error">Dropoff Zone is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={4}>
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
                {dropoffAreas.map(area => <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>)}
              </Select>
              {validation.dropoffAreaId && !isRequired(dropoffAreaId) ? <Typography color="error">Dropoff Area is required!</Typography> : ''}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={12}>
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
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="pickupDate"
              label="Pickup Date & Time"
              placeholder="Pickup Date & Time"
              inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              type="datetime-local"
              variant="outlined"
              value={pickupDate}
              minuteStep={15}
              onChange={e => {
                setPickupDate(dateToPickerFormat(e.target.value));
                setDropoffDate(dateToPickerFormat(e.target.value))
              }}
              onBlur={e => setValidation({ ...validation, pickupDate: true })}
            />
            {validation.pickupDate && !isRequired(pickupDate) ? <Typography color="error">Pickup date is required!</Typography> : ''}
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="dropoffDate"
              label="Dropoff Date & Time"
              // inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              inputProps={{ min: pickupDate }}
              placeholder="Dropoff Date & Time"
              type="datetime-local"
              variant="outlined"
              value={dropoffDate}
              onChange={e => setDropoffDate(dateToPickerFormat(e.target.value))}
              onBlur={e => setValidation({ ...validation, dropoffDate: true })}
            />
            {validation.dropoffDate && !isRequired(dropoffDate) ? <Typography color="error">Dropoff date is required!</Typography> : ''}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>Cost & Price</Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="price"
              label="Price (Rs.)"
              placeholder="Price (Rs.)"
              type="number"
              variant="outlined"
              value={price}
              minuteStep={15}
              onChange={e => setPrice(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={e => setValidation({ ...validation, price: true })}
            />
            {validation.price && !isRequired(price) ? <Typography color="error">Price is required!</Typography> : ''}
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="cost"
              label="Cost (Rs.)"
              placeholder="Cost (Rs.)"
              type="number"
              variant="outlined"
              value={cost}
              onChange={e => setCost(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={e => setValidation({ ...validation, cost: true })}
            />
            {validation.cost && !isRequired(cost) ? <Typography color="error">Cost is required!</Typography> : ''}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="customerDiscount"
              label="Customer Discount (Rs.)"
              placeholder="Customer Discount (Rs.)"
              type="number"
              variant="outlined"
              value={customerDiscount}
              minuteStep={15}
              onChange={e => setCustomerDiscount(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={e => setValidation({ ...validation, customerDiscount: true })}
            />
            {validation.customerDiscount && !isRequired(customerDiscount) ? <Typography color="error">Customer Discount is required!</Typography> : ''}
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="driverIncentive"
              label="Driver Incentive (Rs.)"
              placeholder="Driver Incentive (Rs.)"
              type="number"
              variant="outlined"
              value={driverIncentive}
              onChange={e => setDriverIncentive(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={e => setValidation({ ...validation, driverIncentive: true })}
            />
            {validation.driverIncentive && !isRequired(driverIncentive) ? <Typography color="error">Driver Incentive is required!</Typography> : ''}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>Product Details</Typography>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <InputLabel>Product Category</InputLabel>
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
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                margin="dense"
                id="productName"
                label="Product name"
                type="text"
                variant="outlined"
                value={productName}
                onChange={e => {
                  // const regex = /^[a-zA-Z1-9]*$/
                  // if (regex.test(e.target.value))
                  setProductName(e.target.value)
                }}
                onBlur={e => setValidation({ ...validation, productName: true })}
              />
              {validation.productName && !isRequired(productName) ? <Typography color="error">Product name is required!</Typography> : ''}
              {/* {validation.productName && !isChar(productName) ? <Typography color="error">Product name is only alphabets!</Typography> : ''} */}
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth={true}
                margin="dense"
                id="productQuantity"
                label="Product quantity"
                type="number"
                variant="outlined"
                value={productQuantity}
                onChange={e => setProductQuantity(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
                onBlur={e => setValidation({ ...validation, productQuantity: true })}
              />
              {validation.productQuantity && !isRequired(productQuantity) ? <Typography color="error">Product quantity is required!</Typography> : ''}
              {/* {validation.productQuantity && !isNumber(productQuantity) ? <Typography color="error">Product quantity is only numbers!</Typography> : ''} */}
            </Grid>
            <Grid item xs={3}>
              <FormControl margin="dense" variant="outlined">
                <Button variant="contained" onClick={() => addProduct({
                  categoryId: productCategoryId,
                  name: productName,
                  quantity: productQuantity
                })} color="primary">Add Product</Button>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
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
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Manifest
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => {
                    return (
                      <TableRow hover role="checkbox">
                        <TableCell>
                          {productCategoriesMap[product.categoryId] ? productCategoriesMap[product.categoryId].name : ''}
                        </TableCell>
                        <TableCell>
                          {product.name}
                        </TableCell>
                        <TableCell>
                          {product.quantity}
                        </TableCell>
                        <TableCell>
                          {product.manifestId && product.Manifest ?
                            <a target="_blank" href={getURL('preview', product.manifestId)}>{product.Manifest.originalName}</a>
                            : ''}
                        </TableCell>
                        <TableCell>
                          <DeleteIcon color="error" key="delete" onClick={() =>
                            setProducts(products.filter((_product, _index) => _index != index))
                          } />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              {(selectedRide && selectedRide.Manifest) ?
                <a target="_blank" href={getURL('preview', selectedRide.Manifest.id)}>Product Manifest Image</a>
                : ''}
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item sm={12}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button
                  variant="contained"
                  component="label"
                  color={((selectedRide && selectedRide.manifestId) || manifestImage) ? 'primary' : 'default'}
                  startIcon={<CloudUploadIcon />}
                >
                  Product Manifest {((selectedRide && selectedRide.manifestId) || manifestImage) ? 'Uploaded' : ''}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => { setManifestImage(e.target.files[0]) }}
                    accept=".jpg,.png,.jpeg"
                  />
                </Button>
              </FormControl>
            </Grid>

          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={3}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {!selectedRide ? 'Add Ride' : 'Update Ride'}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default AddRideView
