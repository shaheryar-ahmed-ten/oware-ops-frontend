import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  FormControl,
  Typography,
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core'
import { isRequired, isPhone } from '../../../utils/validators';
import { checkForMatchInArray, dateToPickerFormat, getURL } from '../../../utils/common';
import { Alert, Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { TableContainer } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
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
}));

export default function AddStockManagement() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { state } = useLocation();
  const 
  [selectedDispatchOrder, setSelectedDispatchOrder] = useState(state ? state.selectedDispatchOrder : null),
  [warehouses, setWarehouses] = useState([]),
  [products, setProducts] = useState([]),
  [validation, setValidation] = useState({}),
  [quantity, setQuantity] = useState(0),
  [shipmentDate, setShipmentDate] = useState(''),
  [receiverName, setReceiverName] = useState(''),
  [receiverPhone, setReceiverPhone] = useState(''),
  [availableQuantity, setAvailableQuantity] = useState(0),
  [inventoryId, setInventoryId] = useState(''),
  [uom, setUom] = useState(''),
  [customerId, setCustomerId] = useState(''),
  [warehouseId, setWarehouseId] = useState(''),
  [productId, setProductId] = useState(''),
  [referenceId, setReferenceId] = useState(''),
  [internalIdForBusiness, setInternalIdForBusiness] = useState(''),
  [selectedCustomerName, setSelectedCustomerName] = useState(''),
  [formErrors, setFormErrors] = useState([]),
  [customers, setCustomers] = useState([]),
  [inventories, setInventories] = useState([]),
  [showMessage, setShowMessage] = useState(null),
  [messageType, setMessageType] = useState(null);

  useEffect(() => {
    getRelations();
  }, []);
  const getRelations = () => {
    axios.get(getURL('/dispatch-order/relations'))
      .then(res => {
        setCustomers(res.data.customers);
      })
      .catch((err) => {
        console.log(err)
      });
  };

  useEffect(() => {
    if (!!selectedDispatchOrder) {
      setQuantity(0);
      setShipmentDate(dateToPickerFormat(selectedDispatchOrder.shipmentDate) || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
      setInventoryId(selectedDispatchOrder.inventoryId || '');
      setCustomerId(selectedDispatchOrder.Inventory.customerId);
      setReferenceId(selectedDispatchOrder.referenceId || '');
      if (products.length > 0 && inventories.length == 0) {
        selectedDispatchOrder.Inventories.forEach(inventory => {
          setInventories((prevState) => ([
            ...prevState,
            {
              product: products.find(_product => _product.id == inventory.Product.id),
              // id: inventory.id,
              id: inventoryId,
              quantity: inventory.OrderGroup.quantity
            }
          ]))
        });
      }
    } else {
      setInventoryId('');
      setQuantity('');
      setCustomerId('');
      setWarehouseId('');
      setProductId('');
      setShipmentDate(dateToPickerFormat(new Date()));
      setReceiverName('');
      setReceiverPhone();
      setReferenceId('');
    }
  }, [selectedDispatchOrder])

  useEffect(() => {
    setWarehouses([]);
    setWarehouseId('');
    setProducts([]);
    setProductId('');
    if (!customerId) return;
    if (!!selectedDispatchOrder) {
      setWarehouses([selectedDispatchOrder.Inventory.Warehouse]);
      setWarehouseId(selectedDispatchOrder.Inventory.warehouseId);
    } else {
      getWarehouses({ customerId })
        .then(warehouses => {
          return setWarehouses(warehouses)
        });
    }
  }, [customerId]);

  useEffect(() => {
    setProducts([]);
    setProductId('');
    if (!customerId && !warehouseId) return;
    if (!!selectedDispatchOrder) {
      setProducts([selectedDispatchOrder.Inventory.Product]);
    } else {
      const warehouse = warehouses.find(element => warehouseId == element.id);
      setInternalIdForBusiness(`DO-${warehouse.businessWarehouseCode}-`);
      getProducts({ customerId, warehouseId })
        .then(products => {
          return setProducts(products)
        }); // INPROGRESS: products with 0 available qty are also comming.
    }
  }, [warehouseId])

  useEffect(() => {
    setUom('');
    setQuantity('');
    setAvailableQuantity(0);
    setInventoryId('');
    if (customerId && warehouseId && productId) {
      const product = products.find(product => product.id == productId);
      setUom(product.UOM.name);
      getInventory({ customerId, warehouseId, productId })
        .then(inventory => {
          if (inventory) {
            setAvailableQuantity(inventory.availableQuantity);
            setInventoryId(inventory.id);
          }
        })
    }

  }, [productId]);

  const getInventory = (params) => {
    return axios.get(getURL('/dispatch-order/inventory'), { params })
      .then(res => res.data.inventory);
  };

  const getWarehouses = (params) => {
    return axios.get(getURL('/dispatch-order/warehouses'), { params })
      .then(res => {
        return res.data.warehouses
      });
  };

  const getProducts = (params) => {
    return axios.get(getURL('/dispatch-order/products'), { params })
      .then((res) => {
        return res.data.products
      })
  };


  const addDispatchOrder = data => {
    let apiPromise = null;
    if (!selectedDispatchOrder) apiPromise = axios.post(getURL('/dispatch-order'), data);
    else apiPromise = axios.put(getURL(`dispatch-order/${selectedDispatchOrder.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New dispatch order has been created."
      });
      setTimeout(() => {
        navigate('/operations/dispatch-order')
      }, 2000);
    });
  };

  const updateDispatchOrdersTable = () => {
    if (isRequired(customerId) &&
      isRequired(warehouseId) &&
      isRequired(receiverName) &&
      isRequired(receiverPhone) &&
      isRequired(productId) &&
      isRequired(quantity)) {
      // checking if particular product is already added once
      // if yes
      if (checkForMatchInArray(inventories, "id", inventoryId)) {
        setMessageType('#FFCC00')
        setShowMessage({ message: "This product is already added, please choose a different one." })
      }
      // if no
      else {
        setMessageType('green')
        setInventories([...inventories, {
          product: products.find(_product => _product.id == productId),
          // id: productId,
          id: inventoryId,
          quantity
        }])
      }
    }
    else {
      setValidation({
        customerId: true,
        warehouseId: true,
        receiverName: true,
        receiverPhone: true,
        productId: true,
        quantity: true
      });
    }
  }

  // Done: uncomment dispatch orderId when DO is created
  const handleSubmit = e => {
    setMessageType('green')
    const newDispatchOrder = {
      quantity,
      inventories,
      inventoryId,
      customerId,
      warehouseId,
      productId,
      shipmentDate,
      receiverName,
      receiverPhone,
      referenceId,
      internalIdForBusiness
    }

    setValidation({
      quantity: true,
      inventoryId: true,
      customerId: true,
      warehouseId: true,
      productId: true,
      shipmentDate: true,
      receiverName: true,
      receiverPhone: true
    });
    if (
      isRequired(customerId) &&
      isRequired(shipmentDate) &&
      isRequired(receiverName) &&
      isRequired(receiverPhone)) {
      addDispatchOrder(newDispatchOrder);
    }
  }

  const handleCustomerSearch = (customerId, customerName) => {
    setCustomerId(customerId);
    setSelectedCustomerName(customerName)
  }

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Add Stock Management</Typography>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="customer"
              options={customers}
              defaultValue={selectedDispatchOrder ? { name: selectedDispatchOrder.Inventory.Company.name, id: customerId } : ''}
              getOptionLabel={(customer) => customer.name || ""}
              onChange={(event, newValue) => {
                if (newValue)
                  handleCustomerSearch(newValue.id, (newValue.name || ''))
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
              options={warehouses}
              defaultValue={selectedDispatchOrder ? { name: selectedDispatchOrder.Inventory.Warehouse.name, id: selectedDispatchOrder.Inventory.Warehouse.id } : ''}
              getOptionLabel={(warehouse) => warehouse.name || ""}
              onChange={(event, newValue) => {
                if (newValue)
                  setWarehouseId(newValue.id)
              }}
              renderInput={(params) => <TextField {...params} label="Warehouse" variant="outlined" />}
              onBlur={e => setValidation({ ...validation, warehouseId: true })}
            />
            {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : ''}
          </FormControl>
        </Grid>
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

        <Grid item xs={12}>
          <Typography variant="h4" className={classes.heading}>Product Details</Typography>
        </Grid>
        <Grid container item xs={12} alignItems="center" spacing={1}>
          <Grid item sm={4}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="product"
                options={products}
                getOptionLabel={(product) => product.name || ""}
                onChange={(event, newValue) => {
                  if (newValue)
                    setProductId(newValue.id)
                }}
                renderInput={(params) => <TextField {...params} label="Product" variant="outlined" />}
                onBlur={e => setValidation({ ...validation, productId: true })}
              />
              {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={2}>
            <TextField
              fullWidth={true}
              margin="normal"
              InputProps={{ inputProps: { min: 0, max: availableQuantity } }}
              id="quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              disabled={!!selectedDispatchOrder}
              onChange={e => e.target.value < 0 ? e.target.value == 0 :  e.target.value < availableQuantity ? setQuantity(e.target.value) : setQuantity(availableQuantity)}
              onBlur={e => setValidation({ ...validation, quantity: true })}
            />
            {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
          </Grid>
          <Grid item sm={2}>
            <TextField
              fullWidth={true}
              margin="normal"
              id="availableQuantity"
              label="Available Quantity"
              type="number"
              variant="filled"
              value={availableQuantity}
              disabled
            />
          </Grid>
          <Grid item sm={2}>
            <TextField
              fullWidth={true}
              margin="normal"
              id="uom"
              label="UOM"
              type="text"
              variant="filled"
              value={uom}
              disabled
            />
          </Grid>
          <Grid item sm={2}>
            <TextField
              fullWidth={true}
              margin="normal"
              InputProps={{ inputProps: { min: 0, max: availableQuantity } }}
              id="quantity"
              label="Comment"
              type="number"
              variant="outlined"
              value={quantity}
              disabled={!!selectedDispatchOrder}
              onChange={e => e.target.value < 0 ? e.target.value == 0 :  e.target.value < availableQuantity ? setQuantity(e.target.value) : setQuantity(availableQuantity)}
              onBlur={e => setValidation({ ...validation, quantity: true })}
            />
            {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : ''}
          </Grid>
          <Grid item sm={2}>
            <Button variant="contained" onClick={updateDispatchOrdersTable} color="primary" fullWidth >Add</Button>
          </Grid>
        </Grid>
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
                Quantity
              </TableCell>
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                Available Quantity
              </TableCell>
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                UoM
              </TableCell>
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                Comments
              </TableCell>
              <TableCell>
                  Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((dispatchGroup, idx) => {
              return (
                <TableRow hover role="checkbox">
                  <TableCell>
                    {dispatchGroup.product.name}
                  </TableCell>
                  <TableCell>
                    {dispatchGroup.product.UOM.name}
                  </TableCell>
                  <TableCell>
                    {dispatchGroup.quantity}
                  </TableCell>
                  <TableCell>
                    <DeleteIcon color="error" key="delete" onClick={() =>
                      setInventories(inventories.filter((_dispatchGroup, _idx) => _idx != idx))
                    } />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {
        inventories.length > 0 ?
          <Grid container className={classes.parentContainer} xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button onClick={handleSubmit} color="primary" variant="contained">
                  {!selectedDispatchOrder ? 'Create Stock Management' : 'Update Stock Management'}
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
