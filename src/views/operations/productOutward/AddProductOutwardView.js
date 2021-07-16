import { useState, useEffect } from 'react';
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
import { isRequired, isPhone } from '../../../utils/validators';
import { Autocomplete } from '@material-ui/lab';
import { ControlPointSharp } from '@material-ui/icons';

export default function AddProductOutwardView({ addProductOutward, open, handleClose, selectedProductOutward, dispatchOrders, formErrors, vehicles }) {
  const dispatchOrdersForDropdown = []
  const filterDispatchOrdersForDropdown = () => {
    dispatchOrders.forEach(dispatchOrder => {
      //    loop to get the PO of each DO
      let totalQuantityDispatched = dispatchOrder.ProductOutwards.reduce((acc, po) => acc + po.quantity, 0); // 1 DO
      let remainingQuantityOfDispatch = dispatchOrder.quantity - totalQuantityDispatched // 1 DO's remaining quantity
      if (remainingQuantityOfDispatch != 0) {
        dispatchOrdersForDropdown.push(dispatchOrder);
      }
    });
  }
  filterDispatchOrdersForDropdown();
  const [validation, setValidation] = useState({});
  const [product, setProduct] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState(0);
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [uom, setUom] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [customer, setCustomer] = useState('');
  const [dispatchOrderId, setDispatchOrderId] = useState('');
  const [dispatchOrderBusinessId, setDispatchOrderBusinessId] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [disabledFlag, setDisabledFlag] = useState(false)
  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');

  // resolved: error occurs on product outward edit.
  const selectDispatchOrder = (value, internalIdForBusiness) => {
    setDispatchOrderId(value);
    setDispatchOrderBusinessId(internalIdForBusiness)
    if (value) {
      let dispatchOrder = dispatchOrders.find(dispatchOrder => dispatchOrder.id == value);
      setDispatchOrderBusinessId(dispatchOrder.internalIdForBusiness)
      let totalQuantityDispatched = dispatchOrder.ProductOutwards.reduce((acc, po) => acc + po.quantity, 0);
      setRequestedQuantity(dispatchOrder.quantity || 0);
      setRemainingQuantity(dispatchOrder.quantity - totalQuantityDispatched || 0); // requested qt - sent quantity
      setUom(dispatchOrder.Inventory.Product.UOM.name);
      setProduct(dispatchOrder.Inventory.Product.name || '');
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
      setRequestedQuantity(0);
      setRemainingQuantity(0);
      setProduct('');
      setUom('');
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

  useEffect(() => {
    if (!!selectedProductOutward) {
      setDisabledFlag(true)
      selectDispatchOrder(selectedProductOutward.dispatchOrderId || '');
      setQuantity(selectedProductOutward.quantity || '');
    } else {
      setValidation({})
      setDisabledFlag(false)
      selectDispatchOrder('');
      setQuantity('');
    }
  }, [selectedProductOutward, dispatchOrders])
  // Done: add reference id in sending obj
  // Done: add vehicleNumber and vehicle
  const handleSubmit = e => {
    const newProductOutward = {
      dispatchOrderId,
      quantity,
      referenceId,
      vehicleId,
      internalIdForBusiness
    }
    setValidation({
      quantity: true,
      dispatchOrderId: true,
      vehicleId: true
    });
    if (isRequired(dispatchOrderId)
      && isRequired(vehicleId)
      && isRequired(quantity)) {
      addProductOutward(newProductOutward);
    }
  }

  return (
    <div style={{ display: "inline" }}>
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
    </div >
  );
}
