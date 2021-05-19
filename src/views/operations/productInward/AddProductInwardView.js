import { useState, useEffect, useRef } from 'react';
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
import { isRequired } from '../../../utils/validators';
import { useReactToPrint } from 'react-to-print';

export default function AddProductInwardView({ addProductInward, open, handleClose, selectedProductInward, products, warehouses, customers, formErrors }) {
  const [validation, setValidation] = useState({});
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

    setValidation({
      quantity: true,
      customerId: true,
      productId: true,
      warehouseId: true
    });
    if (isRequired(quantity) &&
      isRequired(customerId) &&
      isRequired(productId) &&
      isRequired(warehouseId)) {
      addProductInward(newProductInward);
    }
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
              {!selectedProductInward ? 'Add Product Inward' : 'Edit Product Inward'}
          </DialogTitle>
          
          <DialogContent ref={componentRef}>
            {formErrors}
            <Grid container>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Customer</InputLabel>
                    <Select
                      fullWidth={true}
                      id="customerId"
                      label="Customer"
                      variant="outlined"
                      value={customerId}
                      disabled={!!selectedProductInward}
                      onChange={e => setCustomerId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, customerId: true })}
                    >
                      <MenuItem value="" disabled>Select a customer</MenuItem>
                      {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.companyName}</MenuItem>)}
                    </Select>
                    {validation.customerId && !isRequired(customerId) ? <Typography color="error">Customer is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Product</InputLabel>
                    <Select
                      fullWidth={true}
                      id="productId"
                      label="Product"
                      variant="outlined"
                      value={productId}
                      disabled={!!selectedProductInward}
                      onChange={e => selectProduct(e.target.value)}
                      onBlur={e => setValidation({ ...validation, productId: true })}
                    >
                      <MenuItem value="" disabled>Select a product</MenuItem>
                      {products.map(product => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
                    </Select>
                    {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Warehouse</InputLabel>
                    <Select
                      fullWidth={true}
                      id="warehouseId"
                      label="Warehouse"
                      variant="outlined"
                      value={warehouseId}
                      disabled={!!selectedProductInward}
                      onChange={e => setWarehouseId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, warehouseId: true })}
                    >
                      <MenuItem value="" disabled>Select a warehouse</MenuItem>
                      {warehouses.map(warehouse => <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>)}
                    </Select>
                    {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : ''}
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
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="quantity"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  value={quantity}
                  disabled={!!selectedProductInward}
                  onChange={e => setQuantity(e.target.value)}
                  onBlur={e => setValidation({ ...validation, quantity: true })}
                />
                {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedProductInward ? 'Add Product Inward' : 'Update Product Inward'}
            </Button>
            {/* {
              !selectedProductInward ? 
              ''
              :
            <Button onClick={handlePrint} color="primary" variant="contained">
              Print
            </Button>
            } */}
          </DialogActions>
        </Dialog>
      </form>
    </div >
  );
}