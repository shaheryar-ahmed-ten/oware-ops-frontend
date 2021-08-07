import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'
import { isRequired, isNotEmptyArray } from '../../../utils/validators';
import { Alert, Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { TableBody } from '@material-ui/core';
import { useLocation, useNavigate } from 'react-router';
import MessageSnackbar from '../../../components/MessageSnackbar';

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
  },
  heading: {
    fontWeight: 'bolder'
  },
}));

export default function AddProductOutwardView({ }) {
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedProductOutward, setSelectedProductOutward] = useState(state ? state.selectedProductOutward : null);

  const [validation, setValidation] = useState({});
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [customer, setCustomer] = useState('');
  const [dispatchOrderId, setDispatchOrderId] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');

  const [formErrors, setFormErrors] = useState([]);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [inventoryQuantities, setInventoryQuantities] = useState([]);
  const [vehicles, setVehicles] = useState([]); // will be used instead vehicle types, numbers etc
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null); // used in details table, selected from dropdown
  const [showMessage, setShowMessage] = useState(null);

  useEffect(() => {
    getRelations();
  }, []);

  useEffect(() => {
    if (!!selectedProductOutward) {
      selectDispatchOrder(selectedProductOutward.dispatchOrderId || '', selectedProductOutward.internalIdForBusiness || '');
    } else {
      setValidation({})
      selectDispatchOrder('');
    }
  }, [selectedProductOutward, dispatchOrders])

  const dispatchOrdersForDropdown = []
  const filterDispatchOrdersForDropdown = () => {
    dispatchOrders.forEach(dispatchOrder => {
      //    loop to get the PO of each DO
      // let totalQuantityDispatched = dispatchOrder.ProductOutwards.reduce((acc, po) => acc + po.quantity, 0); // 1 DO
      let totalRequestedQuantity = dispatchOrder.Inventories.reduce((acc, inv) => acc + inv.OrderGroup.quantity, 0); // 1 DO
      let totalDispatchedQuantity = 0;
      dispatchOrder.ProductOutwards.forEach(po => {
        totalDispatchedQuantity += po.Inventories.reduce((acc, inv) => acc + inv.OutwardGroup.quantity, 0)
      });
      let remainingQuantityOfDispatch = totalRequestedQuantity - totalDispatchedQuantity // 1 DO's remaining quantity

      if (remainingQuantityOfDispatch != 0) {
        dispatchOrdersForDropdown.push(dispatchOrder);
      }
    });
  }
  filterDispatchOrdersForDropdown();


  const getRelations = () => {
    axios.get(getURL('/product-outward/relations'))
      .then(res => {
        // setting dispatchOrder details and vehicleTypes in local State
        // setVehicleTypes((prevState) => res.data.vehicleTypes)
        setVehicles(res.data.vehicles);
        setDispatchOrders(res.data.dispatchOrders);
      });
  };

  // resolved: error occurs on product outward edit.
  const selectDispatchOrder = (value, internalIdForBusiness) => {
    setDispatchOrderId(value);
    if (value && dispatchOrders.length > 0) {
      let dispatchOrder = dispatchOrders.find(dispatchOrder => dispatchOrder.id == value);
      setSelectedDispatchOrder(dispatchOrder)
      // let totalQuantityDispatched = dispatchOrder.ProductOutwards.reduce((acc, po) => acc + po.quantity, 0);
      // let totalQuantityDispatched = dispatchOrder.Inventories.reduce((acc, po) => acc + po.committedQuantity, 0);
      // setRequestedQuantity(dispatchOrder.quantity || 0);
      // setRemainingQuantity(dispatchOrder.quantity - totalQuantityDispatched || 0); // requested qt - sent quantity
      setWarehouse(dispatchOrder.Inventory.Warehouse.name);
      setCustomer(dispatchOrder.Inventory.Company.name);
      setShipmentDate(dispatchOrder.shipmentDate || '');
      setReceiverName(dispatchOrder.receiverName || '');
      setReceiverPhone(dispatchOrder.receiverPhone || '');
      setReferenceId(dispatchOrder.referenceId || '')
      setInternalIdForBusiness(`PD-${dispatchOrder.Inventory.Warehouse.businessWarehouseCode}-`)
      if (selectedProductOutward) {
        setVehicleId(selectedProductOutward.vehicleId || '')
      }
    }
    else {
      setWarehouse('');
      setCustomer('');
      setShipmentDate('');
      setReceiverName('');
      setReceiverPhone('');
      setReferenceId('');
      setInternalIdForBusiness('');
      setVehicleId('');
    }
  }


  const addProductOutward = data => {
    let apiPromise = null;
    if (!selectedProductOutward) apiPromise = axios.post(getURL('product-outward'), data);
    else apiPromise = axios.put(getURL(`product-outward/${selectedProductOutward.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New product outward has been created."
      });
      setTimeout(() => {
        navigate('/operations/product-outward')
      }, 2000);
    })
      .catch((err) => {
        console.log(err)
      });
  };


  // Done: add reference id in sending obj
  // Done: add vehicleNumber and vehicle0
  const handleSubmit = e => {
    const newProductOutward = {
      dispatchOrderId,
      // quantity,
      referenceId,
      vehicleId,
      inventories: Object.values(inventoryQuantities),
      internalIdForBusiness
    }
    // console.log(Object.values(inventoryQuantities));
    // console.log(isNotEmptyArray(Object.values(inventoryQuantities)));
    // console.log(isRequired(dispatchOrderId), isRequired(vehicleId));
    setValidation({
      // quantity: true,
      dispatchOrderId: true,
      vehicleId: true
    });
    if (isRequired(dispatchOrderId)
      && isRequired(vehicleId)
      && isNotEmptyArray(Object.values(inventoryQuantities))) {
      addProductOutward(newProductOutward);
    }
  }

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Add Product Outward</Typography>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="combo-box-demo"
              defaultValue={selectedProductOutward ? { internalIdForBusiness: selectedProductOutward.internalIdForBusiness } : ''}
              options={dispatchOrdersForDropdown}
              getOptionLabel={(dispatchOrder) => dispatchOrder.internalIdForBusiness || ''}
              onChange={(event, newValue) => {
                if (newValue)
                  selectDispatchOrder(newValue.id, (newValue.internalIdForBusiness || ''))
              }}
              renderInput={(params) => <TextField {...params} label="Dispatch Order Id" variant="outlined" />}
            />
            {validation.dispatchOrderId && !isRequired(dispatchOrderId) ? <Typography color="error">Dispatch order Id is required!</Typography> : ''}
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <InputLabel>Vehicle</InputLabel>
            <Select
              fullWidth={true}
              displayEmpty
              id="vehicle"
              label="Vehicle Number"
              variant="outlined"
              value={vehicleId}
              onChange={e => setVehicleId(e.target.value)}
              onBlur={e => setValidation({ ...validation, vehicleId: true })}
            >
              {
                vehicleId == '' ?
                  <MenuItem value=""></MenuItem>
                  :
                  <MenuItem value={vehicleId} disable> {vehicleId} </MenuItem>
              }
              {vehicles.map((vehicle, index) => <MenuItem key={index} value={vehicle.id}>{vehicle.registrationNumber}</MenuItem>)}
            </Select>
            {validation.vehicleId && !isRequired(vehicleId) ? <Typography color="error">Vehicle number is required!</Typography> : ''}
          </FormControl>
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="referenceId"
            label="Reference Id"
            type="text"
            variant="outlined"
            value={referenceId}
            // disabled
            inputProps={{ maxLength: 30 }}
            onChange={(e) => { setReferenceId(e.target.value) }}
          />
        </Grid>
      </Grid>

      {
        selectedDispatchOrder ?
          <TableContainer className={classes.parentContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Customer
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Warehouse
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Outwards
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Shipment Date
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Receiver Name
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Receiver Phone
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover role="checkbox">
                  <TableCell>
                    {customer}
                  </TableCell>
                  <TableCell>
                    {warehouse}
                  </TableCell>
                  <TableCell>
                    {selectedDispatchOrder.ProductOutwards.length}
                  </TableCell>
                  <TableCell>
                    {shipmentDate}
                  </TableCell>
                  <TableCell>
                    {receiverName}
                  </TableCell>
                  <TableCell>
                    {receiverPhone}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          :
          ''
      }
      {
        selectedDispatchOrder ?
          <>
            <Grid container className={classes.parentContainer} spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h3" className={classes.heading}>Product Details</Typography>
              </Grid>
            </Grid>
            <TableContainer className={classes.parentContainer}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Product
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      UOM
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Ordered Quantity
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Available Quantity
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Actual Quantity To Dispatch
                    </TableCell>
                  </TableRow>
                </TableHead>
                {selectedDispatchOrder.Inventories.map((inventory, idx) => {
                  let remainingQt = 0
                  selectedDispatchOrder.ProductOutwards.forEach((po) => {
                    const targetedPoInv = po.Inventories.find((inv) => inv.OutwardGroup.inventoryId === inventory.OrderGroup.inventoryId)
                    remainingQt += targetedPoInv.OutwardGroup.quantity
                  })
                  remainingQt = inventory.OrderGroup.quantity - remainingQt
                  return <>
                    <TableRow hover role="checkbox" key={idx}>
                      <TableCell>
                        {inventory.Product.name}
                      </TableCell>
                      <TableCell>
                        {inventory.Product.UOM.name}
                      </TableCell>
                      <TableCell>
                        {inventory.OrderGroup.quantity}
                      </TableCell>
                      <TableCell>
                        {remainingQt}
                        {/* {inventory.OrderGroup.quantity - inventory.committedQuantity} */}
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth={true}
                          margin="dense"
                          InputProps={{ inputProps: { min: 0, max: inventory.availableQuantity } }}
                          id="quantity"
                          label="Quantity"
                          type="number"
                          variant="outlined"
                          value={inventoryQuantities[idx] ? inventoryQuantities[idx].quantity : 0}
                          onChange={e => setInventoryQuantities({ ...inventoryQuantities, [idx]: { quantity: e.target.value < remainingQt ? e.target.value : remainingQt, id: inventory.id } })} // TODO: Fix multi inputs
                          onBlur={e => setValidation({ ...validation, quantity: true })}
                        />
                        {/* {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''} */}
                      </TableCell>
                    </TableRow>
                  </>
                })}
              </Table>
            </TableContainer>
            <Grid container className={classes.parentContainer} spacing={3}>
              <Grid item xs={3}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Button onClick={handleSubmit} color="primary" variant="contained">
                    {!selectedProductOutward ? 'Add Product Outward' : 'Update Product Outward'}
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </>
          :
          ''
      }

      <MessageSnackbar showMessage={showMessage} />
    </>
  );
}


{/* <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedProductOutward ? 'Add Product Outward' : 'Edit Product Outward'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="dispatchOrderId"
                      value={dispatchOrderBusinessId}
                      options={dispatchOrdersForDropdown}
                      getOptionLabel={(dispatchOrder) => (dispatchOrder.internalIdForBusiness || '')}
                      renderInput={(params) => <TextField {...params} label="Dispatch Order Id" variant="outlined" value={params.id} />}
                      onChange={(event, newValue) => {
                        if (newValue)
                          selectDispatchOrder(newValue.id, (newValue.internalIdForBusiness || ''))
                      }}
                      inputValue={dispatchOrderBusinessId}
                      onBlur={e => setValidation({ ...validation, dispatchOrderId: true })}
                      disabled={disabledFlag}
                    />
                    {validation.dispatchOrderId && !isRequired(dispatchOrderId) ? <Typography color="error">Dispatch order is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="quantity"
                    label="Actual Quantity to Dispatch"
                    InputProps={{ inputProps: { min: 0, max: remainingQuantity } }}
                    type="number"
                    variant="outlined"
                    value={quantity}
                    disabled={!!selectedProductOutward}
                    onChange={e => setQuantity(e.target.value)}
                    onBlur={e => setValidation({ ...validation, quantity: true })}
                  />
                  {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Vehicle</InputLabel>
                    <Select
                      fullWidth={true}
                      displayEmpty
                      id="vehicleId"
                      label="Vehicle"
                      variant="outlined"
                      value={vehicleId}
                      onChange={e => setVehicleId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, vehicleId: true })}
                    >
                      {vehicles.map((vehicle, index) => <MenuItem key={index} value={vehicle.id}>{vehicle.registrationNumber}</MenuItem>)}
                    </Select>
                    {validation.vehicleId && !isRequired(vehicleId) ? <Typography color="error">Vehicle is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="referenceId"
                    label="Reference Id"
                    type="text"
                    variant="outlined"
                    value={referenceId}
                    // disabled
                    inputProps={{ maxLength: 30 }}
                    onChange={(e) => { setReferenceId(e.target.value) }}
                  />
                </Grid>

              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="product"
                    label="Product Name"
                    type="text"
                    variant="filled"
                    value={product}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="uom"
                    label="UoM"
                    type="text"
                    variant="filled"
                    value={uom}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="requestedQuantity"
                    label="Quantity of Product to Dispatch"
                    type="text"
                    variant="filled"
                    value={requestedQuantity}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="remainingQuantity"
                    label="Remaining quantity"
                    type="text"
                    variant="filled"
                    value={remainingQuantity}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="customer"
                    label="Customer"
                    type="text"
                    variant="filled"
                    value={customer}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="warehouse"
                    label="Warehouse"
                    type="text"
                    variant="filled"
                    value={warehouse}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="shipmentDate"
                    label="Shipment Date"
                    type="text"
                    variant="filled"
                    value={shipmentDate}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="receiverName"
                    label="Receiver Name"
                    type="text"
                    variant="filled"
                    value={receiverName}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="receiverPhone"
                    label="Receiver Phone"
                    type="text"
                    variant="filled"
                    value={receiverPhone}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedProductOutward ? 'Add Product Outward' : 'Update Product Outward'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div > */}
