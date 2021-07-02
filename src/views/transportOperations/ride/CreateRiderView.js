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
import { isRequired, isNotEmptyArray } from '../../../utils/validators';
import { dateToPickerFormat } from '../../../utils/common';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useLocation } from 'react-router';
import { upload } from '../../../utils/upload';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';


const useStyles = makeStyles((theme) => ({
    parentContainer: {
        boxSizing: 'border-box',
        padding: "30px 30px",
    },
    pageHeading: {
        fontWeight: 600
    }
}))
function CreateRiderView() {
    const { state } = useLocation()
    const classes = useStyles()
    const { selectedRide,
        vehicles, drivers, statuses, areas, companies, productCategories, formErrors, cities, addRide } = state ? state : ''

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

    const [pickupDate, setPickupDate] = useState(dateToPickerFormat(new Date()));
    const [dropoffDate, setDropoffDate] = useState(dateToPickerFormat(new Date()));

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
            setPickupDate(selectedRide.setPickupDate || '');
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
            setPickupDate(dateToPickerFormat(new Date()));
            setDropoffDate(dateToPickerFormat(new Date()));
            setActive(true);
        }
    }, [selectedRide]);

    useEffect(() => {
        setProductName('');
        setProductQuantity('');
        // setProductManifests(null);
        setProductCategoryId(null);
    }, [products]);

    useEffect(() => {
        const vehicle = vehicles.find(vehicle => vehicle.id == vehicleId);
        if (vehicle) setDriverId(vehicle.driverId);
    }, [vehicleId]);

    useEffect(() => {
        if (pickupCityId) {
            const getCity = cities.find(city => city.id == pickupCityId)
            setPickupZones(getCity.Zones)
        }

    }, [pickupCityId])

    useEffect(() => {
        if (dropoffCityId) {
            const getCity = cities.find(city => city.id == pickupCityId)
            setDropoffZones(getCity.Zones)
        }

    }, [dropoffCityId])

    useEffect(() => {
        if (pickupCityZoneId) {
            const getZone = pickupZones.find(zone => zone.id == pickupCityZoneId)
            setPickupAreas(getZone.Areas)
        }
    }, [pickupCityZoneId])

    useEffect(() => {
        if (dropoffCityZoneId) {
            const getZone = dropoffZones.find(zone => zone.id == dropoffCityZoneId)
            setDropoffAreas(getZone.Areas)
        }
    }, [dropoffCityZoneId])




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
        <>
            {formErrors}
            <Grid container className={classes.parentContainer} spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3" className={classes.pageHeading}>Create a Ride</Typography>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item sm={12}>
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
                            id="setPickupDate"
                            label="Pickup Date & Time"
                            placeholder="Pickup Date & Time"
                            type="datetime-local"
                            variant="outlined"
                            value={pickupDate}
                            onChange={e => setPickupDate(dateToPickerFormat(e.target.value))}
                            onBlur={e => setValidation({ ...validation, setPickupDate: true })}
                        />
                        {validation.setPickupDate && !isRequired(pickupDate) ? <Typography color="error">Pickup date is required!</Typography> : ''}
                    </Grid>
                    <Grid item sm={6}>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            id="dropoffDate"
                            label="Dropoff Date & Time"
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
                        <Typography variant="h3" className={classes.pageHeading}>Product Details</Typography>
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
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
                        <Grid item xs={3}>
                            <FormControl margin="dense" fullWidth={true} variant="outlined">
                                <Button
                                    variant="contained"
                                    component="label"
                                    color={Object.entries(productManifests).length !== 0 ? 'primary' : 'default'}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Product Manifest {Object.entries(productManifests).length !== 0 ? 'Uploaded' : ''}
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
                    <Grid container item xs={12} spacing={3} justify="flex-end">
                        <Grid container item xs={12} justify="flex-end">
                            <Button variant="contained" onClick={() => setProducts([...products, {
                                // category: productCategories.find(category => category.id == productCategoryId),
                                categoryId: productCategoryId,
                                manifestId: productManifestId,
                                name: productName,
                                quantity: productQuantity
                            }])} color="primary">Add Product</Button>
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

                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        {!selectedRide ? 'Add Ride' : 'Update Ride'}
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default CreateRiderView
