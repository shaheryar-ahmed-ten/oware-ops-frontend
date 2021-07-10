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
  TableBody,
  makeStyles
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { Alert } from '@material-ui/lab';
import { isRequired } from '../../../utils/validators';
import { useReactToPrint } from 'react-to-print';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useLocation } from 'react-router';

const useStyles = makeStyles((theme) => ({
  parentContainer: {
    boxSizing: 'border-box',
    padding: "30px 30px",
  },
  pageHeading: {
    fontWeight: 600
  },
  pageSubHeading: {
    fontWeight: 300
  }
}));
export default function AddProductInwardView() {
  const classes = useStyles();
  const { state } = useLocation();
  const { viewOnly } = state;
  const [selectedProductInward, setSelectedProductInward] = useState(state ? state.selectedProductInward : null);

  const [validation, setValidation] = useState({});
  const [customerId, setCustomerId] = useState('');
  const [uom, setUom] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);

  const [productGroups, setProductGroups] = useState([]);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  const [showMessage, setShowMessage] = useState(null);
  useEffect(() => {
    getRelations();
  }, []);

  const getRelations = () => {
    axios.get(getURL('product-inward/relations'))
      .then(res => {
        setProducts(res.data.products)
        setWarehouses(res.data.warehouses)
        setCustomers(res.data.customers)
      });
  };
  const selectProduct = value => {
    setProductId(value);
    if (value) setUom(products.find(product => product.id == value).UOM.name);
    else setUom('');
  }

  useEffect(() => {
    if (!!selectedProductInward) {
      setQuantity(selectedProductInward.quantity || '');
      setCustomerId(selectedProductInward.customerId || '');
      selectProduct('');
      setWarehouseId(selectedProductInward.Warehouse.id || '');
      setReferenceId(selectedProductInward.referenceId || '');
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


  const updateProductsTable = () => {
    if (isRequired(quantity) &&
      isRequired(customerId) &&
      isRequired(productId) &&
      isRequired(warehouseId)) {
      setProductGroups([...productGroups, {
        product: products.find(_product => _product.id == productId),
        id: productId,
        quantity
      }])
    }
    else {
      setValidation({
        quantity: true,
        customerId: true,
        referenceId: true,
        productId: true,
        warehouseId: true
      });
    }
  }

  const addProductInward = data => {
    let apiPromise = null;
    if (!selectedProductInward) apiPromise = axios.post(getURL('product-inward'), data);
    else apiPromise = axios.put(getURL(`product-inward/${selectedProductInward.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New products inward have been created."
      })
    })
      .catch((err) => {
        console.log(err)
      });
  };

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
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <InputLabel>Customer</InputLabel>
            <Select
              fullWidth={true}
              id="customerId"
              label="Customer"
              variant="outlined"
              value={customerId}
              disabled={viewOnly}
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
              disabled={viewOnly}
              onChange={e => setWarehouseId(e.target.value)}
              onBlur={e => setValidation({ ...validation, warehouseId: true })}
            >
              <MenuItem value="" disabled>Select a warehouse</MenuItem>
              {warehouses.map(warehouse => <MenuItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</MenuItem>)}
            </Select>
            {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : ''}
          </FormControl>
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="referenceId"
            label="Reference Id"
            type="text"
            variant="outlined"
            value={referenceId}
            disabled={viewOnly}
            onChange={e => setReferenceId(e.target.value)}
            inputProps={{ maxLength: 30 }}
            onBlur={e => setValidation({ ...validation, referenceId: true })}
          />
          {validation.referenceId && !isRequired(referenceId) ? <Typography color="error">ReferenceId is required!</Typography> : ''}
        </Grid>
        {
          !viewOnly ?
            <Grid item sm={12}>
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
                  onBlur={e => setValidation({ ...validation, productId: true })}
                />
                {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
              </FormControl>
            </Grid>
            :
            ''
        }
        <Grid item sm={12}>
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
        <Grid item sm={12}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            value={quantity}
            disabled={viewOnly}
            onChange={e => setQuantity(e.target.value)}
            onBlur={e => setValidation({ ...validation, quantity: true })}
          />
          {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
        </Grid>

      </Grid>
      {
        viewOnly ?
          <TableContainer className={classes.parentContainer}>
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
                {selectedProductInward.Products.map((product, idx) => {
                  return (
                    <TableRow hover role="checkbox">
                      <TableCell>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        {product.UOM.name}
                      </TableCell>
                      <TableCell>
                        {product.InwardGroup.quantity}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <>
            <Grid item sm={12}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button variant="contained" onClick={updateProductsTable} color="primary" variant="contained">Add Product</Button>
              </FormControl>
            </Grid>
            <TableContainer className={classes.parentContainer}>
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
          </>
      }

      {
        productGroups.length > 0 ?
          <Grid container className={classes.parentContainer} xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button onClick={handleSubmit} color="primary" variant="contained">
                  {!selectedProductInward ? 'Add Products' : 'Update Product'}
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          :
          ''}



      <MessageSnackbar showMessage={showMessage} />
    </>
  );
}

{/* <div style={{ display: "inline" }}>
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
</div > */}
