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
import { dateToPickerFormat } from '../../../utils/common';
import { Autocomplete } from '@material-ui/lab';

export default function AddDispatchOrderView({ dispatchedOrdersLength, addDispatchOrder, getInventory, getWarehouses, getProducts,
  open, handleClose, selectedDispatchOrder, customers, formErrors }) {

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [validation, setValidation] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [inventoryId, setInventoryId] = useState('');
  const [uom, setUom] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [productId, setProductId] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');

  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  useEffect(() => {
    if (!!selectedDispatchOrder) {
      setQuantity(selectedDispatchOrder.quantity || '');
      setShipmentDate(dateToPickerFormat(selectedDispatchOrder.shipmentDate) || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
      setInventoryId(selectedDispatchOrder.inventoryId || '');
      setCustomerId(selectedDispatchOrder.Inventory.customerId);
      setReferenceId(selectedDispatchOrder.referenceId || '');
    } else {
      setInventoryId('');
      setQuantity('');
      setCustomerId('');
      setWarehouseId('');
      setProductId('');
      setShipmentDate(dateToPickerFormat(new Date()));
      setReceiverName('');
      setReceiverPhone('');
      setReferenceId('');
    }
  }, [selectedDispatchOrder, customers])

  useEffect(() => {
    setWarehouses([]);
    setWarehouseId('');
    setProducts([]);
    setProductId('');
    if (!customerId) return;
    if (!!selectedDispatchOrder) {
      setWarehouses([selectedDispatchOrder.Inventory.Warehouse]);
      setWarehouseId(selectedDispatchOrder.Inventory.warehouseId);
    } else {
      getWarehouses({ customerId })
        .then(warehouses => {
          return setWarehouses(warehouses)
        });
    }
  }, [customerId]);

  useEffect(() => {
    setProducts([]);
    setProductId('');
    if (!customerId && !warehouseId) return;
    if (!!selectedDispatchOrder) {
      setProducts([selectedDispatchOrder.Inventory.Product]);
      setProductId(selectedDispatchOrder.Inventory.productId);
    } else {
      const warehouse = warehouses.find(element => warehouseId == element.id);
      setInternalIdForBusiness(`DO-${warehouse.businessWarehouseCode}-`);
      getProducts({ customerId, warehouseId })
        .then(products => setProducts(products));
    }
  }, [warehouseId])

  useEffect(() => {
    setUom('');
    setAvailableQuantity(0);
    setInventoryId('');
    if (customerId && warehouseId && productId) {
      const product = products.find(product => product.id == productId);
      setUom(product.UOM.name);
      getInventory({ customerId, warehouseId, productId })
        .then(inventory => {
          if (inventory) {
            setAvailableQuantity(inventory.availableQuantity);
            setInventoryId(inventory.id);
          }
        })
    }

  }, [productId]);
  // Done: uncomment dispatch orderId when DO is created
  const handleSubmit = e => {
    const newDispatchOrder = {
      quantity,
      inventoryId,
      customerId,
      warehouseId,
      productId,
      shipmentDate,
      receiverName,
      receiverPhone,
      referenceId,
      internalIdForBusiness
    }

    setValidation({
      quantity: true,
      inventoryId: true,
      customerId: true,
      warehouseId: true,
      productId: true,
      shipmentDate: true,
      receiverName: true,
      receiverPhone: true
    });
    if (isRequired(quantity) &&
      isRequired(inventoryId) &&
      isRequired(customerId) &&
      isRequired(productId) &&
      isRequired(shipmentDate) &&
      isRequired(receiverName) &&
      isRequired(receiverPhone)) {
      addDispatchOrder(newDispatchOrder);
    }
  }

  const handleCustomerSearch = (customerId, customerName) => {
    setCustomerId(customerId);
    setSelectedCustomerName(customerName)
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedDispatchOrder ? 'Add Dispatch Order' : 'Edit Dispatch Order'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="uom"
                    label="UOM"
                    type="text"
                    variant="filled"
                    value={uom}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="availableQuantity"
                    label="Available Quantity"
                    type="number"
                    variant="filled"
                    value={availableQuantity}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="combo-box-demo"
                      options={customers}
                      getOptionLabel={(customer) => customer.name}
                      onChange={(event, newValue) => {
                        if (newValue)
                          handleCustomerSearch(newValue.id, (newValue.name || ''))
                      }}
                      renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
                    />
                    {validation.customerId && !isRequired(customerId) ? <Typography color="error">Customer is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                      fullWidth={true}
                      id="warehouseId"
                      label="Inventory"
                      variant="outlined"
                      value={warehouseId}
                      disabled={!!selectedDispatchOrder}
                      onChange={e => { setWarehouseId(e.target.value) }}
                      onBlur={e => setValidation({ ...validation, warehouseId: true })}
                    >
                      <MenuItem value="" disabled>Select a warehouse</MenuItem>
                      {warehouses.map(warehouse => <MenuItem key={warehouse.id} value={warehouse.id} name="name">{warehouse.name}</MenuItem>)}
                    </Select>
                    {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <InputLabel>Product</InputLabel>
                  <Select
                    fullWidth={true}
                    id="productId"
                    label="Inventory"
                    variant="outlined"
                    value={productId}
                    disabled={!!selectedDispatchOrder}
                    onChange={e => setProductId(e.target.value)}
                    onBlur={e => setValidation({ ...validation, productId: true })}
                  >
                    <MenuItem value="" disabled>Select a product</MenuItem>
                    {products.map(product => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
                  </Select>
                  {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
                </FormControl>
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  InputProps={{ inputProps: { min: 0, max: availableQuantity } }}
                  id="quantity"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  value={quantity}
                  disabled={!!selectedDispatchOrder}
                  onChange={e => setQuantity(e.target.value)}
                  onBlur={e => setValidation({ ...validation, quantity: true })}
                />
                {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
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
                  variant="outlined"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                  onBlur={e => setValidation({ ...validation, receiverName: true })}
                />
                {validation.receiverName && !isRequired(receiverName) ? <Typography color="error">Receiver name is required!</Typography> : ''}
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="receiverPhone"
                  label="Receiver Phone"
                  type="text"
                  variant="outlined"
                  value={receiverPhone}
                  placeholder="0346xxxxxx8"
                  onChange={e => setReceiverPhone(e.target.value)}
                  onBlur={e => setValidation({ ...validation, receiverPhone: true })}
                />
                {validation.receiverPhone && !isRequired(receiverPhone) ? <Typography color="error">Receiver phone is required!</Typography> : ''}
                {validation.receiverPhone && !isPhone(receiverPhone) ? <Typography color="error">Incorrect phone number!</Typography> : ''}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="shipmentDate"
                  label="Shipment Date"
                  placeholder="Shipment Date"
                  type="datetime-local"
                  variant="outlined"
                  value={shipmentDate}
                  onChange={e => setShipmentDate(dateToPickerFormat(e.target.value))}
                  onBlur={e => setValidation({ ...validation, shipmentDate: true })}
                />
                {validation.shipmentDate && !isRequired(shipmentDate) ? <Typography color="error">Shipment date is required!</Typography> : ''}
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="referenceId"
                  label="Reference Id"
                  type="text"
                  variant="outlined"
                  value={referenceId}
                  onChange={e => setReferenceId(e.target.value)}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedDispatchOrder ? 'Add Dispatch Order' : 'Update Dispatch Order'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}