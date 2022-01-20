import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  FormControlLabel,
  FormLabel,
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
  makeStyles,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import { Alert } from "@material-ui/lab";
import { isNumber, isRequired } from "../../../utils/validators";
import { useReactToPrint } from "react-to-print";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import { checkForMatchInArray, compareDateFormat, dividerDateFormatForFilter, getURL } from "../../../utils/common";
import MessageSnackbar from "../../../components/MessageSnackbar";
import { useLocation, useNavigate } from "react-router";
import moment from "moment";
import {
  dateToPickerFormat,
  dividerDateFormat,
  // dateToPickerDayFormat,
} from "../../../utils/common";
import BatchInventoryUpdateDialog from "../productInward/BatchInventoryUpdateDialog";

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
  shadedTableHeader: {
    backgroundColor: "rgba(202,201,201,0.3)",
  },
  tableHeadText: {
    background: "transparent",
    fontWeight: "bolder",
    fontSize: "12px",
  },
  subContainer: {
    boxSizing: "border-box",
    padding: "20px 14px",
  },
}));

export default function AddProductInwardView() {
  const classes = useStyles();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { viewOnly } = state || "";
  const [selectedProductInward, setSelectedProductInward] = useState(
    state ? state.selectedProductInward : null
  );

  const [validation, setValidation] = useState({});
  const [customerId, setCustomerId] = useState("");
  const [uom, setUom] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [referenceId, setReferenceId] = useState(null);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [productGroups, setProductGroups] = useState([]);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formErrors, setFormErrors] = useState([]);

  const [internalIdForBusiness, setInternalIdForBusiness] = useState("");

  const [showMessage, setShowMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const [batchNumber, setBatchNumber] = useState(null);
  const [manufacturingDate, setManufacturingDate] = useState(
    dividerDateFormat(null)
  );
  const [expiryDate, setExpiryDate] = useState(dividerDateFormat(null));

  const [vehicleType, setVehicleType] = useState(null);
  const [vehicleName, setVehicleName] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(null);
  const [driverName, setDriverName] = useState(null);
  const [memo, setMemo] = useState(null);

  const [focus, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [expiryFocus, setExpiryFocused] = useState(false);
  const [expiryHasValue, setExpiryHasValue] = useState(false);

  const [batchEnabled, setBatchEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiResponse, setAPIResponse] = useState(null);
  const [generateBatchName, setGenerateBatchName] = useState(null);
  const [batchData, setBatchData] = useState(null);

  const [nextThrityDays, setNextThrityDays] = useState(null)

  const resetLocalStates = () => {
    setProductId("");
    setQuantity(0);
  }

  useEffect(() => {
    getRelations();
  }, []);

  const getRelations = () => {
    axios.get(getURL("product-inward/relations")).then((res) => {
      setProducts(res.data.products);
      setWarehouses(res.data.warehouses);
      setCustomers(res.data.customers);
    });
  };

  const selectProduct = (value) => {
    setProductId(value);
    if (value) {
      setUom(products.find((product) => product.id == value).UOM.name);
      setBatchEnabled(products.find((product) => product.id == value));
      // console.log(batchEnabled.batchEnabled);
    } else setUom("");
  };

  useEffect(() => {
    if (!batchEnabled.batchEnabled) {
      setExpiryDate(dividerDateFormat(null));
      setManufacturingDate(null);
      setBatchNumber(null);
      setHasValue(false);
      setFocused(false);
      setExpiryHasValue(false);
      setExpiryFocused(false);
      setValidation({
        expiryDate: false,
        manufacturingDate: false,
        batchNumber: false,
      });
    }
  }, [batchEnabled.batchEnabled]);

  // Clear the selected products on company/warehouse change
  useEffect(() => {
    var date = new Date();
    date.setDate(date.getDate() + 30);
    var dateString = date.toISOString().split('T')[0];
    setNextThrityDays(dateString)

    setQuantity("");
    setProductGroups([]);
  }, [customerId, warehouseId]);

  useEffect(() => {
    if (!!selectedProductInward) {
      setQuantity(0);
      setCustomerId(selectedProductInward.customerId || "");
      selectProduct("");
      setWarehouseId(selectedProductInward.Warehouse.id || "");
      setReferenceId(selectedProductInward.referenceId || "");
      if (products.length > 0 && productGroups.length == 0) {
        selectedProductInward.Products.forEach((product) => {
          //correct way of updating states.
          setProductGroups((prevState) => [
            ...prevState,
            {
              product: products.find((_product) => _product.id == product.id),
              id: product.id,
              quantity: product.InwardGroup.quantity,
            },
          ]);
        });
      }
    } else {
      setQuantity("");
      setCustomerId("");
      selectProduct("");
      setUom("");
      setWarehouseId("");
    }
  }, [selectedProductInward, products, warehouses, customers]);

  useEffect(() => {
    let d1 = new Date(expiryDate)
    let d2 = new Date()
    if (d1 < d2) {
      setMessageType("#FFCC00");
      setShowMessage({
        message:
          "This product is already expired.",
      });
    }
    else if (expiryDate !== '-' && expiryDate < nextThrityDays) {
      var date1 = new Date(compareDateFormat(expiryDate));
      var date2 = new Date();

      // To calculate the time difference of two dates
      var Difference_In_Time = date1.getTime() - date2.getTime();

      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      setMessageType("#FFCC00");
      setShowMessage({
        message:
          `This product will expire within ${Math.ceil(Difference_In_Days)} days.`,
      });
    }

  }, [expiryDate])

  const updateProductsTable = async () => {
    if (
      isRequired(quantity) &&
      isRequired(customerId) &&
      isRequired(productId) &&
      isRequired(warehouseId)
    ) {
      // checking if particular product is already added once
      // if yes
      if (
        (checkForMatchInArray(productGroups, "id", productId) &&
          !batchEnabled.batchEnabled) ||
        (batchEnabled.batchEnabled &&
          checkForMatchInArray(productGroups, "id", productId) &&
          checkForMatchInArray(productGroups, "batchNumber", batchNumber) &&
          checkForMatchInArray(productGroups, "expiryDate", expiryDate)
        )
      ) {
        setMessageType("#FFCC00");
        setShowMessage({
          message:
            "This product is already added, please choose a different one.",
        });
        return 0;
      }
      if (!batchEnabled.batchEnabled) {
        axios
          .get(getURL("product-inward/existingBatches"), {
            params: {
              // batchNumber: batchNumber ? batchNumber : null,
              // expiryDate: expiryDate.split("T")[0],
              customerId: customerId,
              warehouseId: warehouseId,
              productId: productId,
            },
          })
          .then((resp) => {
            if (resp.data.data) {
              handleAddedProducts(`${resp.data.data[0].batchName}`);
            } else {
              var tempBatch = null;
              handleAddedProducts('null');
            }
          });
        // handleAddedProducts();
      } else if (batchEnabled.batchEnabled) {
        axios.get(getURL("product-inward/max-batch-id")).then((res) => {
          setGenerateBatchName(`${res.data.data.inventoryId + productGroups.length}-${res.data.data.id + productGroups.length}`);
          if (expiryDate !== null) {
            axios
              .get(getURL("product-inward/existingBatches"), {
                params: {
                  batchNumber: batchNumber ? batchNumber : null,
                  expiryDate: expiryDate.split("T")[0],
                  customerId: customerId,
                  warehouseId: warehouseId,
                  productId: productId,
                },
              })
              .then((resp) => {
                if (isRequired(batchNumber)) {
                  // if different stop
                  var batches = resp.data.data;
                  var flagCheck = false;
                  var timeFlag = false;
                  if (batches) {
                    for (let batch of batches) {
                      if (
                        batch.batchNumber == batchNumber &&
                        batch.expiryDate.split("T")[0] ==
                        expiryDate.split("T")[0]
                      ) {
                        handleAddedProducts(`${batch.inventoryId}-${batch.batchName}`);
                        // setMessageType("green");
                        // setShowMessage({
                        //   message: "Existing batch will be updated.",
                        // });
                        return 0;
                      } else if (
                        batch.batchNumber != batchNumber &&
                        batch.expiryDate.split("T")[0] ==
                        expiryDate.split("T")[0]
                      ) {
                        var optionalBatchNameAsParam =
                          res.data.data.id + productGroups.length;
                        handleAddedProducts(`${res.data.data.inventoryId + productGroups.length}-${optionalBatchNameAsParam}`);
                        return 0;
                      } else {
                        flagCheck = true;
                      }
                    }
                    if (flagCheck) {
                      setMessageType("#FFCC00");
                      setShowMessage({
                        message:
                          "Inward can not be created with same batch number and different expiry.",
                      });
                      return 0;
                    }
                  }
                  // else match the expiry date if expiry date exists than open the pop up for the user to update or crete new entry
                  else if (!batches) {
                    axios
                      .get(getURL("product-inward/existingBatches"), {
                        params: {
                          customerId: customerId,
                          warehouseId: warehouseId,
                          productId: productId,
                          expiryDate: expiryDate.split("T")[0],
                        },
                      })
                      .then((expirySearchResponse) => {
                        batches = expirySearchResponse.data.data;
                        if (batches) {
                          setBatchData(batches);
                          for (let batch of batches) {
                            if (
                              batch.expiryDate.split("T")[0] ==
                              expiryDate.split("T")[0]
                            ) {
                              timeFlag = true;
                            }
                          }
                          if (timeFlag) {
                            setOpen(true);
                          }
                        }
                        return 0;
                      });
                  }
                }
                // check if prevBack of provided batch number exist
                // if not
                if (!resp.data.data) {
                  // mean batch donot exist on mentioned date
                  axios
                    .get(getURL("product-inward/existingBatches"), {
                      params: {
                        batchNumber: batchNumber ? batchNumber : null,
                        customerId: customerId,
                        warehouseId: warehouseId,
                        productId: productId,
                      },
                    })
                    .then((response) => {
                      // check for same batchNumber, same product and different expiry
                      var batchescheck = response.data.data;
                      var flagCheckBatches = false;
                      var dateMatchFlag = false;
                      if (batchescheck) {
                        for (let batchcheck of batchescheck) {
                          if (
                            batchcheck.batchNumber == batchNumber &&
                            batchcheck.expiryDate.split("T")[0] !=
                            expiryDate.split("T")[0]
                          ) {
                            flagCheckBatches = true;
                          }
                          if (
                            batchcheck.expiryDate.split("T")[0] ==
                            expiryDate.split("T")[0]
                          ) {
                            dateMatchFlag = true;
                          }
                        }
                      }
                      // if true and batchNumber exists than stop
                      if (flagCheckBatches && isRequired(batchNumber)) {
                        setMessageType("#FFCC00");
                        setShowMessage({
                          message:
                            "Inward can not be created with same batch number and different expiry.",
                        });
                        return 0;
                      }
                      // check for new "" batchNumbers with same expiry
                      else if (dateMatchFlag) {
                        setOpen(true);
                      }
                      // if true and batchNumber does not exist than simply add
                      else if (!timeFlag) {
                        var optionalBatchNameAsParam =
                          res.data.data.id + productGroups.length;
                        handleAddedProducts(`${res.data.data.inventoryId + productGroups.length}-${optionalBatchNameAsParam}`);
                        return 0;
                      }
                    });
                  return 0;
                }
                // if yes
                setBatchData(resp.data.data);
                if (checkForMatchInArray(productGroups, "id", productId)) {
                  setMessageType("#FFCC00");
                  setShowMessage({
                    message:
                      "This product is already added, please choose a different one.",
                  });
                } else {
                  setOpen(true);
                }
              });
          } else if (!expiryDate) {
            setValidation({
              expiryDate: true,
            });
          }
        });
      }
    } else {
      setValidation({
        quantity: true,
        customerId: true,
        // referenceId: true,
        productId: true,
        warehouseId: true,
        expiryDate: productId && customerId && warehouseId && products?.find((_product) => _product.id == productId)?.batchEnabled ?
          true
          :
          false,
      });
    }
  };

  const handleAddedProducts = (optionalBatchNameAsParam) => {
    setProductGroups([
      ...productGroups,
      {
        product: products.find((_product) => _product.id == productId),
        id: productId,
        quantity,
        batchNumber: batchEnabled.batchEnabled ? batchNumber : null,
        manufacturingDate:
          batchEnabled.batchEnabled && manufacturingDate && manufacturingDate !== '-'
            ? manufacturingDate.split("T")[0]
            : null,
        expiryDate: batchEnabled.batchEnabled ? expiryDate.split("T")[0] : null,
        batchName: optionalBatchNameAsParam && optionalBatchNameAsParam != 'null'
          ? optionalBatchNameAsParam.toString()
          :
          optionalBatchNameAsParam === 'null' ?
            null
            : generateBatchName
              ? generateBatchName.toString()
              : null,
      },
    ]);
    setProductId("");
    setQuantity(0);
    setBatchNumber("")
    setManufacturingDate(dividerDateFormat(null))
    setExpiryDate(dividerDateFormat(null))
    setValidation({
      ...validation,
      productId: false,
      quantity: false,
      batchNumber: false,
      manufacturingDate: false,
      expiryDate: false
    })
  };

  const setLocalStates = async (prevStates) => {
    setProductGroups([
      ...productGroups,
      {
        product: products.find((_product) => _product.id == productId),
        id: productId,
        quantity,
        batchNumber: batchEnabled.batchEnabled ? prevStates.batchNumber : null,
        manufacturingDate:
          batchEnabled.batchEnabled && prevStates.manufacturingDate && prevStates.manufacturingDate !== '-'
            ? prevStates.manufacturingDate.split("T")[0]
            : null,
        expiryDate: batchEnabled.batchEnabled
          ? prevStates.expiryDate.split("T")[0]
          : null,
        batchName: prevStates.generatedBatchName,
      },
    ]);
    setProductId("");
    setQuantity(0);
    setBatchNumber("")
    setManufacturingDate(dividerDateFormat(null))
    setExpiryDate(dividerDateFormat(null))
    setValidation({
      ...validation,
      productId: false,
      quantity: false,
      batchNumber: false,
      manufacturingDate: false,
      expiryDate: false
    })
  };

  const addProductInward = (data) => {
    let apiPromise = null;
    if (!selectedProductInward) {
      // console.log(data);
      apiPromise = axios.post(getURL("product-inward"), data);
    } else
      apiPromise = axios.put(
        getURL(`product-inward/${selectedProductInward.id}`),
        data
      );
    apiPromise
      .then((res) => {
        if (!res.data.success) {
          setFormErrors(
            <Alert
              elevation={6}
              variant="filled"
              severity="error"
              onClose={() => setFormErrors("")}
            >
              {res.data.message}
            </Alert>
          );
          return;
        }
        setShowMessage({
          message: "Product Inward created successfully.",
        });
        setTimeout(() => {
          navigate("/operations/product-inward");
        }, 2000);
      })
      .catch((err) => {
        console.info(err);
      });
  };

  const handleSubmit = (e) => {
    setMessageType("green");
    const newProductInward = {
      customerId,
      productId: productGroups[0].id,
      quantity,
      warehouseId,
      referenceId,
      products: productGroups,
      internalIdForBusiness,
      vehicleType,
      vehicleName,
      vehicleNumber,
      driverName,
      memo,
    };

    setValidation({
      customerId: true,
      productId: true,
      warehouseId: true,
    });
    if (
      // isRequired(quantity) &&
      isRequired(customerId) &&
      // isRequired(productId) &&
      isRequired(warehouseId)
    ) {
      addProductInward(newProductInward);
    }
  };


  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Add Product Inward
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/operations/product-inward")}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Grid item sm={6}>
          <FormControl
            // margin="dense"
            fullWidth={true}
            variant="outlined"
          >
            <Autocomplete
              id="customer"
              defaultValue={
                selectedProductInward
                  ? {
                    name: selectedProductInward.Company.name,
                    id: selectedProductInward.Company.id,
                  }
                  : ""
              }
              options={customers}
              getOptionLabel={(customer) => customer.name || ""}
              onChange={(event, newValue) => {
                if (newValue) {
                  setCustomerId(newValue.id);
                }
                else {
                  setCustomerId(null)
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Company" variant="outlined" />
              )}
              onBlur={(e) => setValidation({ ...validation, customerId: true })}
            />
            {validation.customerId && !isRequired(customerId) ? (
              <Typography color="error">Company is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl
            //  margin="dense"
            fullWidth={true}
            variant="outlined"
          >
            <Autocomplete
              id="warehouse"
              defaultValue={
                selectedProductInward
                  ? {
                    name: selectedProductInward.Warehouse.name,
                    id: selectedProductInward.Warehouse.id,
                  }
                  : ""
              }
              options={warehouses}
              getOptionLabel={(warehouse) => warehouse.name || ""}
              onChange={(event, newValue) => {
                if (newValue) {
                  setWarehouseId(newValue.id);
                  setInternalIdForBusiness(
                    `PI-${newValue.businessWarehouseCode}-`
                  );
                }
                else {
                  setWarehouseId(null)
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Warehouse" variant="outlined" />
              )}
              onBlur={(e) =>
                setValidation({ ...validation, warehouseId: true })
              }
            />
            {validation.warehouseId && !isRequired(warehouseId) ? (
              <Typography color="error">Warehouse is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item sm={6}>
          <TextField
            fullWidth={true}
            id="vtype"
            label="Vehicle Type"
            type="text"
            variant="outlined"
            value={vehicleType}
            disabled={viewOnly}
            onChange={(e) => setVehicleType(e.target.value)}
            inputProps={{ maxLength: 30 }}
          // onBlur={e => setValidation({ ...validation, vehicleType: true })}
          />
        </Grid>
        <Grid item sm={6}>
          <TextField
            fullWidth={true}
            id="vName"
            label="Vehicle Name"
            type="text"
            variant="outlined"
            value={vehicleName}
            disabled={viewOnly}
            onChange={(e) => setVehicleName(e.target.value)}
            inputProps={{ maxLength: 30 }}
          // onBlur={e => setValidation({ ...validation, vehicleName: true })}
          />
        </Grid>
        <Grid item sm={4}>
          <TextField
            fullWidth={true}
            id="vNumber"
            label="Vehicle Number"
            type="text"
            variant="outlined"
            value={vehicleNumber}
            disabled={viewOnly}
            onChange={(e) => setVehicleNumber(e.target.value)}
            inputProps={{ maxLength: 30 }}
          // onBlur={e => setValidation({ ...validation, vehicleNumber: true })}
          />
        </Grid>
        <Grid item sm={4}>
          <TextField
            fullWidth={true}
            id="dname"
            label="Driver Name"
            type="text"
            variant="outlined"
            value={driverName}
            disabled={viewOnly}
            onChange={(e) => setDriverName(e.target.value)}
            inputProps={{ maxLength: 30 }}
          // onBlur={e => setValidation({ ...validation, driverName: true })}
          />
        </Grid>
        <Grid item sm={4}>
          <TextField
            fullWidth={true}
            // margin="normal"
            id="referenceId"
            label="Reference Id"
            type="text"
            variant="outlined"
            value={referenceId}
            disabled={viewOnly}
            onChange={(e) => setReferenceId(e.target.value)}
            inputProps={{ maxLength: 30 }}
          // onBlur={e => setValidation({ ...validation, referenceId: true })}
          />
          {validation.referenceId && !isRequired(referenceId) ? (
            <Typography color="error">ReferenceId is required!</Typography>
          ) : (
            <Typography color="error" style={{ visibility: "hidden" }}>
              Dummy
            </Typography>
          )}
        </Grid>
        <Grid item sm={12}>
          <TextField
            multiline
            fullWidth={true}
            margin="dense"
            rows={6}
            id="memo"
            label="Memo"
            type="text"
            variant="outlined"
            InputProps={{
              inputProps: { maxLength: 1000 },
              className: classes.memoBox,
            }}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" className={classes.heading}>
            Product Details
          </Typography>
        </Grid>
        <Grid
          container
          alignItems="center"
          spacing={2}
          className={classes.subContainer}
        >
          <Grid item xs={6}>
            <FormControl
              // margin="dense"
              fullWidth={true}
              variant="outlined"
            >
              <Autocomplete
                id="Product"
                key={productGroups}
                options={products}
                getOptionLabel={(product) => product.name || ""}
                onChange={(event, newValue) => {
                  if (newValue) {
                    selectProduct(newValue.id);
                  }
                  else {
                    selectProduct(null)
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Product" variant="outlined" />
                )}
              // onBlur={e => setValidation({ ...validation, productId: true })}
              />
              {validation.productId && !isRequired(productId) ? (
                <Typography color="error">Product is required!</Typography>
              ) : (
                <Typography color="error" style={{ visibility: "hidden" }}>
                  Dummy
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              // margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              disabled={viewOnly}
              onChange={(e) =>
                setQuantity(
                  e.target.value < 0
                    ? e.target.value == 0
                    : parseInt(Math.round(e.target.value))
                )
              }
              // onBlur={e => setValidation({ ...validation, quantity: true })}
              InputProps={{ inputProps: { min: 1 } }}
            // margin="normal"
            />
            {validation.quantity && !isRequired(quantity) ? (
              <Typography color="error">Quantity is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              // margin="dense"
              id="uom"
              label="UOM"
              type="text"
              variant="filled"
              value={uom}
              disabled
            />
            {
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            }
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              // margin="dense"
              id="batchNumber"
              label="Batch Number"
              type="text"
              variant={batchEnabled.batchEnabled ? "outlined" : "filled"}
              value={batchNumber}
              disabled={!batchEnabled.batchEnabled}
              // margin="normal"
              onChange={(e) => setBatchNumber(e.target.value)}
            // onBlur={(e) =>
            //   setValidation({ ...validation, batchNumber: true })
            // }
            />
            {validation.batchNumber && !isRequired(batchNumber) ? (
              <Typography color="error">Batch Number is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              // margin="dense"
              id="manufacturingDate"
              label="Manufacturing Date"
              onFocus={() => setFocused(true)}
              value={manufacturingDate}
              defaultValue={manufacturingDate}
              disabled={!batchEnabled.batchEnabled}
              variant={batchEnabled.batchEnabled ? "outlined" : "filled"}
              type={hasValue || focus ? "date" : "text"}
              onChange={(e) => {
                if (e.target.value) {
                  setHasValue(true);
                  setManufacturingDate(e.target.value);
                } else setHasValue(false);
              }}
              onBlur={(e) => {
                // setValidation({ ...validation, manufacturingDate: true })
                setFocused(false);
              }}
              inputProps={{ max: expiryDate }}
            />
            {validation.manufacturingDate && !isRequired(manufacturingDate) ? (
              <Typography color="error">
                Manufacturing Date is required!
              </Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth={true}
              id="expiryDate"
              label="Expiry Date"
              defaultValue={expiryDate}
              value={expiryDate}
              onFocus={() => setExpiryFocused(true)}
              disabled={!batchEnabled.batchEnabled}
              variant={batchEnabled.batchEnabled ? "outlined" : "filled"}
              type={expiryHasValue || expiryFocus ? "date" : "text"}
              onChange={(e) => {
                if (e.target.value) {
                  setExpiryHasValue(true);
                  setExpiryDate(e.target.value);
                } else setExpiryHasValue(false);
              }}
              onBlur={(e) => {
                setValidation({ ...validation, expiryDate: true });
                setExpiryFocused(false);
              }}
              inputProps={{ min: manufacturingDate }}
            />
            {(validation.expiryDate && (!isRequired(expiryDate) || expiryDate === '-')) ? (
              <Typography color="error">Expiry Date is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
          </Grid>
          <Grid item xs={2} className={classes.parentContainer}>
            <FormControl
              fullWidth={true}
              variant="outlined"
            >
              <Button
                variant="contained"
                onClick={() => {
                  updateProductsTable()
                }}
                color="primary"
                variant="contained"
              >
                Add Product
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer className={classes.parentContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className={classes.shadedTableHeader}>
              <TableCell className={classes.tableHeadText}>Name</TableCell>
              <TableCell className={classes.tableHeadText}>Quantity</TableCell>
              <TableCell className={classes.tableHeadText}>UoM</TableCell>
              <TableCell className={classes.tableHeadText}>
                Batch Name
              </TableCell>
              <TableCell className={classes.tableHeadText}>
                Batch Number
              </TableCell>
              <TableCell className={classes.tableHeadText}>
                Manufacturing Date
              </TableCell>
              <TableCell className={classes.tableHeadText}>
                Expiry Date
              </TableCell>
              <TableCell className={classes.tableHeadText}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productGroups.map((productGroup, idx) => {
              return (
                <TableRow hover role="checkbox">
                  <TableCell>{productGroup.product.name}</TableCell>
                  <TableCell>{productGroup.quantity}</TableCell>
                  <TableCell>{productGroup.product.UOM.name}</TableCell>
                  <TableCell>{
                    productGroup.product?.batchEnabled ?
                      productGroup.batchName?.includes('default') ? '-' : productGroup.batchName
                      :
                      '-'
                  }</TableCell>
                  <TableCell>{productGroup.batchNumber || '-'}</TableCell>
                  <TableCell>
                    {dividerDateFormat(productGroup.manufacturingDate)}
                  </TableCell>
                  <TableCell>
                    {dividerDateFormat(productGroup.expiryDate)}
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      color="error"
                      key="delete"
                      onClick={() => {
                        setProductGroups(
                          productGroups.filter(
                            (_productGroup, _idx) => _idx != idx
                          )
                        )
                        resetLocalStates()
                        setValidation({
                          ...validation,
                          productId: false,
                          quantity: false
                        })
                      }

                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {productGroups.length > 0 ? (
        <Grid container className={classes.parentContainer} xs={12} spacing={3}>
          <Grid item xs={3}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                {!selectedProductInward
                  ? "Add Products Inward"
                  : "Update Product Inward"}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      ) : (
        ""
      )}

      <MessageSnackbar showMessage={showMessage} type={messageType} />
      {batchEnabled.batchEnabled && expiryDate ? (
        <BatchInventoryUpdateDialog
          open={open}
          setOpen={setOpen}
          productGroups={productGroups}
          batchData={batchData}
          handleAddedProducts={handleAddedProducts}
          setLocalStates={setLocalStates}
          localStates={{
            product: products.find((_product) => _product.id == productId),
            warehouse: warehouses.find(
              (_warehouse) => _warehouse.id == warehouseId
            ),
            quantity,
            batchNumber,
            manufacturingDate,
            expiryDate,
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}
