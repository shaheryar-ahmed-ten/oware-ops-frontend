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
import { isRequired, isPhone, isNumber } from '../../../utils/validators';
import { checkForMatchInArray, dateFormat, dateToPickerFormat, getURL } from '../../../utils/common';
import { Alert, Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { TableContainer } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate, useParams } from 'react-router';
import MaskedInput from "react-text-mask";
import "./outward.css"
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

export default function AddDispatchOrderView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { uid } = useParams();

  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);

  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [validation, setValidation] = useState({});
  const [quantity, setQuantity] = useState(0);
  const [shipmentDate, setShipmentDate] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [inventoryId, setInventoryId] = useState('');
  const [uom, setUom] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [productId, setProductId] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [internalIdForBusiness, setInternalIdForBusiness] = useState('');

  const [formErrors, setFormErrors] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [inventories, setInventories] = useState([]);
  const [showMessage, setShowMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const resetLocalStates = () => {
    // empty arrays
    setWarehouses(customerId ? warehouses : []);
    setProducts([]);
    setInventories([]);
    // reset product section quantities
    setQuantity(0);
    setAvailableQuantity(0);
    // reset product id
    setProductId('');
    // reset validations
    setValidation({});
  }

  useEffect(() => {
    if (customers.length === 0)
      getRelations();
    if (uid)
      _getDispatchOrder(); // only in case of edit
  }, []);

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
    if (!!selectedDispatchOrder) {
      // setQuantity(0);
      setShipmentDate(dateToPickerFormat(selectedDispatchOrder.shipmentDate) || '');
      setReceiverName(selectedDispatchOrder.receiverName || '');
      setReceiverPhone(selectedDispatchOrder.receiverPhone || '');
      setInventoryId(selectedDispatchOrder.inventoryId || '');
      setCustomerId(selectedDispatchOrder.Inventory.customerId);
      setWarehouseId(selectedDispatchOrder.Inventory.warehouseId);
      getWarehouses({ customerId: selectedDispatchOrder.Inventory.warehouseId })
        .then(warehouses => {
          return setWarehouses(warehouses)
        });
      setInternalIdForBusiness(selectedDispatchOrder.internalIdForBusiness);
      setReferenceId(selectedDispatchOrder.referenceId || '');
      getProducts({ customerId: selectedDispatchOrder.Inventory.customerId, warehouseId: selectedDispatchOrder.Inventory.warehouseId })
        .then((products) => {
          if (products.length > 0 && selectedDispatchOrder.Inventories.length > 0 && inventories.length == 0) {
            for (let inventory of selectedDispatchOrder.Inventories) {
              setInventories((prevState) => ([
                ...prevState,
                {
                  product: inventory.Product, // because its not necessary that available qty of dispatched product is still available, it will not be available in Products if available qty is 0.
                  id: inventory.id,
                  quantity: inventory.OrderGroup.quantity,
                  remainingQuantity: inventory.availableQuantity,// to display at bottom table in edit.
                  availableQuantity: inventory.availableQuantity + inventory.OrderGroup.quantity, // to display at bottom table in edit.
                  dispatchedQuantity: inventory.outward ? inventory.outward.quantity || 0 : 0 // dispatched quantity of this particular inventory
                }
              ]))
            }
          }
          setProducts(products)
        })
    } else {
      setInventoryId('');
      setQuantity('');
      setCustomerId('');
      setWarehouseId('');
      setProductId('');
      setShipmentDate(new Date());
      setReceiverName('');
      setReceiverPhone();
      setReferenceId('');
    }
  }, [selectedDispatchOrder])

  useEffect(() => {
    if (!customerId) return;
    resetLocalStates()
    if (!!selectedDispatchOrder) {
      // getWarehouses({ customerId: selectedDispatchOrder.Inventory.customerId })
      //   .then(warehouses => {
      //     return setWarehouses(warehouses)
      //   });
      // setWarehouseId(selectedDispatchOrder.Inventory.warehouseId);
    } else {
      getWarehouses({ customerId })
        .then(warehouses => {
          return setWarehouses(warehouses)
        });
    }
  }, [customerId]);

  useEffect(() => {
    if (!customerId && !warehouseId) return;
    resetLocalStates()
    if (!!selectedDispatchOrder) {
      // setProducts([selectedDispatchOrder.Inventory.Product]);
      // setProductId(selectedDispatchOrder.Inventory.productId);
    } else {
      const warehouse = warehouses.find(element => warehouseId == element.id);
      if (warehouse) {
        setInternalIdForBusiness(`DO-${warehouse.businessWarehouseCode}-`);
        getProducts({ customerId, warehouseId })
          .then(products => {
            return setProducts(products)
          });
      }
    }
  }, [warehouseId])

  useEffect(() => {
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


  const _getDispatchOrder = () => {
    axios.get(getURL(`dispatch-order/${uid}`))
      .then((response) => {
        setSelectedDispatchOrder(response.data.data)
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


  const addDispatchOrder = data => {
    let apiPromise = null;
    if (!selectedDispatchOrder) apiPromise = axios.post(getURL('dispatch-order'), data);
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
      isRequired(parseInt(quantity)) &&
      isPhone(receiverPhone.replace(/-/g, ''))) {
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
          quantity,
          availableQuantity: availableQuantity,
          remainingQuantity: availableQuantity - quantity,
          dispatchedQuantity: 0
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
    let strRecieverPhone = receiverPhone
    let strRecPhone = strRecieverPhone.replace(/-/g, '');
    const newDispatchOrder = {
      quantity,
      inventories,
      inventoryId,
      customerId,
      warehouseId,
      productId,
      shipmentDate: new Date(shipmentDate),
      receiverName,
      receiverPhone: strRecPhone,
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
      isRequired(receiverPhone)
    ) {
      addDispatchOrder(newDispatchOrder);
    }
  }

  const handleCustomerSearch = (customerId, customerName) => {
    setCustomerId(customerId);
  }

  const phoneNumberMask = [
    /[0-9]/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];

  const verifyEditedQty = () => {
    return new Promise((resolve, reject) => {
      for (let inventory of inventories) {
        // verify if qty is 0 or invalid or greater than available qty
        if (!inventory.softDelete
          &&
          (isNaN(inventory.quantity)
            || !isRequired(inventory.quantity)
            || inventory.quantity > inventory.availableQuantity
            || inventory['lessThanError']
            || inventory['greaterThanError']
          )
        )
          return reject(false)
        else
          inventory.inventoryId = inventory.id
      }
      return resolve(true)
    })
  }

  const handleUpdate = () => {
    verifyEditedQty()
      .then(() => {
        setMessageType('green');
        let strRecieverPhone = receiverPhone
        let strRecPhone = strRecieverPhone.replace(/-/g, '');
        // change the naming convention of id to inventoryId
        const newDispatchOrder = {
          products: inventories,
          inventoryId,
          customerId,
          warehouseId,
          shipmentDate: new Date(shipmentDate),
          receiverName,
          receiverPhone: strRecPhone,
          referenceId,
          internalIdForBusiness
        }

        setValidation({
          inventoryId: true,
          customerId: true,
          warehouseId: true,
          shipmentDate: true,
          receiverName: true,
          receiverPhone: true
        });
        if (
          isRequired(inventoryId) &&
          isRequired(customerId) &&
          isRequired(warehouseId) &&
          isRequired(shipmentDate) &&
          isRequired(receiverName) &&
          isRequired(receiverPhone)
        ) {
          addDispatchOrder(newDispatchOrder);
        }
      })
      .catch((err) => {
        setMessageType('#FFCC00')
        setShowMessage({ message: "Please make sure you have entered valid quantity." })
      })
  }

  const handleEdit = (value, keyTobeEdit, dispatchGroupId) => {
    if (isNaN(value)) { value = 0 }

    setInventories((prevState) => {
      return [
        ...inventories.map((inventory) => {
          if (inventory.id === dispatchGroupId) {
            inventory[keyTobeEdit] = value
            inventory['remainingQuantity'] = inventory.availableQuantity - inventory['quantity']
            // enable validation error if user enters quantity less than dispatched quantity
            inventory['lessThanError'] = inventory.dispatchedQuantity > value ? true : false
            // enable validation error if user enters quantity grater than available quantity
            inventory['greaterThanError'] = inventory.availableQuantity < value ? true : false
          }
          return inventory
        })
      ]
    })
  }

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>{!!selectedDispatchOrder ? 'Edit' : 'Add'} Dispatch Order</Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate('/operations/dispatch-order')}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="customer"
              key={selectedDispatchOrder} // for reRendering the autocomplete after dispatch order is selected.
              options={customers}
              defaultValue={selectedDispatchOrder ? { name: selectedDispatchOrder.Inventory.Company.name, id: selectedDispatchOrder.Inventory.Company.id } : ''}
              getOptionLabel={(customer) => customer.name || ""}
              onChange={(event, newValue) => {
                if (newValue)
                  handleCustomerSearch(newValue.id, (newValue.name || ''))
              }}
              renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
              onBlur={e => setValidation({ ...validation, customerId: true })}
              disabled={!!selectedDispatchOrder}
            />
            {validation.customerId && !isRequired(customerId) ? <Typography color="error">Company is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="warehouse"
              key={warehouses}
              options={warehouses}
              defaultValue={selectedDispatchOrder ? { name: selectedDispatchOrder.Inventory.Warehouse.name, id: selectedDispatchOrder.Inventory.Warehouse.id } : ''}
              getOptionLabel={(warehouse) => warehouse.name || ""}
              onChange={(event, newValue) => {
                if (newValue)
                  setWarehouseId(newValue.id)
              }}
              renderInput={(params) => <TextField {...params} label="Warehouse" variant="outlined" />}
              // onBlur={e => setValidation({ ...validation, warehouseId: true })}
              disabled={!!selectedDispatchOrder}
            />
            {validation.warehouseId && !isRequired(warehouseId) ? <Typography color="error">Warehouse is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <TextField
            fullWidth={true}
            id="receiverName"
            label="Receiver Name"
            type="text"
            variant="outlined"
            value={receiverName}
            onChange={e => setReceiverName(e.target.value)}
          // onBlur={e => setValidation({ ...validation, receiverName: true })}
          />
          {validation.receiverName && !isRequired(receiverName) ? <Typography color="error">Receiver name is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
        </Grid>
        <Grid item sm={6}>
          <MaskedInput
            className="mask-text"
            guide={true}
            showMask={true}
            variant="outlined"
            name="phone"
            mask={phoneNumberMask}
            label="Receiver Phone"
            id="receiverPhone"
            type="text"
            value={receiverPhone}
            placeholder="Reciever Phone(e.g 032*-*******)"
            onChange={e => {
              setReceiverPhone(e.target.value)
            }}
            style={{ padding: '22px 10px' }}
          // onBlur={e => setValidation({ ...validation, receiverPhone: true })}
          />
          {validation.receiverPhone && isRequired(receiverPhone) && !isPhone(receiverPhone.replace(/-/g, '')) ? <Typography color="error">Incorrect phone number!</Typography> : ''}
          {validation.receiverPhone && !isRequired(receiverPhone) ? <Typography color="error">Receiver phone is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
        </Grid>
        <Grid item sm={6}>
          <TextField
            fullWidth={true}
            margin="dense"
            id="shipmentDate"
            label="Shipment Date"
            inputProps={{ min: new Date().toISOString().slice(0, 16) }}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Shipment Date"
            type="datetime-local"
            variant="outlined"
            value={shipmentDate}
            onChange={e => setShipmentDate(dateToPickerFormat(e.target.value))}
          // onBlur={e => setValidation({ ...validation, shipmentDate: true })}
          />
          {validation.shipmentDate && !isRequired(shipmentDate) ? <Typography color="error">Shipment date is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
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
                key={products}
                options={products}
                getOptionLabel={(product) => product.name || ""}
                onChange={(event, newValue) => {
                  if (newValue)
                    setProductId(newValue.id)
                }}
                renderInput={(params) => <TextField {...params} label="Product" variant="outlined" />}
              // onBlur={e => setValidation({ ...validation, productId: true })}
              />
              {validation.productId && !isRequired(productId) ? <Typography color="error">Product is required!</Typography> : <Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
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
              // disabled={!!selectedDispatchOrder}
              onChange={e => e.target.value < 0 ? e.target.value == 0 : e.target.value < availableQuantity ? setQuantity(e.target.value) : setQuantity(availableQuantity)}
              onBlur={e => setValidation({ ...validation, quantity: true })}
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
            {<Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
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
            {<Typography color="error" style={{ visibility: 'hidden' }}>Dummy</Typography>}
          </Grid>
          <Grid item sm={2}>
            <Button variant="contained" onClick={updateDispatchOrdersTable} color="primary" fullWidth >Add Dispatch</Button>
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
                {!!selectedDispatchOrder ? 'Requested Quantity' : 'Quantity'}
              </TableCell>
              {
                !!selectedDispatchOrder ?
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Dispatched Quantity
                  </TableCell>
                  :
                  ''
              }
              {
                !!selectedDispatchOrder ?
                  <TableCell
                    style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                    Remaining Quantity
                  </TableCell>
                  :
                  ''
              }
              <TableCell
                style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
                UoM
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.filter((inventory) => !inventory.softDelete).map((dispatchGroup, idx) => {
              return (
                <TableRow hover role="checkbox" key={idx}>
                  <TableCell>
                    {dispatchGroup.product ? dispatchGroup.product.name : ''}
                  </TableCell>
                  <TableCell>
                    {!!selectedDispatchOrder ?
                      <TextField
                        // fullWidth={true}
                        id="editDispatchProductQty"
                        label="Quantity"
                        variant="outlined"
                        value={dispatchGroup.quantity || ''}
                        onChange={(e) => handleEdit(
                          e.target.value > dispatchGroup.availableQuantity ?
                            parseInt(e.target.value)
                            :
                            parseInt(e.target.value)
                          , 'quantity'
                          , dispatchGroup.id
                        )}
                      />
                      :
                      dispatchGroup.quantity
                    }
                  </TableCell>
                  {
                    !!selectedDispatchOrder ?
                      <>
                        <TableCell>
                          <Typography variant="body" component="p">
                            {dispatchGroup.dispatchedQuantity || '0'}
                          </Typography>

                          {
                            dispatchGroup['lessThanError'] ?
                              <Typography variant="body" color="error">
                                Requested qty can't be less than dispatched qty.'
                              </Typography>
                              :
                              ''
                          }
                        </TableCell>
                        <TableCell>
                          {dispatchGroup.remainingQuantity || 0}
                          {<PriorityHighOutlinedIcon style={{ transform: 'translateY(5px)translateX(0px)', color: 'red' }} />}
                          {
                            dispatchGroup['greaterThanError'] ?
                              <Typography variant="body" color="error" component="p">
                                Requested qty can't be greater than available qty.
                              </Typography>
                              :
                              ''
                          }
                        </TableCell>
                      </>
                      :
                      ''
                  }
                  <TableCell>
                    {dispatchGroup.product ? dispatchGroup.product.UOM.name : ''}
                  </TableCell>
                  <TableCell>
                    <DeleteIcon color="error" key="delete" style={{ cursor: 'pointer' }}
                      onClick={() => {
                        inventories.find((inventory) => inventory.id === dispatchGroup.id)['quantity'] = 0
                        inventories.find((inventory) => inventory.id === dispatchGroup.id)['softDelete'] = true
                        setInventories([...inventories])
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
        inventories.filter((inventory) => !inventory.softDelete).length > 0 ?
          <Grid container className={classes.parentContainer} xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button onClick={!selectedDispatchOrder ? handleSubmit : handleUpdate} color="primary" variant="contained">
                  {!selectedDispatchOrder ? 'Add Products' : 'Update Product'}
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
