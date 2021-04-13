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
  DialogTitle
} from '@material-ui/core'
import { dateToPickerFormat } from '../../../utils/common';

export default function AddDispatchOrderView({ addDispatchOrder, getInventory,
  open, handleClose, selectedDispatchOrder, customers, warehouses, products, formErrors }) {
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [inventory, setInventory] = useState(null);
  const [inventoryId, setInventoryId] = useState('');
  const [uom, setUom] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [productId, setProductId] = useState('');

  const selectInventory = () => {
    if (customerId && warehouseId && productId) {
      setAvailableQuantity(0);
      setInventoryId('');
      getInventory({ customerId, warehouseId, productId })
        .then(inventory => {
          if (inventory) {
            setAvailableQuantity(inventory.availableQuantity);
            setInventoryId(inventory.id);
          }
        })
    }
    if (productId) {
      const product = products.find(product => product.id == productId);
      setUom(product.UOM.name || '');
    }

  }

  useEffect(() => {
    if (!!selectedDispatchOrder) {
      setQuantity(selectedDispatchOrder.quantity || '');
      setShipmentDate(dateToPickerFormat(selectedDispatchOrder.shipmentDate) || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
      setInventoryId(selectedDispatchOrder.inventoryId || '');
      setCustomerId(selectedDispatchOrder.Inventory.customerId);
      setWarehouseId(selectedDispatchOrder.Inventory.warehouseId);
      setProductId(selectedDispatchOrder.Inventory.productId);
    } else {
      setInventoryId('');
      setQuantity('');
      setCustomerId('');
      setWarehouseId('');
      setProductId('');
      setShipmentDate(dateToPickerFormat(new Date()));
      setReceiverName('');
      setReceiverPhone('');
    }
  }, [selectedDispatchOrder, customers, warehouses, products])

  useEffect(() => {
    selectInventory();
  }, [customerId, warehouseId, productId])
  const handleSubmit = e => {
    const newDispatchOrder = {
      quantity,
      inventoryId,
      customerId,
      warehouseId,
      productId,
      shipmentDate,
      receiverName,
      receiverPhone
    }

    addDispatchOrder(newDispatchOrder);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedDispatchOrder ? 'Add Dispatch' : 'Edit Dispatch'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Customer</InputLabel>
                    <Select
                      fullWidth={true}
                      id="customerId"
                      label="Inventory"
                      variant="outlined"
                      value={customerId}
                      disabled={!!selectedDispatchOrder}
                      onChange={e => setCustomerId(e.target.value)}
                    >
                      {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.companyName}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                      fullWidth={true}
                      id="warehouseId"
                      label="Inventory"
                      variant="outlined"
                      value={warehouseId}
                      disabled={!!selectedDispatchOrder}
                      onChange={e => setWarehouseId(e.target.value)}
                    >
                      {warehouses.map(warehouse => <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>)}
                    </Select>
                  </FormControl>
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
                    >
                      {products.map(product => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={3}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="uom"
                    label="UOM"
                    type="text"
                    variant="outlined"
                    value={uom}
                    disabled
                  />
                </Grid>
                <Grid item sm={3}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="availableQuantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    value={availableQuantity}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
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
                />
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
                  variant="outlined"
                  value={receiverName}
                  onChange={e => setReceiverName(e.target.value)}
                />
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
                  onChange={e => setReceiverPhone(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedDispatchOrder ? 'Add Dispatch' : 'Update Dispatch'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}