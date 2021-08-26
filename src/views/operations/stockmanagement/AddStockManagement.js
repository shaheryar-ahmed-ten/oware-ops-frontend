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
import { useLocation, useNavigate, useParams } from 'react-router';

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
  const { uid } = useParams();

  const
    [selectedInventoryWastages, setSelectedInventoryWastages] = useState(null),
    [warehouses, setWarehouses] = useState([]),
    [products, setProducts] = useState([]),
    [validation, setValidation] = useState({}),
    [availableQuantity, setAvailableQuantity] = useState(0),
    [uom, setUom] = useState(''),
    [customerId, setCustomerId] = useState(''),
    [warehouseId, setWarehouseId] = useState(''),
    [productId, setProductId] = useState(''),
    [formErrors, setFormErrors] = useState([]),
    [customers, setCustomers] = useState([]),
    [showMessage, setShowMessage] = useState(null),
    [messageType, setMessageType] = useState(null);

  const [reasons, setReasons] = useState([{
    name: 'Damage'
  }, {
    name: 'Expired'
  }, {
    name: 'Other'
  }]) // to be displayed on dropdown
  const [quantity, setQuantity] = useState(0) // adjusted quantity
  const [reasonType, setReasonType] = useState('') // selcted reason 
  const [comment, setComment] = useState('') // optional comment
  const [adjustments, setAdjustments] = useState([]) // contains products along with adjusted quantities, will not be displayed at the bottom table
  const [adjustmentsSecondaryArray, setAdjustmentsSecondaryArray] = useState([]) // contains more details of added products to be displayed at the bottom table

  const [intentedCustomer, setIntentedCustomer] = useState(null) // will only be used for edit

  // If uid exists than fetch details of the selecteInventoryWastages  
  useEffect(() => {
    if (customers.length === 0)
      getRelations();
    if (uid)
      _getInventoryWastage(); // only in case of edit 
  }, [uid, customers]);

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
    setWarehouses([]);
    setWarehouseId('');
    setProducts([]);
    setProductId('');
    if (!customerId) return;
    if (!!selectedInventoryWastages) {
      setWarehouseId(selectedInventoryWastages.Inventory.warehouseId);
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
    if (!!selectedInventoryWastages) {
      setProducts([selectedInventoryWastages.Inventory.Product]);
    } else {
      const warehouse = warehouses.find(element => warehouseId == element.id);
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
    if (customerId && warehouseId && productId) {
      const product = products.find(product => product.id == productId);
      setUom(product.UOM.name);
      getInventory({ customerId, warehouseId, productId })
        .then(inventory => {
          if (inventory) {
            setAvailableQuantity(inventory.availableQuantity);
          }
        })
    }

  }, [productId]);

  const _getInventoryWastage = () => {
    axios.get(getURL(`inventory-wastages/${uid}`))
      .then((res) => {
        setSelectedInventoryWastages(res.data.data)
        setCustomerId(res.data.data.Inventory.customerId)
        setWarehouseId(res.data.data.Inventory.warehouseId)
        setAdjustmentsSecondaryArray([{
          product: res.data.data.Inventory.Product,
          availableQuantity: res.data.data.Inventory.availableQuantity,
          reasonType: res.data.data.reasonType,
          comment: res.data.data.comment,
          adjustmentQuantity: res.data.data.adjustmentQuantity
        }])
        setAdjustments([{
          // product id
          productId: res.data.data.Inventory.Product.id,
          // type 
          type: res.data.data.reasonType,
          // reason
          reason: res.data.data.comment,
          // adjustmentQuantity
          adjustmentQuantity: res.data.data.adjustmentQuantity
        }]) // will be sent to the backend
      })
      .catch((error) => {
        console.log(error)
      })
  }

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


  const addAdjustments = data => {
    let apiPromise = null;
    if (!selectedInventoryWastages) apiPromise = axios.post(getURL('/inventory-wastages'), data);
    else apiPromise = axios.put(getURL(`inventory-wastages/${selectedInventoryWastages.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New Adjustments have been created."
      });
      setTimeout(() => {
        navigate('/operations/stock-management')
      }, 2000);
    });
  };

  const updateAdjustmentsTable = () => {
    if (isRequired(customerId) &&
      isRequired(warehouseId) &&
      isRequired(productId) &&
      isRequired(quantity)) {
      // checking if particular product is already added once
      // if yes
      if (checkForMatchInArray(adjustments, "productId", productId)) {
        setMessageType('#FFCC00')
        setShowMessage({ message: "This product is already added, please choose a different one." })
      }
      // if no
      else {
        setMessageType('green')
        setAdjustments([...adjustments, {
          // product id
          productId: productId,
          // type 
          type: reasonType,
          // reason
          reason: comment,
          // adjustmentQuantity
          adjustmentQuantity: quantity
        }]) // will be sent to the backend
        setAdjustmentsSecondaryArray([...adjustmentsSecondaryArray, {
          product: products.find(_product => _product.id == productId),
          availableQuantity,
          reasonType,
          comment,
          adjustmentQuantity: quantity
        }])
      }
    }
    else {
      setValidation({
        customerId: true,
        warehouseId: true,
        productId: true,
        quantity: true
      });
    }
  }

  // Done: uncomment dispatch orderId when DO is created
  const handleSubmit = e => {
    setMessageType('green')
    const adjustmentsObject = {
      customerId,
      warehouseId,
      adjustment_products: adjustments
    }

    setValidation({
      customerId: true,
      warehouseId: true,
    });
    if (isRequired(customerId)) {
      addAdjustments(adjustmentsObject);
    }
  }

  const handleUpdate = () => {
    const adjustmentsObject = {
      adjustmentQuantity: adjustmentsSecondaryArray[0].adjustmentQuantity,
      type: adjustmentsSecondaryArray[0].reasonType,
      reason: adjustmentsSecondaryArray[0].comment
    }
    addAdjustments(adjustmentsObject);
  }

  const handleCustomerSearch = (customerId, customerName) => {
    setCustomerId(customerId);
  }

  // For edit only
  const handleEditAdjustmentQtyForEdit = (e, adjustmentToAlter, name) => {
    setAdjustmentsSecondaryArray(
      [
        {
          ...adjustmentsSecondaryArray.find((adjustment) => adjustment.product.id === adjustmentToAlter.product.id),
          [name]: e.target.value
        }])
    // setAdjustments(
    //   [...adjustments.filter((adjustment) => adjustment.productId !== adjustmentToAlter.product.id),
    //   {
    //     ...adjustments.find((adjustment) => adjustment.productId === adjustmentToAlter.product.id),
    //     [name]: e.target.value
    //   }]) // this wont be sent to  backend while editing
  }

  return (
    <>
      {formErrors}
      < Grid container className={classes.parentContainer} spacing={3} >
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Add Stock Management</Typography>
        </Grid>
        <Grid item sm={6}>
          {
            selectedInventoryWastages ?
              <TextField
                fullWidth={true}
                margin="normal"
                id="customerId"
                label="Company"
                variant="outlined"
                value={selectedInventoryWastages.Inventory.Company.name}
                disabled={!!selectedInventoryWastages}
              />
              :
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Autocomplete
                  id="customerId"
                  options={customers}
                  defaultValue={selectedInventoryWastages ? { name: selectedInventoryWastages.Inventory.Company.name, id: selectedInventoryWastages.Inventory.Company.id } : ''}
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
          }
        </Grid>
        <Grid item sm={6}>
          {
            selectedInventoryWastages ?
              <TextField
                fullWidth={true}
                margin="normal"
                id="warehouseId"
                label="Warehouse"
                variant="outlined"
                value={selectedInventoryWastages.Inventory.Warehouse.name}
                disabled={!!selectedInventoryWastages}
              />
              :
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Autocomplete
                  id="warehouse"
                  options={warehouses}
                  defaultValue={selectedInventoryWastages ? { name: selectedInventoryWastages.Inventory.Warehouse.name, id: selectedInventoryWastages.Inventory.Warehouse.id } : ''}
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
          }

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
                  if (newValue) {
                    setProductId(newValue.id)
                  }
                }}
                renderInput={(params) => <TextField {...params} label="Product" variant="outlined" />}
                onBlur={e => setValidation({ ...validation, productId: true })}
                disabled={!!selectedInventoryWastages}
              />
              {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={4}>
            <TextField
              fullWidth={true}
              margin="normal"
              id="quantityAdjust"
              label="Quantity to adjust"
              variant="outlined"
              value={quantity}
              disabled={!!selectedInventoryWastages}
              onChange={e => e.target.value < 0 ? e.target.value == 0 : e.target.value < availableQuantity ? setQuantity(e.target.value) : setQuantity(availableQuantity)}
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
          <Grid item sm={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="reasonType"
                options={reasons}
                // defaultValue={selectedInventoryWastages ? { name: selectedInventoryWastages.Inventory.Company.name, id: customerId } : ''}
                getOptionLabel={(reasons) => reasons.name || ""}
                onChange={(event, newValue) => {
                  if (newValue)
                    setReasonType(newValue.name)
                }}
                renderInput={(params) => <TextField {...params} label="Reason Type" variant="outlined" />}
                onBlur={e => setValidation({ ...validation, reasonType: true })}
                disabled={!!selectedInventoryWastages}
              />
              {validation.reasonType && !isRequired(reasonType) ? <Typography color="error">Reason type is required!</Typography> : ''}
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              margin="normal"
              InputProps={{ inputProps: { min: 0, max: availableQuantity } }}
              id="quantity"
              label="Comment"
              variant="outlined"
              value={comment}
              onChange={e => setComment(e.target.value)}
              disabled={!!selectedInventoryWastages}
            />
          </Grid>
          <Grid item sm={2}>
            <Button variant="contained" onClick={updateAdjustmentsTable} color="primary" fullWidth disabled={!!selectedInventoryWastages} >Add</Button>
          </Grid>
        </Grid>
      </Grid >

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
                Available Quantity (Before Adjustment)
              </TableCell>
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                Adjusted Quantity
              </TableCell>
              {
                selectedInventoryWastages ?
                  null
                  :
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Remaining Quantity (After Adjustment)
                  </TableCell>
              }
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                Reason
              </TableCell>
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                Comment
              </TableCell>
              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adjustmentsSecondaryArray.map((adjustment, idx) => {
              return (
                <TableRow hover role="checkbox" key={idx}>
                  <TableCell>
                    {adjustment.product.name}
                  </TableCell>
                  <TableCell>
                    {adjustment.product.UOM.name}
                  </TableCell>
                  <TableCell>
                    {adjustment.availableQuantity}
                  </TableCell>
                  <TableCell>
                    {
                      selectedInventoryWastages ?
                        <TextField
                          fullWidth={true}
                          id="editAdjustmentQty"
                          label="Quantity to adjust"
                          variant="outlined"
                          value={adjustment.adjustmentQuantity}
                          onChange={e => handleEditAdjustmentQtyForEdit(e, adjustmentsSecondaryArray[idx], 'adjustmentQuantity')}
                        />
                        :
                        adjustment.adjustmentQuantity
                    }
                  </TableCell>
                  {
                    selectedInventoryWastages ?
                      null
                      :
                      <TableCell>
                        {adjustment.availableQuantity - adjustment.adjustmentQuantity}
                      </TableCell>
                  }
                  <TableCell>
                    {
                      selectedInventoryWastages ?
                        <TextField
                          fullWidth={true}
                          id="editAdjustmentReason"
                          label="Reason Type"
                          variant="outlined"
                          value={adjustment.reasonType}
                          onChange={e => handleEditAdjustmentQtyForEdit(e, adjustmentsSecondaryArray[idx], 'reasonType')}
                        />
                        :
                        adjustment.reasonType}
                  </TableCell>
                  <TableCell>
                    {
                      selectedInventoryWastages ?
                        <TextField
                          fullWidth={true}
                          id="Comment"
                          label="Comment"
                          variant="outlined"
                          value={adjustment.comment}
                          onChange={e => handleEditAdjustmentQtyForEdit(e, adjustmentsSecondaryArray[idx], 'comment')}
                        />
                        :
                        adjustment.comment}
                  </TableCell>
                  <TableCell>
                    <DeleteIcon color="error" key="delete" onClick={() => {
                      setAdjustments(adjustments.filter((adjustment, _idx) => _idx != idx));
                      setAdjustmentsSecondaryArray(adjustmentsSecondaryArray.filter((adjustmentsSecondaryArray, _idx) => _idx != idx))
                    }
                    } />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {
        adjustmentsSecondaryArray.length > 0 ?
          <Grid container className={classes.parentContainer} xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button onClick={!selectedInventoryWastages ? handleSubmit : handleUpdate} color="primary" variant="contained">
                  {!selectedInventoryWastages ? 'Create Stock Management' : 'Update Stock Management'}
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          :
          ''
      }

      <MessageSnackbar showMessage={showMessage} type={messageType} />
    </>
  );
}
