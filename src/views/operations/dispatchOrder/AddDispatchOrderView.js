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
  Checkbox
} from '@material-ui/core'

export default function AddDispatchOrderView({ addDispatchOrder, open, handleClose, selectedDispatchOrder, inventories, formErrors }) {
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [product, setProduct] = useState('');
  const [customer, setCustomer] = useState('');
  const [inventory, setInventory] = useState(null);
  const [inventoryId, setInventoryId] = useState('');
  const [uom, setUom] = useState('');
  const [warehouse, setWarehouse] = useState('');

  const selectInventory = value => {
    setInventoryId(value);
    if (value) {
      const inventory = inventories.find(inventory => inventory.id == value);
      setInventory(inventory);
      setAvailableQuantity(inventory.availableQuantity);
      setCustomer(inventory.Customer.companyName || '');
      setWarehouse(inventory.Warehouse.name || '');
      setProduct(inventory.Product.name || '');
      setUom(inventory.Product.UOM.name || '');
    } else {
      setCustomer('');
      setWarehouse('');
      setProduct('');
      setUom('');
    }
  }

  useEffect(() => {
    if (!!selectedDispatchOrder) {
      setQuantity(selectedDispatchOrder.quantity || '');
      selectInventory(selectedDispatchOrder.inventoryId || '');
      setShipmentDate(selectedDispatchOrder.shipmentDate || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
    } else {
      setQuantity('');
      selectInventory('');
      setShipmentDate('');
      setReceiverName('');
      setReceiverPhone('');
    }
  }, [selectedDispatchOrder, inventories])
  const handleSubmit = e => {

    const newDispatchOrder = {
      quantity,
      customer,
      inventoryId,
      warehouse,
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
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Inventory</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="inventoryId"
                      label="Inventory"
                      variant="outlined"
                      value={inventoryId}
                      disabled={selectedDispatchOrder}
                      onChange={e => selectInventory(e.target.value)}
                    >
                      {inventories.map(inventory => <MenuItem key={inventory.id} value={inventory.id}>{inventory.Product.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="availableQuantity"
                    label="Available Quantity"
                    type="number"
                    variant="outlined"
                    value={availableQuantity}
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
                    variant="outlined"
                    value={customer}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="product"
                    label="Product"
                    type="text"
                    variant="outlined"
                    value={product}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="warehouse"
                    label="Warehouse"
                    type="text"
                    variant="outlined"
                    value={warehouse}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
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
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="shipmentDate"
                  label="Shipment Date"
                  type="datetime-local"
                  variant="outlined"
                  value={shipmentDate}
                  onChange={e => setShipmentDate(e.target.value)}
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
                  disabled={selectedDispatchOrder}
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