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
import { checkForMatchInArray, getURL } from '../../../utils/common';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useLocation, useNavigate } from 'react-router';

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
  },
  heading: {
    fontWeight: 'bolder'
  },
  shadedTableHeader: {
    backgroundColor: 'rgba(202,201,201,0.3)'
  },
  tableHeadText: {
    background: 'transparent', fontWeight: 'bolder', fontSize: '12px'
  },
  subContainer: {
    boxSizing: 'border-box',
    padding: "14px 14px",
  }
}));
export default function AddProductInwardView() {
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { viewOnly } = state || '';
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

  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');

  const [showMessage, setShowMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

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
      setQuantity(0);
      setCustomerId(selectedProductInward.customerId || '');
      selectProduct('');
      setWarehouseId(selectedProductInward.Warehouse.id || '');
      setReferenceId(selectedProductInward.referenceId || '');
      if (products.length > 0 && productGroups.length == 0) {
        selectedProductInward.Products.forEach(product => {
          //correct way of updating states.
          setProductGroups((prevState) => ([
            ...prevState,
            {
              product: products.find(_product => _product.id == product.id),
              id: product.id,
              quantity: product.InwardGroup.quantity
            }
          ]))
        });
      }
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
      // checking if particular product is already added once
      // if yes
      if (checkForMatchInArray(productGroups, "id", productId)) {
        setMessageType('#FFCC00')
        setShowMessage({ message: "This product is already added, please choose a different one." })
      }
      // if no
      else {
        setProductGroups([...productGroups, {
          product: products.find(_product => _product.id == productId),
          id: productId,
          quantity
        }])
      }
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
      });
      setTimeout(() => {
        navigate('/operations/product-inward')
      }, 2000);
    })
      .catch((err) => {
        console.log(err)
      });
  };

  const handleSubmit = e => {
    setMessageType('green')
    const newProductInward = {
      customerId,
      productId,
      quantity,
      warehouseId,
      referenceId,
      products: productGroups,
      internalIdForBusiness
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
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Add Product Inward</Typography>
          <Button variant="contained" color="primary" onClick={()=>navigate('/operations/product-inward')}>
            Cancel
          </Button>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="customer"
              defaultValue={selectedProductInward ? { name: selectedProductInward.Company.name, id: selectedProductInward.Company.id } : ''}
              options={customers}
              getOptionLabel={(customer) => customer.name || ""}
              onChange={(event, newValue) => {
                if (newValue)
                  setCustomerId(newValue.id)
              }}
              renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
              onBlur={e => setValidation({ ...validation, customerId: true })}
            />
            {validation.customerId && !isRequired(customerId) ? <Typography color="error">Company is required!</Typography> : ''}
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="warehouse"
              defaultValue={selectedProductInward ? { name: selectedProductInward.Warehouse.name, id: selectedProductInward.Warehouse.id } : ''}
              options={warehouses}
              getOptionLabel={(warehouse) => warehouse.name || ""}
              onChange={(event, newValue) => {
                if (newValue) {
                  setWarehouseId(newValue.id);
                  setInternalIdForBusiness(`PI-${newValue.businessWarehouseCode}-`);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Warehouse" variant="outlined" />}
              onBlur={e => setValidation({ ...validation, warehouseId: true })}
            />
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

        <Grid item xs={12}>
          <Typography variant="h4" className={classes.heading}>Product Details</Typography>
        </Grid>
        <Grid container alignItems="center" spacing={2} className={classes.subContainer} >
          <Grid item xs={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="Product"
                options={products}
                getOptionLabel={(product) => product.name || ""}
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
          <Grid item xs={2}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              disabled={viewOnly}
              onChange={e => setQuantity(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={e => setValidation({ ...validation, quantity: true })}
              InputProps={{ inputProps: { min: 1 } }}
              margin="normal"
            />
            {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth={true}
              margin="dense"
              id="uom"
              label="UOM"
              type="text"
              variant="filled"
              value={uom}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={2} className={classes.parentContainer}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Button variant="contained" onClick={updateProductsTable} color="primary" variant="contained">Add Product</Button>
            </FormControl>
          </Grid>
        </Grid>

      </Grid>

      <TableContainer className={classes.parentContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className={classes.shadedTableHeader}>
              <TableCell
                className={classes.tableHeadText}>
                Name
              </TableCell>
              <TableCell
                className={classes.tableHeadText}>
                UoM
              </TableCell>
              <TableCell
                className={classes.tableHeadText}>
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

      <MessageSnackbar showMessage={showMessage} type={messageType} />
    </>
  );
}
