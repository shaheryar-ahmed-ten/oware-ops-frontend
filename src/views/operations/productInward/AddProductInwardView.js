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
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteOutlined';

import { isRequired } from '../../../utils/validators';
import { useReactToPrint } from 'react-to-print';
import { Autocomplete } from '@material-ui/lab';

export default function AddProductInwardView({ addProductInward, open, handleClose, selectedProductInward, products, warehouses, customers, formErrors }) {
  const [validation, setValidation] = useState({});
  const [customerId, setCustomerId] = useState('');
  const [uom, setUom] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);

  const [productGroups, setProductGroups] = useState([]);

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
  }, [selectedProductInward, products, warehouses, customers]);

  useEffect(() => {
    // setProductId('');
    // setQuantity('');
  }, [productGroups]);



  const handleSubmit = e => {

    const newProductInward = {
      customerId,
      productId,
      quantity,
      warehouseId,
      referenceId,
      products: productGroups
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
                      {customers.map(customer => <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>)}
                    </Select>
                    {validation.customerId && !isRequired(customerId) ? <Typography color="error">Customer is required!</Typography> : ''}
                  </FormControl>
                </Grid>

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
              </Grid>
            </Grid>
            <Grid container spacing={2}>
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
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="Product"
                    options={products}
                    getOptionLabel={(product) => product.name}
                    onChange={(event, newValue) => {
                      if (newValue)
                        selectProduct(newValue.id)
                    }}
                    renderInput={(params) => <TextField {...params} label="Product" variant="outlined" />}
                  />
                  {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
                </FormControl>
              </Grid>
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
              <Grid item sm={6}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Button variant="contained" onClick={() => setProductGroups([...productGroups, {
                    product: products.find(_product => _product.id == productId),
                    id: productId,
                    quantity
                  }])} color="primary" variant="contained">Add Product</Button>
                </FormControl>
              </Grid>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Name
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      UoM
                    </TableCell>
                    <TableCell
                      style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                      Quantity
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productGroups.map((productGroup, idx) => {
                    return (
                      <TableRow hover role="checkbox">
                        <TableCell>
                          {productGroup.product.name}
                        </TableCell>
                        <TableCell>
                          {productGroup.product.UOM.name}
                        </TableCell>
                        <TableCell>
                          {productGroup.quantity}
                        </TableCell>
                        <TableCell>
                          <DeleteIcon color="error" key="delete" onClick={() =>
                            setProductGroups(productGroups.filter((_productGroup, _idx) => _idx != idx))
                          } />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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