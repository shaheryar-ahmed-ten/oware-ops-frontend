import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox
} from '@material-ui/core'

export default function AddDispatchOrderView({ addDispatchOrder, open, handleClose, selectedDispatchOrder, products, warehouses, customers }) {
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [uom, setUom] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const selectProduct = value => {
    setProductId(value);
    if (value) setUom(products.find(product => product.id == value).UOM.name);
    else setUom('');
  }

  useEffect(() => {
    if (!!selectedDispatchOrder) {
      setQuantity(selectedDispatchOrder.quantity || '');
      setCustomerId(selectedDispatchOrder.customerId || '');
      selectProduct(selectedDispatchOrder.productId || '');
      setWarehouseId(selectedDispatchOrder.warehouseId || '');
      setShipmentDate(selectedDispatchOrder.shipmentDate || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
    } else {
      setQuantity('');
      setCustomerId('');
      selectProduct('');
      setUom('');
      setWarehouseId('');
      setShipmentDate('');
      setReceiverName('');
      setReceiverPhone('');
    }
  }, [selectedDispatchOrder, products, warehouses, customers])
  const handleSubmit = e => {

    const newDispatchOrder = {
      quantity,
      customerId,
      productId,
      warehouseId,
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
            {!selectedDispatchOrder ? 'Add Dispatch Order' : 'Edit Dispatch Order'}
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <Select
                    fullWidth={true}
                    margin="dense"
                    id="customerId"
                    label="Customer"
                    variant="outlined"
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                  >
                    {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.companyName}</MenuItem>)}
                  </Select>
                </Grid>
                <Grid item sm={6}>
                  <Select
                    fullWidth={true}
                    margin="dense"
                    id="productId"
                    label="Product"
                    variant="outlined"
                    value={productId}
                    onChange={e => selectProduct(e.target.value)}
                  >
                    {products.map(product => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
                  </Select>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <Select
                    fullWidth={true}
                    margin="dense"
                    id="warehouseId"
                    label="Warehouse"
                    variant="outlined"
                    value={warehouseId}
                    onChange={e => setWarehouseId(e.target.value)}
                  >
                    {warehouses.map(warehouse => <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>)}
                  </Select>
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
            <Grid container>

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
                  id="quantity"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}

                />
              </Grid>
            </Grid>
            <Grid container>
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
              {!selectedDispatchOrder ? 'Add Dispatch Order' : 'Update Dispatch Order'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}