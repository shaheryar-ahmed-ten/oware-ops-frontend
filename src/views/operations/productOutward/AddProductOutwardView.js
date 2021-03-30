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

export default function AddProductOutwardView({ addProductOutward, open, handleClose, selectedProductOutward, dispatchOrders }) {
  const [product, setProduct] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState('');
  const [uom, setUom] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [customer, setCustomer] = useState('');
  const [dispatchOrderId, setDispatchOrderId] = useState('');

  const selectDispatchOrder = value => {
    setDispatchOrderId(value);
    if (value) {
      let dispatchOrder = dispatchOrders.find(dispatchOrder => dispatchOrder.id == value);
      setRequestedQuantity(dispatchOrder.quantity);
      setUom(dispatchOrder.Product.UOM.name);
      setWarehouse(dispatchOrder.Warehouse.name);
      setCustomer(dispatchOrder.Customer.companyName);
      setCustomer(dispatchOrder.Customer.companyName);
      setShipmentDate(dispatchOrder.shipmentDate || '');
      setReceiverName(dispatchOrder.receiverName || '');
      setReceiverPhone(dispatchOrder.receiverPhone || '');
      setProduct(dispatchOrder.Product.name || '');
    }
    else {
      setRequestedQuantity('');
      setUom('');
      setWarehouse('');
      setCustomer('');
      setShipmentDate('');
      setReceiverName('');
      setReceiverPhone('');
      setProduct('');
    }
  }

  useEffect(() => {
    if (!!selectedProductOutward) {
      selectDispatchOrder(selectedProductOutward.dispatchOrderId || '');
      setQuantity(selectedProductOutward.quantity || '');
    } else {
      selectDispatchOrder('');
      setQuantity('');
    }
  }, [selectedProductOutward, dispatchOrders])
  const handleSubmit = e => {

    const newProductOutward = {
      quantity,
      dispatchOrderId,
      quantity
    }

    addProductOutward(newProductOutward);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedProductOutward ? 'Add Product Outward' : 'Edit Product Outward'}
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Customer</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="dispatchOrderId"
                      label="ProductInward"
                      variant="outlined"
                      value={dispatchOrderId}
                      onChange={e => selectDispatchOrder(e.target.value)}
                    >
                      {dispatchOrders.map(dispatchOrder => <MenuItem key={dispatchOrder.id} value={dispatchOrder.id}>{dispatchOrder.Product.name}::{dispatchOrder.quantity}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="product"
                    label="Product Name"
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
                    id="uom"
                    label="UoM"
                    type="text"
                    variant="outlined"
                    value={uom}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="requestedQuantity"
                    label="Quantity of Product to Dispatch"
                    type="text"
                    variant="outlined"
                    value={requestedQuantity}
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
                    id="warehouse"
                    label="Warehouse"
                    type="text"
                    variant="outlined"
                    value={warehouse}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>

                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="shipmentDate"
                    label="Shipment Date"
                    type="text"
                    variant="outlined"
                    value={shipmentDate}
                    disabled
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="quantity"
                    label="Actual Quantity to Dispatch"
                    type="number"
                    variant="outlined"
                    value={quantity}
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
                    variant="outlined"
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