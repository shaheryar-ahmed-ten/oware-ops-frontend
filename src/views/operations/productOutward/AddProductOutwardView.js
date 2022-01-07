import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Typography,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
} from "@material-ui/core";
import { isRequired, isNotEmptyArray } from "../../../utils/validators";
import { Alert, Autocomplete } from "@material-ui/lab";
import axios from "axios";
import { checkForZeroQuantityInArray, dateFormat, dividerDateFormat, dividerDateWithoutTimeFormat, filterZeroQuantity, getURL } from "../../../utils/common";
import { TableBody } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router";
import MessageSnackbar from "../../../components/MessageSnackbar";
import moment from "moment-timezone";
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import PriorityHighOutlinedIcon from "@material-ui/icons/PriorityHighOutlined";

const useStyles = makeStyles((theme) => ({
  parentContainer: {
    boxSizing: "border-box",
    padding: "30px 30px",
  },
  pageHeading: {
    fontWeight: 600,
  },
  pageSubHeading: {
    fontWeight: 300,
  },
  heading: {
    fontWeight: "bolder",
  },
  externalVehicle: {
    marginTop: "0px",
  },
  referenceId: {
    marginTop: "1px",
  },
  // radioField:{
  //   marginTop:"15px",
  // },
}));

export default function AddProductOutwardView({ }) {
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedProductOutward, setSelectedProductOutward] = useState(state ? state.selectedProductOutward : null);

  const [validation, setValidation] = useState({});
  const [shipmentDate, setShipmentDate] = useState(0);
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [customer, setCustomer] = useState("");
  const [dispatchOrderId, setDispatchOrderId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [internalIdForBusiness, setInternalIdForBusiness] = useState("");

  const [formErrors, setFormErrors] = useState([]);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [inventoryQuantities, setInventoryQuantities] = useState([]);
  const [vehicles, setVehicles] = useState([]); // will be used instead vehicle types, numbers etc
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null); // used in details table, selected from dropdown
  const [showMessage, setShowMessage] = useState(null);

  const [disableSubmitButton, setDisableSubmitButton] = useState(false);

  const [allBatches, setAllBatches] = useState([]); // all batches
  const [selectedBatches, setSelectedBatches] = useState([]); // batches of inventory of selected dispatch order
  const [inventoryBatchTracker, setInventoryBatchTracker] = useState([]); // to track which batch is enabled for which inventory at what index.
  const [disabledAddBatchButtonIds, setDisabledAddBatchButtonIds] = useState([])
  useEffect(() => {
    getRelations();
  }, []);

  useEffect(() => {
    if (!!selectedProductOutward) {
      selectDispatchOrder(
        selectedProductOutward.dispatchOrderId || "",
        selectedProductOutward.internalIdForBusiness || ""
      );
    } else {
      setValidation({});
      selectDispatchOrder("");
    }
  }, [selectedProductOutward, dispatchOrders]);

  const dispatchOrdersForDropdown = [];
  const filterDispatchOrdersForDropdown = () => {
    dispatchOrders.forEach((dispatchOrder) => {
      //    loop to get the PO of each DO
      // let totalQuantityDispatched = dispatchOrder.ProductOutwards.reduce((acc, po) => acc + po.quantity, 0); // 1 DO
      let totalRequestedQuantity = dispatchOrder.Inventories.reduce((acc, inv) => acc + inv.OrderGroup.quantity, 0); // 1 DO
      let totalDispatchedQuantity = 0;
      dispatchOrder.ProductOutwards.forEach((po) => {
        totalDispatchedQuantity += po.Inventories.reduce((acc, inv) => acc + inv.OutwardGroup.quantity, 0);
      });
      let remainingQuantityOfDispatch = totalRequestedQuantity - totalDispatchedQuantity; // 1 DO's remaining quantity

      if (remainingQuantityOfDispatch != 0) {
        dispatchOrdersForDropdown.push(dispatchOrder);
      }
    });
  };
  filterDispatchOrdersForDropdown();

  const getRelations = () => {
    axios.get(getURL("product-outward/relations")).then((res) => {
      setVehicles(res.data.vehicles);
      setDispatchOrders(res.data.dispatchOrders);
      setAllBatches(res.data.batches)
    });
  };

  // resolved: error occurs on product outward edit.
  const selectDispatchOrder = (value, internalIdForBusiness) => {
    setDispatchOrderId(value);
    if (value && dispatchOrders.length > 0) {
      let dispatchOrder = dispatchOrders.find((dispatchOrder) => dispatchOrder.id == value);
      let selectedInventoryBatches = {}
      let inventoryBatchTrack = {}
      // set an object of each inventory in selected dispatch order containing all of their batches
      for (let inv of dispatchOrder.Inventories) {
        selectedInventoryBatches[inv.id] = [...allBatches.filter((batch) => batch.inventoryId == inv.OrderGroup.inventoryId)]
        if (selectedInventoryBatches[inv.id] && selectedInventoryBatches[inv.id].length) {
          inventoryBatchTrack[`${inv.id}-0`] = selectedInventoryBatches[inv.id][0]
        }
      }
      setInventoryBatchTracker(inventoryBatchTrack)
      setSelectedBatches(selectedInventoryBatches)
      setSelectedDispatchOrder(dispatchOrder);
      setWarehouse(dispatchOrder.Inventory.Warehouse.name);
      setCustomer(dispatchOrder.Inventory.Company.name);
      setShipmentDate(dispatchOrder.shipmentDate || "");
      setReceiverName(dispatchOrder.receiverName || "");
      setReceiverPhone(dispatchOrder.receiverPhone || "");
      setReferenceId(dispatchOrder.referenceId || "");
      setInternalIdForBusiness(`PD-${dispatchOrder.Inventory.Warehouse.businessWarehouseCode}-`);
      // setIsInternal(selectedProductOutward.isInternal || 1);
      if (selectedProductOutward) {
        setVehicleId(selectedProductOutward.vehicleId || null);
        setExternalVehicle(selectedProductOutward.externalVehicle || null);
        // setIsInternal(selectedProductOutward.isInternal || 1);
      }
    } else {
      setWarehouse("");
      setCustomer("");
      setShipmentDate("");
      setReceiverName("");
      setReceiverPhone("");
      setReferenceId("");
      setInternalIdForBusiness("");
      setVehicleId("");
      setExternalVehicle("");
      // setIsInternal("");
    }
  };

  const addProductOutward = (data) => {
    let apiPromise = null;
    if (!selectedProductOutward) apiPromise = axios.post(getURL("product-outward"), data);
    else apiPromise = axios.put(getURL(`product-outward/${selectedProductOutward.id}`), data);
    apiPromise
      .then((res) => {
        if (!res.data.success) {
          setDisableSubmitButton(false);
          setFormErrors(
            <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
              {res.data.message}
            </Alert>
          );
          return;
        }
        setShowMessage({
          message: "New product outward has been created.",
        });
        setTimeout(() => {
          navigate("/operations/product-outward");
        }, 2000);
      })
      .catch((err) => {
        setDisableSubmitButton(false);
      });
  };

  const filterDuplicatedInventoryQuantities = (invQtyArr) => {
    let duplicateIds = []
    for (let invQty of invQtyArr) {
      let originalInvQty
      // check if duplicate
      if (typeof (invQty['id']) === 'string' && invQty['id'].includes('-dup')) {
        // get duplicate id
        let targetedInvQtyId = invQty['id'].split('-dup')[0];
        // find original invQty
        originalInvQty = invQtyArr.find((invQty) => invQty.id == targetedInvQtyId)
        // append original invQty batches with the duplicate invQty batches
        originalInvQty.batches = [...originalInvQty.batches, ...invQty.batches]
        // add the duplicate quantity to the original invQty quantity
        originalInvQty.quantity = parseInt(originalInvQty.quantity) + parseInt(invQty['quantity'])
        // collect duplicate ids to be filtered
        let fullInvQtyId = invQty['id'];
        duplicateIds = [...duplicateIds, fullInvQtyId]
      }
    }
    return invQtyArr.filter((invQty) => !duplicateIds.includes(invQty.id))
  }

  // Done: add reference id in sending obj
  // Done: add vehicleNumber and vehicle0
  const handleSubmit = (e) => {
    setDisableSubmitButton(true);
    // filter for duplicate inventories
    const duplicationFilteredArray = filterDuplicatedInventoryQuantities(Object.values(inventoryQuantities))
    // filter product containing 0 qty
    const filteredArray = filterZeroQuantity(duplicationFilteredArray)
    const newProductOutward = {
      dispatchOrderId,
      referenceId,
      vehicleId: vehicleId || null,
      externalVehicle: selectedRadioValue == 'externalRide' ? externalVehicle : null,
      inventories: filteredArray,
      internalIdForBusiness,
    };

    setValidation({
      dispatchOrderId: true,
      externalVehicle: selectedRadioValue == 'externalRide' ? true : false,
    });

    if (
      isRequired(dispatchOrderId) &&
        selectedRadioValue == 'externalRide' ? isRequired(externalVehicle) : true &&
        isNotEmptyArray(filteredArray) &&
      checkForZeroQuantityInArray(filteredArray)
    ) {
      setDisableSubmitButton(true);
      addProductOutward(newProductOutward);
    } else {
      setDisableSubmitButton(false);
    }
  };

  const [selectedRadioValue, setSelectedRadioValue] = useState('internalRide');
  const [externalVehicle, setExternalVehicle] = useState(null);

  const handleChange = (event) => {
    setSelectedRadioValue(event.target.value);
  };

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    limit: 100,
  });

  const handleDispatchQuantityEdit = (value, inventoryId, batchName, batchEnabled, orderedRamainingQty) => {
    if (value === 'reset') {
      let toBeUpdatedBatch = selectedBatches[inventoryId].find((batch) => batch.batchName == batchName)
      toBeUpdatedBatch.toBeSubtractedQuantity = 0;
      setInventoryBatchTracker((prevState) => ({
        ...prevState,
        [`${inventoryId}-0`]: toBeUpdatedBatch
      }))

      let toBeUpdatedInventory = selectedDispatchOrder.Inventories.find((inv) => inv.id == inventoryId)
      toBeUpdatedInventory.OrderGroup.toBeSubtractedQuantity = 0;
    }

    if (isNaN(value)) {
      value = 0
    }
    // for remaining batch quantity --> only for batch enabled products
    if (batchEnabled) {
      let toBeUpdatedBatch = selectedBatches[inventoryId].find((batch) => batch.batchName == batchName)

      toBeUpdatedBatch.toBeSubtractedQuantity = toBeUpdatedBatch.availableQuantity >= value && orderedRamainingQty >= value ?
        value
        :
        orderedRamainingQty < toBeUpdatedBatch.availableQuantity ?
          orderedRamainingQty
          :
          toBeUpdatedBatch.availableQuantity
      setInventoryBatchTracker((prevState) => ({
        ...prevState,
        [`${inventoryId}-0`]: toBeUpdatedBatch
      }))
      // for remaining ordered quantity -->  for batch enabled products
      let toBeUpdatedInventory = selectedDispatchOrder.Inventories.find((inv) => inv.id == inventoryId)
      // console.log("debug 2", orderedRamainingQty, toBeUpdatedBatch.availableQuantity, toBeUpdatedInventory.OrderGroup.orignalToBeSubtractedQuantity)
      toBeUpdatedInventory.OrderGroup.toBeSubtractedQuantity = toBeUpdatedInventory['duplicate'] ?
        (orderedRamainingQty - toBeUpdatedInventory.OrderGroup.orignalToBeSubtractedQuantity) > value && toBeUpdatedBatch.availableQuantity > value ?
          value
          :
          (orderedRamainingQty - toBeUpdatedInventory.OrderGroup.orignalToBeSubtractedQuantity) < toBeUpdatedBatch.availableQuantity ?
            (orderedRamainingQty - toBeUpdatedInventory.OrderGroup.orignalToBeSubtractedQuantity)
            :
            toBeUpdatedBatch.availableQuantity
        :
        orderedRamainingQty > value && toBeUpdatedBatch.availableQuantity > value ?
          value
          :
          orderedRamainingQty < toBeUpdatedBatch.availableQuantity ?
            orderedRamainingQty
            :
            toBeUpdatedBatch.availableQuantity

      // update the data of duplicate inventories if exists
      var duplicateInventories = selectedDispatchOrder.Inventories.filter((inv) => inv['duplicate'] && inv.orignalId == inventoryId)
      var updatedDuplicateInventories = []
      if (duplicateInventories?.length) {
        // for (let dupInv of duplicateInventories) {
        //   dupInv.OrderGroup = {
        //     ...dupInv.OrderGroup,
        //     toBeSubtractedQuantity: toBeUpdatedInventory.OrderGroup.toBeSubtractedQuantity,
        //     quantity: toBeUpdatedInventory.OrderGroup.quantity
        //   }
        // }
        // updatedDuplicateInventories = duplicateInventories.map((dupInv) => {
        //   console.log("debug 0", dupInv)
        //   return {
        //     ...dupInv,
        //     OrderGroup: {
        //       ...dupInv.OrderGroup,
        //       toBeSubtractedQuantity: toBeUpdatedInventory.OrderGroup.toBeSubtractedQuantity,
        //       quantity: toBeUpdatedInventory.OrderGroup.quantity
        //     }
        //   }
        // })
      }
    }
    // for remaining ordered quantity -->  for  batch enabled false products
    if (!batchEnabled) {
      let toBeUpdatedInventory = selectedDispatchOrder.Inventories.find((inv) => inv.id == inventoryId)
      toBeUpdatedInventory.OrderGroup.toBeSubtractedQuantity = orderedRamainingQty >= value ? value : orderedRamainingQty
    }

  }

  const addNewBatch = (inventory, existingBatchName, idx) => {
    // console.log("debug 0", inventory.OrderGroup)
    // create a duplicate inventory
    let duplicateInventory = {
      OrderGroup: {
        ...inventory.OrderGroup, inventoryId: `${inventory.id}-dup`,
        orignalToBeSubtractedQuantity: inventory.OrderGroup.toBeSubtractedQuantity,
        toBeSubtractedQuantity: 0,
        // quantity: inventory.OrderGroup.quantity - (inventory.OrderGroup.toBeSubtractedQuantity || 0)
        quantity: inventory.OrderGroup.quantity
      },
      Product: inventory.Product,
      id: `${inventory.id}-dup`,
      duplicate: true,
      orignalId: inventory['orignalId'] ? inventory.orignalId : inventory.id
    }
    // console.log("debug 1", duplicateInventory.OrderGroup)
    // set new default batch, other than the existing selected batch
    let selectedInventoryBatches = selectedBatches[inventory.id].filter((batch) => batch.batchName != existingBatchName)

    // update existing selectedBatches with the record of duplicate inventory
    setSelectedBatches((prevState) => ({
      ...prevState,
      [duplicateInventory.id]: selectedInventoryBatches
    }))
    if (selectedInventoryBatches[0]) {
      setInventoryBatchTracker((prevState) => ({
        ...prevState,
        [`${duplicateInventory.id}-0`]: selectedInventoryBatches[0]
      }))
    }
    // set ordered ramaining quantity & remaining batch quantity
    selectedDispatchOrder.Inventories.splice(idx + 1, 0, duplicateInventory)
    setSelectedDispatchOrder((prevState) => ({
      ...prevState,
      Inventories: selectedDispatchOrder.Inventories
    }))
  }

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Add Product Outward
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/operations/product-outward")}>
              Cancel
            </Button>
          </Grid>
        </Grid>

        {/* <Grid container item xs={12} justifyContent="space-between"> */}
        <Grid item sm={6}>
          <FormControl fullWidth={true} variant="outlined">
            <Autocomplete
              classes={{
                option: classes.option
              }}
              renderOption={(props, option) => {
                let grThanTwo, grThanOne, message;
                var end = moment();
                var duration = moment.duration(end.diff(props.shipmentDate));
                var hours = duration.asHours();
                grThanTwo = hours > 48;
                grThanOne = hours > 24;
                message = grThanTwo || grThanOne ? ` - ${Math.floor(duration.asDays())} days pending` : ""
                return (
                  <span {...props} style={{

                    // fontWeight: 600
                  }}>
                    <p>
                      {props.internalIdForBusiness}
                      <span
                        style={{
                          color: grThanTwo ?
                            'rgba(255,30,0,0.8)' : grThanOne ?
                              '#DBA712' : 'black',

                        }}>
                        {message}
                      </span>
                    </p>
                  </span>
                );
              }}
              id="combo-box-demo"
              defaultValue={
                selectedProductOutward ?
                  { internalIdForBusiness: selectedProductOutward.internalIdForBusiness }
                  :
                  ""
              }
              filterOptions={filterOptions}
              options={dispatchOrdersForDropdown}
              getOptionLabel={(dispatchOrder) =>
                dispatchOrder.internalIdForBusiness || ""}
              onChange={(event, newValue) => {
                if (newValue)
                  selectDispatchOrder(newValue.id, newValue.internalIdForBusiness || "");
              }}
              renderInput={(params) =>
                <TextField {...params} label="Dispatch Order Id" variant="outlined"
                />}
            />
            {validation.dispatchOrderId && !isRequired(dispatchOrderId) ? (
              <Typography color="error">Dispatch order Id is required!</Typography>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>

        <Grid item sm={6}>
          <TextField
            fullWidth={true}
            className={classes.referenceId}
            margin="normal"
            id="referenceId"
            label="Reference Id"
            type="text"
            variant="outlined"
            value={referenceId}
            // disabled
            inputProps={{ maxLength: 30 }}
            onChange={(e) => {
              setReferenceId(e.target.value);
            }}
          />
        </Grid>
        <Grid item sm={6}>
          <FormControl component="fieldset">
            <FormLabel component="legend" style={{ paddingTop: 13 }}>Transportation Type</FormLabel>
            <RadioGroup row aria-label="gender" name="row-radio-buttons-group" style={{ marginTop: 5 }}>
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedRadioValue === 'internalRide'}
                    onChange={handleChange}
                    value="internalRide"
                    name="radio-buttons"
                    labelPlacement="internal"
                  // inputProps={{ 'aria-label': 'externalRide' }}
                  />
                }
                label="Oware Provided"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedRadioValue === 'externalRide'}
                    onChange={handleChange}
                    value="externalRide"
                    name="radio-buttons"
                  // inputProps={{ 'aria-label': 'externalRide' }}
                  />
                }
                label="Customer Provided"
              />

            </RadioGroup>
          </FormControl>
        </Grid>
        {/* </Grid> */}

        {selectedRadioValue == 'internalRide' ?
          (
            // Internal Ride
            <Grid item sm={6}>
              <TextField
                fullWidth={true}
                // inputProps={{ className: classes.externalVehicle }}
                // className={classes.externalVehicle}
                margin="normal"
                id="externalVehicle"
                label="Customer Provided Vehicle (Customer Provided Transportation Only)"
                type="text"
                // variant="outlined"
                value={vehicleId}
                disabled
                inputProps={{ maxLength: 30 }}
                variant="filled"
              // onChange={(e) => {
              //   setExternalVehicle(e.target.value);
              // }}
              // onBlur={(e) => setValidation({ ...validation, externalVehicle: true })}
              />
              {/* {externalVehicle && selectedRadioValue == 'internalRide' ? (
                <Typography color="error">External Vehicle number should be blank for Oware Provided !</Typography>
              ) : (
                ""
              )} */}
            </Grid>
          )
          :
          // External Ride
          <Grid item sm={6}>
            <TextField
              fullWidth={true}
              // inputProps={{ className: classes.externalVehicle }}
              // className={classes.externalVehicle}
              margin="normal"
              id="externalVehicle"
              label="Customer Provided Vehicle (Customer Provided Transportation Only)"
              type="text"
              variant="outlined"
              value={externalVehicle}
              // disabled
              inputProps={{ maxLength: 30 }}
              onChange={(e) => {
                setExternalVehicle(e.target.value);
              }}
              onBlur={(e) => setValidation({ ...validation, externalVehicle: true })}
            />
            {validation.externalVehicle && !isRequired(externalVehicle) && selectedRadioValue == 'externalRide' ? (
              <Typography color="error">External Vehicle number is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
        }
      </Grid>

      {selectedDispatchOrder ? (
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                  Company
                </TableCell>
                <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                  Warehouse
                </TableCell>
                <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                  Outwards
                </TableCell>
                <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                  Shipment Date
                </TableCell>
                <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                  Receiver Name
                </TableCell>
                <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                  Receiver Phone
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role="checkbox">
                <TableCell>{customer}</TableCell>
                <TableCell>{warehouse}</TableCell>
                <TableCell>
                  {selectedDispatchOrder.ProductOutwards ? selectedDispatchOrder.ProductOutwards.length || "0" : "-"}
                </TableCell>
                <TableCell>{dateFormat(shipmentDate)}</TableCell>
                <TableCell>{receiverName}</TableCell>
                <TableCell>{receiverPhone}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ""
      )}
      {selectedDispatchOrder ? (
        <>
          <Grid container className={classes.parentContainer} spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3" className={classes.heading}>
                Product Details
              </Typography>
            </Grid>
          </Grid>
          <TableContainer className={classes.parentContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Product
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    UOM
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Ordered Quantity
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Remaining Quantity
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Remaining Batch Quantity
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Batch No. + Epirty Date
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Actual Quantity To Dispatch
                  </TableCell>
                  <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDispatchOrder.Inventories.map((inventory, idx) => {
                  let remainingQt = 0;
                  let outwardQt = 0;
                  for (let po of selectedDispatchOrder.ProductOutwards) {
                    const targetedPoInv = po.Inventories.find(
                      (inv) => inv.OutwardGroup.inventoryId === inventory.OrderGroup.inventoryId
                    );
                    if (targetedPoInv) outwardQt += targetedPoInv.OutwardGroup.quantity;
                  }
                  remainingQt = inventory.OrderGroup.quantity - outwardQt; // ordered reamining quantity
                  // get inventory batches
                  let inventoryBatches = selectedBatches[inventory.id] ? selectedBatches[inventory.id] : []
                  // get current selected batch
                  let currentSelectedInventoryBatch = inventoryBatchTracker[`${inventory.id}-0`] ? inventoryBatchTracker[`${inventory.id}-0`] : ''// from inv dropdown of batch name
                  if (!inventory.Product.batchEnabled) {
                    currentSelectedInventoryBatch = allBatches.find((batch) => batch.inventoryId == inventory.id)
                  }
                  return (
                    <TableRow hover role="checkbox" key={idx}>
                      <TableCell>{inventory.Product.name}</TableCell>
                      <TableCell>{inventory.Product.UOM.name}</TableCell>
                      <TableCell>{inventory.OrderGroup.quantity}</TableCell>
                      <TableCell>
                        {remainingQt - (inventory.OrderGroup.toBeSubtractedQuantity || 0) - (inventory.OrderGroup.orignalToBeSubtractedQuantity || 0)}
                        {
                          <PriorityHighOutlinedIcon
                            style={{ transform: "translateY(5px)translateX(0px)", color: "red" }}
                          />
                        }
                      </TableCell>
                      <TableCell> {
                        inventory.Product.batchEnabled ?
                          <>
                            {currentSelectedInventoryBatch.availableQuantity - (currentSelectedInventoryBatch.toBeSubtractedQuantity || 0)}
                            {
                              <PriorityHighOutlinedIcon
                                style={{ transform: "translateY(5px)translateX(0px)", color: "red" }}
                              />
                            }
                          </>
                          :
                          '-'
                      }
                      </TableCell>
                      <TableCell> {
                        inventory.Product.batchEnabled ?
                          <FormControl fullWidth>
                            <Select
                              key={currentSelectedInventoryBatch}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={currentSelectedInventoryBatch.batchName ? currentSelectedInventoryBatch.batchName : ''}
                              label="Batch Name"
                              onChange={(e) => {
                                // clear dispatch quantity textbox
                                handleDispatchQuantityEdit(
                                  'reset',
                                  inventory.id,
                                  currentSelectedInventoryBatch.batchName,
                                  inventory.Product.batchEnabled,
                                  remainingQt
                                )

                                setInventoryQuantities({
                                  ...inventoryQuantities,
                                  [idx]: {
                                    quantity: 0
                                  }
                                })
                                let selectedBatchName = e.target.value;
                                // update the tracker state with the new selected batch of particular inventory from dropdown
                                setInventoryBatchTracker((prevState) => ({
                                  ...prevState,
                                  [`${inventory.id}-0`]: selectedBatches[inventory.id].find((batch) => batch.batchName == selectedBatchName)
                                }))
                              }}
                            >
                              {
                                inventoryBatches && inventoryBatches.map((batch, idx) => {
                                  return (
                                    <MenuItem value={batch.batchName} key={idx}>
                                      {`${batch.batchNumber || ''} ${batch.batchNumber ? ',' : ''} ${dividerDateFormat(batch.expiryDate)}`}
                                    </MenuItem>
                                  )
                                })
                              }
                            </Select>
                          </FormControl>
                          :
                          '-'
                      }
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth={true}
                          margin="dense"
                          InputProps={{ inputProps: { min: 0, max: inventory.availableQuantity } }}
                          id="quantity"
                          label="Quantity"
                          type="number"
                          variant="outlined"
                          value={inventoryQuantities[idx] ? inventoryQuantities[idx].quantity : 0}
                          onChange={(e) => {
                            console.log("debug 1", inventory['duplicate'])
                            handleDispatchQuantityEdit(
                              e.target.value,
                              inventory.id,
                              currentSelectedInventoryBatch?.batchName,
                              inventory.Product.batchEnabled,
                              remainingQt)

                            setInventoryQuantities({
                              ...inventoryQuantities,
                              [idx]: {
                                quantity:
                                  inventory.Product.batchEnabled ?
                                    e.target.value < 0
                                      ? e.target.value == 0
                                      :
                                      inventory['duplicate'] ?
                                        (inventory.OrderGroup.quantity > currentSelectedInventoryBatch.availableQuantity) ?
                                          e.target.value > currentSelectedInventoryBatch.availableQuantity ?
                                            currentSelectedInventoryBatch.availableQuantity
                                            :
                                            e.target.value
                                          :
                                          e.target.value < (remainingQt - inventory.OrderGroup.orignalToBeSubtractedQuantity) ?
                                            e.target.value
                                            :
                                            (remainingQt - inventory.OrderGroup.orignalToBeSubtractedQuantity)
                                        :
                                        (inventory.OrderGroup.quantity > currentSelectedInventoryBatch.availableQuantity) ?
                                          e.target.value > currentSelectedInventoryBatch.availableQuantity ?
                                            currentSelectedInventoryBatch.availableQuantity
                                            :
                                            e.target.value
                                          :
                                          e.target.value < remainingQt ?
                                            e.target.value
                                            :
                                            remainingQt
                                    :
                                    e.target.value < 0
                                      ? e.target.value == 0
                                      : e.target.value < remainingQt
                                        ? e.target.value
                                        : remainingQt,
                                id: inventory.id,
                                availableQuantity: remainingQt,
                                // in case on batch enabled
                                batches: [
                                  {
                                    inventoryDetailId: currentSelectedInventoryBatch.id,
                                    availableQuantity: currentSelectedInventoryBatch.availableQuantity - (currentSelectedInventoryBatch.toBeSubtractedQuantity || 0),
                                    quantity: inventory.Product.batchEnabled ?
                                      e.target.value < 0
                                        ? e.target.value == 0
                                        :
                                        (inventory.OrderGroup.quantity > currentSelectedInventoryBatch.availableQuantity) ?
                                          e.target.value > currentSelectedInventoryBatch.availableQuantity ?
                                            currentSelectedInventoryBatch.availableQuantity
                                            :
                                            e.target.value
                                          :
                                          e.target.value < remainingQt
                                            ? e.target.value
                                            : remainingQt
                                      :
                                      e.target.value < 0
                                        ? e.target.value == 0
                                        : e.target.value < remainingQt
                                          ? e.target.value
                                          : remainingQt,

                                  }
                                ]
                                // : []
                              },
                            })
                          }
                          }
                          onBlur={(e) => setValidation({ ...validation, quantity: true })}
                        />
                      </TableCell>
                      {/* {console.log("debug 0", inventoryBatches.length > 1)} */}
                      <TableCell> {
                        inventory.Product.batchEnabled ?
                          // (inventory.OrderGroup.quantity >= currentSelectedInventoryBatch.availableQuantity) && remainingQt - (inventory.OrderGroup.toBeSubtractedQuantity || 0) > 0 ?
                          inventoryBatches.length > 1 && remainingQt - (inventory.OrderGroup.toBeSubtractedQuantity || 0) > 0 ?
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column', textAlign: 'center' }}>
                              <IconButton
                                disabled={disabledAddBatchButtonIds[idx] || !inventoryQuantities[idx] || (inventoryQuantities[idx]?.quantity == 0) ? true : false}
                                onClick={() => {
                                  // console.log("debug 2", inventoryQuantities[idx] == 0, inventoryQuantities[idx]?.quantity)
                                  addNewBatch(inventory, currentSelectedInventoryBatch.batchName, idx)
                                  setDisabledAddBatchButtonIds((prevState) => [...prevState, inventory.id])
                                }}>
                                <ControlPointIcon />
                              </IconButton>
                            </div>
                            :
                            ''
                          :
                          '-'
                      }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container className={classes.parentContainer} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button onClick={handleSubmit} color="primary" variant="contained" disabled={disableSubmitButton}>
                  {!selectedProductOutward ? "Add Product Outward" : "Update Product Outward"}
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </>
      ) : (
        ""
      )
      }

      <MessageSnackbar showMessage={showMessage} />
    </>
  );
}

// inventory.duplicate ?
// Object.values(inventoryQuantities).find((invQty) => invQty.id == inventory.orignalId).batches =
// [...Object.values(inventoryQuantities).find((invQty) => invQty.id == inventory.orignalId).batches,
// {
//   inventoryDetailId: currentSelectedInventoryBatch.id,
//   availableQuantity: currentSelectedInventoryBatch.availableQuantity - (currentSelectedInventoryBatch.toBeSubtractedQuantity || 0),
//   quantity: inventory.Product.batchEnabled ?
//     e.target.value < 0
//       ? e.target.value == 0
//       :
//       (inventory.OrderGroup.quantity > currentSelectedInventoryBatch.availableQuantity) ?
//         e.target.value > currentSelectedInventoryBatch.availableQuantity ?
//           currentSelectedInventoryBatch.availableQuantity
//           :
//           e.target.value
//         :
//         e.target.value < remainingQt
//           ? e.target.value
//           : remainingQt
//     :
//     e.target.value < 0
//       ? e.target.value == 0
//       : e.target.value < remainingQt
//         ? e.target.value
//         : remainingQt,

// }]
// :