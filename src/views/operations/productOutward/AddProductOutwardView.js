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
import { dateFormat, getURL } from '../../../utils/common';
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
    axios.get(getURL('product-outward/relations'))
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
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>Add Product Outward</Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate('/operations/product-outward')}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Grid item sm={6}>
          <FormControl fullWidth={true} variant="outlined">
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
          <FormControl fullWidth={true} variant="outlined">
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
              margin="normal"
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
            margin="normal"
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
                    Company
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
                    {selectedDispatchOrder.productOutwardsCount || '-'}
                  </TableCell>
                  <TableCell>
                    {dateFormat(shipmentDate)}
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
                <TableBody>
                  {selectedDispatchOrder.Inventories.map((inventory, idx) => {
                    let remainingQt = 0
                    selectedDispatchOrder.ProductOutwards.forEach((po) => {
                      const targetedPoInv = po.Inventories.find((inv) => inv.OutwardGroup.inventoryId === inventory.OrderGroup.inventoryId)
                      if (targetedPoInv)
                        remainingQt += targetedPoInv.OutwardGroup.quantity
                    })
                    remainingQt = inventory.OrderGroup.quantity - remainingQt
                    return (
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
                            onChange={e => setInventoryQuantities({ ...inventoryQuantities, [idx]: { quantity: e.target.value < 0 ? e.target.value == 0 : e.target.value < remainingQt ? e.target.value : remainingQt, id: inventory.id, availableQuantity: remainingQt } })} // TODO: Fix multi inputs
                            onBlur={e => setValidation({ ...validation, quantity: true })}
                          />
                          {/* {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''} */}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
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
