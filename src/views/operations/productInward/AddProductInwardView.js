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

export default function AddProductInwardView({ addProductInward, open, handleClose, selectedProductInward, products, warehouses, customers, formErrors }) {
  const [quantity, setQuantity] = useState(0);
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
    if (!!selectedProductInward) {
      setQuantity(selectedProductInward.quantity || '');
      setCustomerId(selectedProductInward.customerId || '');
      selectProduct(selectedProductInward.productId || '');
      setWarehouseId(selectedProductInward.warehouseId || '');
    } else {
      setQuantity('');
      setCustomerId('');
      selectProduct('');
      setUom('');
      setWarehouseId('');
    }
  }, [selectedProductInward, products, warehouses, customers])
  const handleSubmit = e => {

    const newProductInward = {
      quantity,
      customerId,
      productId,
      warehouseId
    }

    addProductInward(newProductInward);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedProductInward ? 'Add Product Inward' : 'Edit Product Inward'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Customer</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="customerId"
                      label="Customer"
                      variant="outlined"
                      value={customerId}
                      disabled={selectedProductInward}
                      onChange={e => setCustomerId(e.target.value)}
                    >
                      {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.companyName}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Product</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="productId"
                      label="Product"
                      variant="outlined"
                      value={productId}
                      disabled={selectedProductInward}
                      onChange={e => selectProduct(e.target.value)}
                    >
                      {products.map(product => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="warehouseId"
                      label="Warehouse"
                      variant="outlined"
                      value={warehouseId}
                      disabled={selectedProductInward}
                      onChange={e => setWarehouseId(e.target.value)}
                    >
                      {warehouses.map(warehouse => <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>)}
                    </Select>
                  </FormControl>
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
                  id="quantity"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  value={quantity}
                  disabled={selectedProductInward}
                  onChange={e => setQuantity(e.target.value)}

                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedProductInward ? 'Add Product Inward' : 'Update Product Inward'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}