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

export default function AddDispatchOrderView({ addDispatchOrder, open, handleClose, selectedDispatchOrder, productInwards }) {
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [uom, setUom] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [customer, setCustomer] = useState('');
  const [productInwardId, setProductInwardId] = useState('');
  const [isActive, setActive] = useState(false);

  const selectProductInward = value => {
    setProductInwardId(value);
    if (value) {
      let productInward = productInwards.find(productInward => productInward.id == value);
      setAvailableQuantity(productInward.quantity);
      setUom(productInward['Product.UOM.name']);
      setWarehouse(productInward['Warehouse.name']);
      setCustomer(productInward['Customer.companyName']);
    }
    else {
      setAvailableQuantity('');
      setUom('');
      setWarehouse('');
      setCustomer('');
    }
  }

  useEffect(() => {
    if (!!selectedDispatchOrder) {
      selectProductInward(selectedDispatchOrder.productInwardId || '');
      setQuantity(selectedDispatchOrder.quantity || '');
      console.log(selectedDispatchOrder.shipmentDate)
      setShipmentDate(selectedDispatchOrder.shipmentDate || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
      setActive(!!selectedDispatchOrder.isActive);
    } else {
      selectProductInward('');
      setQuantity('');
      setShipmentDate('');
      setReceiverName('');
      setReceiverPhone('');
      setActive(false);
    }
  }, [selectedDispatchOrder, productInwards])
  const handleSubmit = e => {

    const newDispatchOrder = {
      quantity,
      shipmentDate,
      productInwardId,
      receiverName,
      receiverPhone,
      isActive
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
              <Grid item sm={6}>
                <Select
                  fullWidth={true}
                  margin="dense"
                  id="productInwardId"
                  label="ProductInward"
                  variant="outlined"
                  value={productInwardId}
                  onChange={e => selectProductInward(e.target.value)}
                >
                  {productInwards.map(productInward => <MenuItem key={productInward.id} value={productInward.id}>{productInward['Product.name']}::{productInward.quantity}</MenuItem>)}
                </Select>
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
                    id="availableQuantity"
                    label="Available Quantity"
                    type="text"
                    variant="outlined"
                    value={availableQuantity}
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
              {!selectedDispatchOrder ? 'Add Dispatch Order' : 'Update Dispatch Order'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}