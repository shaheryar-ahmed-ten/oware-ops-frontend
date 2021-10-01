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
  TableCell,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@material-ui/core'
import { isRequired, isPhone } from '../../../utils/validators';
import { checkForMatchInArray, dateToPickerFormat, getURL } from '../../../utils/common';
import { Alert, Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { TableContainer } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate, useParams } from 'react-router';
import PriorityHighOutlinedIcon from '@material-ui/icons/PriorityHighOutlined';

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

  const [reasons, setReasons] = useState([]) // to be displayed on dropdown
  const [quantity, setQuantity] = useState(0) // adjusted quantity
  const [reasonType, setReasonType] = useState('') // selcted reason id
  const [comment, setComment] = useState('') // optional comment
  const [adjustments, setAdjustments] = useState([]) // contains products along with adjusted quantities, will not be displayed at the bottom table
  const [adjustmentsSecondaryArray, setAdjustmentsSecondaryArray] = useState([]) // contains more details of added products to be displayed at the bottom table

  const [reasonTypeLabel, setReasonTypeLabel] = useState('') // selcted reason label for adding

  const [selectedInventoryWastageInventories, setSelectedInventoryWastageInventories] = useState([]) // only for edit, to list all the inventories for edition

  useEffect(() => {
    getReasonsType()
  }, [])


  // If uid exists than fetch details of the selecteInventoryWastages  
  useEffect(() => {
    if (customers.length === 0)
      getRelations();
    if (uid)
      _getInventoryWastage(); // only in case of edit 
  }, [uid, customers]);

  const getRelations = () => {
    axios.get(getURL('dispatch-order/relations'))
      .then(res => {
        setCustomers(res.data.customers);
      })
      .catch((err) => {
        console.log(err)
      });
  };


  useEffect(() => {
    resetLocalStates()

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
    setComment('');
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

  // will be called for 
  const resetLocalStates = () => {
    setValidation({})
    setReasons([]);
    setWarehouses([]);
    setWarehouseId('');
    setProducts([]);
    setProductId('');
    getReasonsType();

    setReasonType('');
    setComment('');
    setQuantity(0);
  }

  const getReasonsType = () => {
    axios.get(getURL(`inventory-wastages/wastages-type`))
      .then((res) => {
        setReasons(res.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const _getInventoryWastage = () => {
    axios.get(getURL(`inventory-wastages/${uid}`))
      .then((res) => {
        if (res.data) {
          setSelectedInventoryWastages(res.data.data)
          const modifiedInventories = res.data.data.Inventories.map((inventory) => {
            // shifting to adjustment inventory
            inventory.AdjustmentInventory['remainingQuantity'] = inventory.availableQuantity + inventory.AdjustmentInventory.adjustmentQuantity
            inventory.AdjustmentInventory['actualAvailableQuantity'] = inventory.availableQuantity + inventory.AdjustmentInventory.adjustmentQuantity // saving qty before adjustment
            inventory.AdjustmentInventory['dirtyData'] = false
            return inventory
          })
          setSelectedInventoryWastageInventories(modifiedInventories || [])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getInventory = (params) => {
    return axios.get(getURL('dispatch-order/inventory'), { params })
      .then(res => res.data.inventory);
  };

  const getWarehouses = (params) => {
    return axios.get(getURL('dispatch-order/warehouses'), { params })
      .then(res => {
        return res.data.warehouses
      });
  };

  const getProducts = (params) => {
    return axios.get(getURL('dispatch-order/products'), { params })
      .then((res) => {
        return res.data.products
      })
  };


  const addAdjustments = data => {
    let apiPromise = null;
    if (!selectedInventoryWastages) apiPromise = axios.post(getURL('inventory-wastages'), data);
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
        navigate('/operations/stock-adjustment')
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
      if (checkForMatchInArray(adjustments, "productId", productId)
        &&
        checkForMatchInArray(adjustments, "customerId", customerId)
        &&
        checkForMatchInArray(adjustments, "warehouseId", warehouseId)
      ) {
        setMessageType('#FFCC00')
        setShowMessage({ message: "This product is already added for this company from this warehouse, please choose a different product/company/warehouse." })
      }
      // if no
      else {
        setMessageType('green')
        setAdjustments([...adjustments, {
          // product id
          productId: productId,
          // type 
          reason: reasonType,
          // reason
          comment,
          // adjustmentQuantity
          adjustmentQuantity: quantity,
          // customer Id
          customerId,
          // warehouse Id
          warehouseId
        }]) // will be sent to the backend
        setAdjustmentsSecondaryArray([...adjustmentsSecondaryArray, {
          product: products.find(_product => _product.id == productId),
          customer: customers.find(_customer => _customer.id == customerId),
          warehouse: warehouses.find(warehouse => warehouse.id == warehouseId),
          availableQuantity,
          reasonType: reasonTypeLabel,
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
        quantity: true,
        reasonType: true
      });
    }
  }

  // Done: uncomment dispatch orderId when DO is created
  const handleSubmit = e => {
    setMessageType('green')
    const adjustmentsObject = {
      // customerId,
      // warehouseId,
      adjustment_products: adjustments
    }

    setValidation({
      customerId: true,
      warehouseId: true,
    });
    if (isRequired(customerId)) {
      // console.log(adjustmentsObject)
      addAdjustments(adjustmentsObject);
    }
  }

  const verifyEditedAdjustmentQty = () => {
    return new Promise((resolve, reject) => {
      for (const inventory of selectedInventoryWastageInventories) {
        // verify if qty is 0 and not soft deleted
        if (!isRequired(inventory.AdjustmentInventory.adjustmentQuantity) && !inventory.AdjustmentInventory['softDelete'])
          return reject(false)
      }
      return resolve(true)
    })
  }

  const handleUpdate = async () => {
    const adjustment_products = [];
    setMessageType('green');

    verifyEditedAdjustmentQty()
      .then((res) => {
        setMessageType('green');
        selectedInventoryWastageInventories.forEach(inventory => {
          const { reason, comment, adjustmentQuantity } = inventory.AdjustmentInventory;
          const { id, availableQuantity } = inventory
          adjustment_products.push({ reason, comment, adjustmentQuantity, inventoryId: id, availableQuantity })
        });

        const adjustmentsObject = {
          adjustment_products
        }

        addAdjustments(adjustmentsObject);
      })
      .catch((err) => {
        setMessageType('#FFCC00')
        setShowMessage({ message: "Please make sure you have entered valid adjustment quantity." })
      })
  }

  const handleCustomerSearch = (customerId, customerName) => {
    setCustomerId(customerId);
  }

  // For edit only 
  // For udpating the values of individual adjustment
  const handleEdit = (value, IdOfAdjustmentToBeAltered, name) => {
    if (isNaN(value) && name === 'adjustmentQuantity') {
      value = 0
    }

    setSelectedInventoryWastageInventories((prevState) => {
      // Explain : We'll have to add another property in each inventory to track/calculate the remaining qty on real time
      return [
        ...selectedInventoryWastageInventories.map((inventory) => {
          if (inventory.id === IdOfAdjustmentToBeAltered) {
            inventory.AdjustmentInventory[name] = value
            name === 'adjustmentQuantity' ?
              inventory.AdjustmentInventory['dirtyData'] = true
              :
              inventory.AdjustmentInventory['dirtyData'] = false
          }
          return inventory
        })
      ]
    })
  }

  const removeFromAdjustmentArrayForEdit = (IdOfAdjustmentToBeAltered) => {
    setSelectedInventoryWastageInventories((prevState) => {
      // Explain : We'll have to add another property in each inventory to track/calculate the remaining qty on real time
      return [
        ...selectedInventoryWastageInventories.map((inventory) => {
          if (inventory.id === IdOfAdjustmentToBeAltered) {
            inventory.AdjustmentInventory['adjustmentQuantity'] = 0
            inventory.AdjustmentInventory['softDelete'] = true
          }
          return inventory
        })
      ]
    })
  }

  return (
    <>
      {formErrors}
      {
        !selectedInventoryWastages ?
          <Grid container className={classes.parentContainer} spacing={3} >
            <Grid container item xs={12} justifyContent="space-between">
              <Grid item xs={11}>
                <Typography variant="h3" className={classes.heading}> {!!selectedInventoryWastages ? 'Edit Stock Adjustment' : 'Add Stock Adjustment'} </Typography>
              </Grid>
              <Grid item xs={1}>
                <Button variant="contained" color="primary" onClick={() => navigate('/operations/stock-adjustment')}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <Grid item sm={6}>
              {
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="customerId"
                    options={customers}
                    // defaultValue={selectedInventoryWastages ? { name: selectedInventoryWastages.Inventory.Company.name, id: selectedInventoryWastages.Inventory.Company.id } : <Typography color="error"></Typography>}
                    getOptionLabel={(customer) => customer.name || ""}
                    onChange={(event, newValue) => {
                      if (newValue)
                        handleCustomerSearch(newValue.id, (newValue.name || ''))
                    }}
                    renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
                    onBlur={e => setValidation({ ...validation, customerId: true })}
                    disabled={!!selectedInventoryWastages}
                  />
                  {validation.customerId && !isRequired(customerId) ? <Typography color="error">Company is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
                </FormControl>
              }
            </Grid>
            <Grid item sm={6}>
              {
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="warehouse"
                    key={warehouses} // for reRendering after selecting new company
                    options={warehouses}
                    getOptionLabel={(warehouse) => warehouse.name || ""}
                    onChange={(event, newValue) => {
                      if (newValue)
                        setWarehouseId(newValue.id)
                    }}
                    renderInput={(params) => <TextField {...params} label="Warehouse" variant="outlined" />}
                    onBlur={e => setValidation({ ...validation, warehouseId: true })}
                    disabled={!!selectedInventoryWastages}
                  />
                  {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
                </FormControl>
              }

            </Grid>

            {/* Product Details */}
            <Grid container item xs={12} alignItems="center" spacing={1}>
              <Grid item sm={4}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="product"
                    key={products}
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
                  {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
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
                  onChange={e => e.target.value < 0 ? e.target.value == 0 : e.target.value < availableQuantity ? setQuantity(Math.round(e.target.value)) : setQuantity(Math.round(availableQuantity))}
                // onBlur={e => setValidation({ ...validation, quantity: true })}
                />
                {validation.quantity && !isRequired(quantity) ? <Typography color="error">Quantity is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
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
                {validation.reasonType && !isRequired(reasonType) ? <Typography color="error" style={{ visibility: 'hidden' }}>DUMMY</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
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
                {validation.reasonType && !isRequired(reasonType) ? <Typography color="error" style={{ visibility: 'hidden' }}>DUMMY</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
              </Grid>
              <Grid item sm={6}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="reasonType"
                    key={productId}
                    options={reasons}
                    getOptionLabel={(reasons) => reasons.name.charAt(0).toUpperCase() + reasons.name.slice(1).toLowerCase() || ""}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setReasonType(newValue.id)
                        setReasonTypeLabel(newValue.name.charAt(0).toUpperCase() + newValue.name.slice(1).toLowerCase())
                      }
                    }}
                    renderInput={(params) => <TextField {...params} label="Reason Type" variant="outlined" />}
                    onBlur={e => setValidation({ ...validation, reasonType: true })}
                    disabled={!!selectedInventoryWastages}
                  />
                  {validation.reasonType && !isRequired(reasonType) ? <Typography color="error">Reason type is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
                </FormControl>
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  margin="normal"
                  InputProps={{ inputProps: { maxLength: 300 } }}
                  id="quantity"
                  label="Comment"
                  variant="outlined"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={!!selectedInventoryWastages}
                />
                {validation.reasonType && !isRequired(reasonType) ? <Typography color="error" style={{ visibility: 'hidden' }}>Reason type is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
              </Grid>
              <Grid item sm={2}>
                <Button variant="contained" onClick={updateAdjustmentsTable} color="primary" fullWidth disabled={!!selectedInventoryWastages} >Add</Button>
              </Grid>
            </Grid>
          </Grid >
          :
          <Grid container className={classes.parentContainer} spacing={3}>
            <Grid container item xs={12} justifyContent="space-between">
              <Grid item xs={11}>
                <Typography variant="h3" className={classes.heading}> Edit Stock Adjustment </Typography>
              </Grid>
              <Grid item xs={1}>
                <Button variant="contained" color="primary" onClick={() => navigate('/operations/stock-adjustment')}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
      }

      {
        !selectedInventoryWastages ?
          <TableContainer className={classes.parentContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    COMPANY
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    WAREHOUSE
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    PRODUCT
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    ADJUSTED QUANTITY
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    UOM
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    REASON
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    COMMENT
                  </TableCell>
                  <TableCell>
                    ACTION
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adjustmentsSecondaryArray.map((adjustment, idx) => {
                  return (
                    <TableRow hover role="checkbox" key={idx}>
                      <TableCell>
                        {adjustment.customer.name}
                      </TableCell>
                      <TableCell>
                        {adjustment.warehouse.name || ''}
                      </TableCell>
                      <TableCell>
                        {adjustment.product.name}
                      </TableCell>
                      <TableCell>
                        {adjustment.adjustmentQuantity}
                      </TableCell>
                      <TableCell>
                        {adjustment.product.UOM.name}
                      </TableCell>
                      <TableCell>
                        {adjustment.reasonType}
                      </TableCell>
                      <TableCell>
                        {adjustment.comment}
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
          :
          <TableContainer className={classes.parentContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    COMPANY
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    WAREHOUSE
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    PRODUCT
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    AVAILABLE QTY
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    ADJUSTED QTY
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    UOM
                  </TableCell>
                  {/* <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    REMAINING QTY
                  </TableCell> */}
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    REASON
                  </TableCell>
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px', minWidth: 150 }}>
                    COMMENT
                  </TableCell>
                  <TableCell>
                    ACTION
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  selectedInventoryWastageInventories.filter((inventory) => !inventory.AdjustmentInventory['softDelete']).map((inventory, idx) => {
                    return (
                      <TableRow hover role="checkbox" key={idx}>
                        <TableCell>
                          {inventory.Company.name || '-'}
                        </TableCell>
                        <TableCell>
                          {inventory.Warehouse.name || '-'}
                        </TableCell>
                        <TableCell>
                          {inventory.Product.name || '-'}
                        </TableCell>
                        <TableCell>
                          {/* {inventory.availableQuantity} */}
                          {
                            isNaN(inventory.AdjustmentInventory.remainingQuantity - inventory.AdjustmentInventory.adjustmentQuantity) ?
                              inventory.availableQuantity
                              :
                              <>
                                {inventory.AdjustmentInventory.remainingQuantity - inventory.AdjustmentInventory.adjustmentQuantity}
                                {
                                  inventory.AdjustmentInventory['dirtyData'] ?
                                    <PriorityHighOutlinedIcon style={{ transform: 'translateY(5px)translateX(0px)', color: 'red' }} />
                                    :
                                    null
                                }
                              </>
                          }
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth={true}
                            id="editAdjustmentQty"
                            label="Quantity"
                            variant="outlined"
                            value={inventory.AdjustmentInventory.adjustmentQuantity || ''}
                            onChange={(e) => handleEdit(
                              e.target.value > inventory.AdjustmentInventory.actualAvailableQuantity ?
                                inventory.AdjustmentInventory.actualAvailableQuantity
                                :
                                parseInt(e.target.value),
                              inventory.id, 'adjustmentQuantity')}
                            onBlur={e => setValidation({ ...validation, editAdjustmentQuantity: true })}
                          />
                          {/* {validation.editAdjustmentQuantity && !isRequired(inventory.AdjustmentInventory.adjustmentQuantity) ? <Typography color="error">Company is required!</Typography> : ''} */}
                        </TableCell>
                        <TableCell>
                          {inventory.Product.UOM.name || '-'}
                        </TableCell>

                        <TableCell>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="reasons">Reason Type</InputLabel>
                            <Select
                              labelId="reasons"
                              id="reasons"
                              value={inventory.AdjustmentInventory.reason || '0'}
                              onChange={(e) => handleEdit(e.target.value, inventory.id, 'reason')}
                              label="Reason Type"
                            >
                              {
                                reasons.map((reason) => {
                                  return (
                                    <MenuItem value={reason.id}>{reason.name.charAt(0).toUpperCase() + reason.name.slice(1).toLowerCase()}</MenuItem>
                                  )
                                })
                              }
                            </Select>
                          </FormControl>

                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth={true}
                            id="comment"
                            label="Comment"
                            variant="outlined"
                            InputProps={{ inputProps: { maxLength: 300 } }}
                            value={inventory.AdjustmentInventory.comment || ''}
                            onChange={(e) => handleEdit(e.target.value, inventory.id, 'comment')}
                          />
                        </TableCell>
                        <TableCell>
                          <DeleteIcon color="error" key="delete" onClick={() => {
                            removeFromAdjustmentArrayForEdit(inventory.id)
                            // setSelectedInventoryWastageInventories(selectedInventoryWastageInventories.filter((inventory, _idx) => _idx != idx))
                          }
                          } />
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
      }

      {
        adjustmentsSecondaryArray.length > 0 || selectedInventoryWastageInventories.length > 0 ?
          <Grid container className={classes.parentContainer} xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button onClick={!selectedInventoryWastages ? handleSubmit : handleUpdate} color="primary" variant="contained">
                  {!selectedInventoryWastages ? 'Create Stock Adjustment' : 'Update Stock Adjustment'}
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
