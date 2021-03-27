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
  const [dispatchOrderId, setProductInwardId] = useState('');
  const [isActive, setActive] = useState(false);

  const selectProductInward = value => {
    setProductInwardId(value);
    if (value) {
      let dispatchOrder = dispatchOrders.find(dispatchOrder => dispatchOrder.id == value);
      setRequestedQuantity(dispatchOrder.quantity);
      setUom(dispatchOrder.ProductInward.Product.UOM.name);
      setWarehouse(dispatchOrder.ProductInward.Warehouse.name);
      setCustomer(dispatchOrder.ProductInward.Customer.companyName);
      setCustomer(dispatchOrder.ProductInward.Customer.companyName);
      setShipmentDate(dispatchOrder.shipmentDate || '');
      setReceiverName(dispatchOrder.receiverName || '');
      setReceiverPhone(dispatchOrder.receiverPhone || '');
      setProduct(dispatchOrder.ProductInward.Product.name || '');
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
      selectProductInward(selectedProductOutward.dispatchOrderId || '');
      setQuantity(selectedProductOutward.quantity || '');
      setActive(!!selectedProductOutward.isActive);
    } else {
      selectProductInward('');
      setQuantity('');
      setActive(false);
    }
  }, [selectedProductOutward, dispatchOrders])
  const handleSubmit = e => {

    const newProductOutward = {
      quantity,
      dispatchOrderId,
      quantity,
      isActive
    }

    addProductOutward(newProductOutward);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedProductOutward ? 'Add Dispatch Order' : 'Edit Dispatch Order'}
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid container>
                <Grid item sm={6}>
                  <Select
                    fullWidth={true}
                    margin="dense"
                    id="dispatchOrderId"
                    label="ProductInward"
                    variant="outlined"
                    value={dispatchOrderId}
                    onChange={e => selectProductInward(e.target.value)}
                  >
                    {dispatchOrders.map(dispatchOrder => <MenuItem key={dispatchOrder.id} value={dispatchOrder.id}>{dispatchOrder.ProductInward.Product.name}::{dispatchOrder.quantity}</MenuItem>)}
                  </Select>
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
              <Grid container>
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
              <Grid container>
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
              <Grid container>

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
                    type="text"
                    variant="outlined"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}

                  />
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
                <Grid item sm={6}>
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setActive(e.target.checked)}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                  Active
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedProductOutward ? 'Add Dispatch Order' : 'Update Dispatch Order'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}