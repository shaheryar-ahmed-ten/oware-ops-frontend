import { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { isRequired, isNotEmptyArray, isChar } from "../../../utils/validators";
import { dateToPickerFormat, getURL, digitize } from "../../../utils/common";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Navigate, useLocation, useNavigate } from "react-router";
import { upload } from "../../../utils/upload";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import axios from "axios";
import { Alert, Autocomplete } from "@material-ui/lab";
import { Map, GoogleApiWrapper } from "google-maps-react";
import GoogleMap from "../../../components/GoogleMap.js";

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
  selectBox: {
    height: 55,
  },
  textBox: {
    height: 34,
    // paddingTop:15
    // "& label": {
    //   paddingTop:5,
    // }
    // height: 34
  },
  labelBox: {
    "& label": {
      paddingTop: 7,
    },
  },
  dateBox: {
    height: 35,
  },
  labelPadding: {
    paddingTop: 5,
  },
}));

function AddRideView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  const [selectedRide, setSelectedRide] = useState(state ? state.selectedRide : null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [cities, setCities] = useState([]);
  const [manifestImage, setManifestImage] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [cars, setCars] = useState([]);
  const [eirImage, setEIRImage] = useState(null);
  const [builtyImage, setBuiltyImage] = useState(null);


  useEffect(() => {
    getRelations();
  }, []);

  const addRide = (data) => {
    let apiPromise = null;
    if (!selectedRide) apiPromise = axios.post(getURL("ride"), data);
    else apiPromise = axios.put(getURL(`ride/${selectedRide.id}`), data);
    apiPromise.then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      navigate("/logistics/ride");
      // setShowMessage({
      //     message: "New ride has been created."
      // })
      // closeAddRideView(false);
      // getRides();
    });
  };
  const productCategoriesMap = productCategories.reduce((acc, category) => ({ ...acc, [category.id]: category }), {});

  const [validation, setValidation] = useState({});
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [status, setStatus] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [pickupCityId, setPickupCityId] = useState("");
  const [dropoffCityId, setDropoffCityId] = useState("");
  const [products, setProducts] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [carName, setCarName] = useState("");
  const [carId, setCarId] = useState("");
  const [memo, setMemo] = useState(""); // optional comment

  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationComment, setCancellationComment] = useState("");

  const [weightCargo, setWeightCargo] = useState("");
  const [pocName, setPOCName] = useState("");
  const [pocNumber, setPOCNumber] = useState("");
  const [eta, setETA] = useState("");
  const [completionTime, setCompletionTime] = useState("");

  const [productCategoryId, setProductCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  const [price, setPrice] = useState();
  const [cost, setCost] = useState();
  const [customerDiscount, setCustomerDiscount] = useState();
  const [driverIncentive, setDriverIncentive] = useState();

  const [pickupDate, setPickupDate] = useState(dateToPickerFormat(new Date()));
  const [dropoffDate, setDropoffDate] = useState(dateToPickerFormat(new Date()));

  const [isActive, setActive] = useState(true);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [vehicleType, setVehicleType] = useState([]);
  const [pickUp, setPickUp] = useState({});
  const [dropOff, setDropOff] = useState({});

  // console.log(pickUp, "pickUp", dropOff, "dropOff");
  const getRelations = () => {
    axios.get(getURL("ride/relations")).then((res) => {
      setVehicles(res.data.vehicles);
      setDrivers(res.data.drivers);
      setStatuses(res.data.statuses);
      setCities(res.data.cities);
      setCompanies(res.data.companies);
      setProductCategories(res.data.productCategories);
      setCars(res.data.cars);
      setVendors(res.data.vendors);
    });
  };
  const addProduct = () => {
    setValidation({
      ...validation,
      productCategoryId: true,
      productName: true,
      productQuantity: true,
    });
    if (productCategoryId && productName && productQuantity) {
      setProducts([
        ...products,
        {
          categoryId: productCategoryId,
          name: productName,
          quantity: productQuantity,
        },
      ]);
      setValidation({
        ...validation,
        productCategoryId: false,
        productName: false,
        productQuantity: false,
      });
    }
  };

  useEffect(() => {
    if (!!selectedRide && vendors.length > 0) {
      setVendorId(selectedRide.Vehicle.Vendor.id || "");
      setStatus(selectedRide.status || "");
      setVehicleId(selectedRide.Vehicle.id || "");
      setDriverId(selectedRide.Driver.id || "");
      setPickupAddress(selectedRide.pickupAddress || "");
      setDropoffAddress(selectedRide.dropoffAddress || "");
      setCustomerId(selectedRide.Customer.id || "");
      setCancellationComment(selectedRide.cancellationComment || "");
      setCancellationReason(selectedRide.cancellationReason || "");
      setPickupCityId(selectedRide.pickupCity.id || "");
      setDropoffCityId(selectedRide.dropoffCity.id || "");
      setProducts(selectedRide.RideProducts || "");
      setPickupDate(dateToPickerFormat(selectedRide.pickupDate) || "");
      setDropoffDate(dateToPickerFormat(selectedRide.dropoffDate) || "");
      setActive(!!selectedRide.isActive);
      setPrice(selectedRide.price || "");
      setCost(selectedRide.cost || "");
      setCustomerDiscount(selectedRide.customerDiscount || "");
      setDriverIncentive(selectedRide.driverIncentive || "");
      setMemo(selectedRide.memo || "");
      setWeightCargo(selectedRide.weightCargo || "");
      setPOCName(selectedRide.pocName || "");
      setPOCNumber(selectedRide.pocNumber || "");
      setETA(selectedRide.eta || "");
      setCompletionTime(selectedRide.completionTime || "");
    }
  }, [selectedRide, vendors]);

  useEffect(() => {
    setProductName("");
    setProductQuantity("");
    setProductCategoryId(null);
  }, [products]);

  useEffect(() => {
    if (vendorId) {
      setVehicles([]);
      setSelectedVendor(null);
      setCarId("");
      setSelectedVendor(vendors.find((vendor) => vendor.id == vendorId));
      const carVehicleTemp = vendors.find((vendor) => vendor.id == vendorId).Vehicles;
      const filterCarArray = removeCarDuplicate(carVehicleTemp);
      setVehicleType(filterCarArray);
    }
  }, [vendorId]);

  useEffect(() => {
    if (!!selectedRide && !!vendorId && !mounted) {
      setCarId(selectedRide.Vehicle.Car.id);
      setMounted(true);
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (carId) {
      const carVehicle = vendors
        .find((vendor) => vendor.id == vendorId)
        .Vehicles.find((vehicle) => vehicle.carId == carId);
      const carVehicleTemp = vendors.find((vendor) => vendor.id == vendorId).Vehicles;
      if (carVehicleTemp && carVehicleTemp?.length > 0) {
        const filterCarArray = removeCarDuplicate(carVehicleTemp);
        setVehicleType(filterCarArray);
        getVehicles(carId, vendorId);
        // console.log("carVehicleTemp", filterCarArray);
      }
    }
  }, [carId]);

  function getVehicles(carId, companyId) {
    axios.get(getURL("vehicle"), { params: { carId, companyId } }).then((res) => {
      setVehicles(res.data.data);
    });
  }

  function removeCarDuplicate(carVehicleTemp) {
    const prevAdded = [];
    const newArray = [];
    carVehicleTemp.forEach((item) => {
      if (!prevAdded.includes(item.carId)) {
        newArray.push(item);
        prevAdded.push(item.carId);
      }
    });

    return newArray;
  }

  useEffect(() => {
    const vehicle = vehicles.find((vehicle) => vehicle.id == vehicleId);
    if (vehicle) setDriverId(vehicle.driverId);
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    let newRide = {
      status,
      vehicleId,
      driverId,
      pickupAddress,
      dropoffAddress,
      customerId,
      cancellationReason,
      cancellationComment,
      price,
      cost,
      customerDiscount,
      driverIncentive,
      products,
      pickupDate: new Date(pickupDate),
      dropoffDate: new Date(dropoffDate),
      memo,
      weightCargo,
      pocName,
      pocNumber,
      eta,
      completionTime, 
      // carId,
      // vendorId,
      isActive,
      dropoffCityId,
      pickupCityId,
      pickupLocation: pickUp,
      dropoffLocation: dropOff,
    };

    setValidation({
      status: true,
      vehicleId: true,
      driverId: true,
      pickupAddress: true,
      dropoffAddress: true,
      customerId: true,
      cancellationReason: true,
      cancellationComment: true,
      price: true,
      cost: true,
      customerDiscount: true,
      driverIncentive: true,
      products: true,
      pickupDate: true,
      dropoffDate: true,
      // carId: true,
      // vendorId: true,
      weightCargo: true,
      pocName: true,
      pocNumber: true,
      eta: true,
      completionTime: true, 
      isActive: true,
      dropoffCityId: true,
      pickupCityId: true,
      pickupLocation: true,
      dropoffLocation: true,
    });

    if (
      isRequired(vehicleId) &&
      (status === "UNASSIGNED" || isRequired(driverId)) &&
      isRequired(pickupAddress) &&
      isRequired(dropoffAddress) &&
      isRequired(customerId) &&
      (status != "CANCELLED" || isRequired(cancellationReason)) &&
      (status != "CANCELLED" || isRequired(cancellationComment)) &&
      isRequired(price) &&
      isRequired(cost) &&
      isRequired(customerDiscount) &&
      isRequired(driverIncentive) &&
      isNotEmptyArray(products) &&
      isRequired(carId) &&
      isRequired(vendorId) &&
      isRequired(pickupDate) &&
      isRequired(dropoffDate) &&
      isRequired(pickupCityId) &&
      isRequired(dropoffCityId)
      // isRequired(pickupLocation) &&
      // isRequired(dropoffLocation)
    ) {
      if (manifestImage) {
        const [manifestId] = await upload([manifestImage], "ride");
        newRide.manifestId = manifestId;
      }
      if (eirImage) {
        const [eirId] = await upload([eirImage], "ride");
        newRide.eirId = eirId;
      }
      if (builtyImage) {
        const [builtyId] = await upload([builtyImage], "ride");
        newRide.builtyId = builtyId;
      }
      addRide(newRide);
    }
  };
  const handleCustomerSearch = (vendorId, vendorName) => {
    setVendorId(vendorId);
    setSelectedVendorName(vendorName);
  };

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.pageHeading}>
              {!selectedRide ? "Create" : "Edit"} Ride
            </Typography>
            {selectedRide && <Typography variant="p">Ride ID: {digitize(selectedRide.id, 6)}</Typography>}
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/logistics/ride")}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Company & Vehicle
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="vendorId"
                key={companies}
                options={companies}
                defaultValue={!!selectedRide ? { name: selectedRide.Customer.name, id: selectedRide.Customer.id } : ""}
                renderInput={(params) => <TextField {...params} label="Company" variant="outlined" />}
                getOptionLabel={(company) => company.name || ""}
                onBlur={(e) => setValidation({ ...validation, customerId: true })}
                onChange={(event, newValue) => {
                  if (newValue) setCustomerId(newValue.id);
                }}
              />
              {validation.customerId && !isRequired(customerId) ? (
                <Typography color="error">Company is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="status"
                key={statuses}
                options={Object.keys(statuses)}
                defaultValue={!!selectedRide ? selectedRide.status : ""}
                renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
                getOptionLabel={(status) => statuses[status] || ""}
                onBlur={(e) => setValidation({ ...validation, status: true })}
                onChange={(event, newValue) => {
                  if (newValue) setStatus(newValue);
                }}
              />
              {validation.status && !isRequired(status) ? (
                <Typography color="error">Status is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
        </Grid>
        {status == "CANCELLED" ? (
          <Grid container item xs={12} spacing={3}>
            <Grid item sm={6}>
              <TextField
                inputProps={{ className: classes.textBox }}
                className={classes.labelBox}
                fullWidth={true}
                margin="dense"
                id="cancellationReason"
                label="Cancellation reason"
                type="text"
                variant="outlined"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                onBlur={(e) => setValidation({ ...validation, cancellationReason: true })}
              />
              {validation.cancellationReason && !isRequired(cancellationReason) ? (
                <Typography color="error">Cancellation reason is required!</Typography>
              ) : (
                ""
              )}
            </Grid>
            <Grid item sm={6}>
              <TextField
                inputProps={{ className: classes.textBox }}
                className={classes.labelBox}
                fullWidth={true}
                margin="dense"
                id="cancellationComment"
                label="Cancellation comment"
                type="text"
                variant="outlined"
                value={cancellationComment}
                onChange={(e) => setCancellationComment(e.target.value)}
                onBlur={(e) => setValidation({ ...validation, cancellationComment: true })}
              />
              {validation.cancellationComment && !isRequired(cancellationComment) ? (
                <Typography color="error">Cancellation comment is required!</Typography>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {/* Car and Vendor Addition Starts*/}
        <Grid container item xs={12} spacing={3} style={{ marginBottom: -30 }}>
          <Grid item sm={6}>
            {/* <FormControl margin="dense" fullWidth={true} variant="outlined"> */}
            <Autocomplete
              id="vendorId"
              options={vendors}
              defaultValue={selectedRide ? { name: selectedRide.Vehicle.Vendor.name, id: vendorId } : ""}
              getOptionLabel={(vendor) => vendor.name || ""}
              onChange={(event, newValue) => {
                if (newValue) handleCustomerSearch(newValue.id, newValue.name || "");
              }}
              renderInput={(params) => <TextField {...params} label="Vendor" variant="outlined" />}
              onBlur={(e) => setValidation({ ...validation, vendorId: true })}
            />
            {validation.vendorId && !isRequired(vendorId) ? (
              <Typography color="error">Vendor is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
            {/* </FormControl> */}
          </Grid>
          <Grid item sm={6} style={{ paddingTop: 4 }}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="carId"
                key={vehicleType}
                options={vehicleType}
                defaultValue={
                  !!selectedRide
                    ? {
                      name: `${selectedRide.Vehicle.Car.CarMake.name} ${selectedRide.Vehicle.Car.CarModel.name}`,
                      id: selectedRide.Vehicle.Car.id,
                    }
                    : ""
                }
                renderInput={(params) => <TextField {...params} label="Vehicle Type" variant="outlined" />}
                getOptionLabel={(vehicle) => {
                  return vehicle && vehicle.name
                    ? vehicle.name
                    : vehicle.Car && vehicle.Car.CarMake && vehicle.Car.CarModel
                      ? `${vehicle.Car.CarMake.name} ${vehicle.Car.CarModel.name}`
                      : "";
                }}
                onBlur={(e) => setValidation({ ...validation, carId: true })}
                onChange={(event, newValue) => {
                  if (newValue) setCarId(newValue.carId);
                }}
              />
              {validation.carId && !isRequired(carId) ? (
                <Typography color="error">Vehicle Type is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
        </Grid>
        {/* Car and Vendor Addition Ends */}
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="vehicleId"
                key={vehicles}
                options={vehicles}
                defaultValue={!!selectedRide ? { registrationNumber: selectedRide.Vehicle.registrationNumber, id: selectedRide.Vehicle.id } : ''}
                renderInput={(params) => <TextField {...params} label="Vehicle" variant="outlined" />}
                getOptionLabel={(vehicle) => vehicle.registrationNumber || ""}
                onBlur={e => setValidation({ ...validation, status: true })}
                onChange={(event, newValue) => {
                  if (newValue)
                    setVehicleId(newValue.id)
                }}
              />
              {validation.vehicleId && !isRequired(vehicleId) ? (
                <Typography color="error">Vehicle is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="driverId"
                key={selectedVendor?.Drivers}
                options={selectedVendor && selectedVendor.Drivers ? selectedVendor.Drivers : []}
                defaultValue={!!selectedRide ? { name: selectedRide.Driver.name, id: selectedRide.Driver.id } : ""}
                renderInput={(params) => <TextField {...params} label="Driver" variant="outlined" />}
                getOptionLabel={(driver) => driver.name || ""}
                onBlur={(e) => setValidation({ ...validation, driverId: true })}
                onChange={(event, newValue) => {
                  if (newValue) setDriverId(newValue.id);
                }}
              />
              {validation.driverId && status == "ASSIGNED" && !isRequired(driverId) ? (
                <Typography color="error">Driver is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Pickup & Drop-off
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel className={classes.labelPadding}>Pickup City</InputLabel>
              <Select
                className={classes.selectBox}
                fullWidth={true}
                id="pickupAreaId"
                label="Pickup Area"
                variant="outlined"
                value={pickupCityId}
                onChange={(e) => setPickupCityId(e.target.value)}
                onBlur={(e) => setValidation({ ...validation, pickupCityId: true })}
              >
                <MenuItem value="" disabled>
                  Select a PickupCity
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              {validation.pickupCityId && !isRequired(pickupCityId) ? (
                <Typography color="error">Pickup City is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.labelBox}
              inputProps={{ className: classes.textBox }}
              fullWidth={true}
              margin="dense"
              id="pickupAddress"
              label="Pickup address"
              type="text"
              variant="outlined"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              onBlur={(e) => setValidation({ ...validation, pickupAddress: true })}
            />
            {validation.pickupAddress && !isRequired(pickupAddress) ? (
              <Typography color="error">Pickup address is required!</Typography>
            ) : (
              ""
            )}
          </Grid>

          <Grid item sm={6}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <InputLabel className={classes.labelPadding}>Dropoff City</InputLabel>
              <Select
                className={classes.selectBox}
                fullWidth={true}
                id="dropoffCityId"
                label="Drop-off City"
                variant="outlined"
                value={dropoffCityId}
                onChange={(e) => setDropoffCityId(e.target.value)}
                onBlur={(e) => setValidation({ ...validation, dropoffCityId: true })}
              >
                <MenuItem value="" disabled>
                  Select a DropoffCity
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
              {validation.dropoffCityId && !isRequired(dropoffCityId) ? (
                <Typography color="error">Dropoff City is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.labelBox}
              inputProps={{ className: classes.textBox }}
              fullWidth={true}
              margin="dense"
              id="dropoffAddress"
              label="Dropoff address"
              type="text"
              variant="outlined"
              value={dropoffAddress}
              onChange={(e) => setDropoffAddress(e.target.value)}
              onBlur={(e) => setValidation({ ...validation, dropoffAddress: true })}
            />
            {validation.dropoffAddress && !isRequired(dropoffAddress) ? (
              <Typography color="error">Dropoff address is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid
            item
            sm={12}
            className={classes.locationMap}
            style={{ position: "relative", minHeight: 500, marginBottom: 30, minWidth: "100%" }}
          >
            <GoogleMap
              setDropOff={setDropOff}
              setPickUp={setPickUp}
              pickupLocation={selectedRide ? selectedRide.pickupLocation : ""}
              dropoffLocation={selectedRide ? selectedRide.dropoffLocation : ""}
              showMapSearchFields={true}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              // className={classes.textBox}
              fullWidth={true}
              margin="dense"
              id="pickupDate"
              label="Pickup Date & Time"
              placeholder="Pickup Date & Time"
              inputProps={{ min: new Date().toISOString().slice(0, 16), className: classes.dateBox }}
              type="datetime-local"
              variant="outlined"
              value={pickupDate}
              minuteStep={15}
              onChange={(e) => {
                setPickupDate(dateToPickerFormat(e.target.value));
                setDropoffDate(dateToPickerFormat(e.target.value));
              }}
              onBlur={(e) => setValidation({ ...validation, pickupDate: true })}
            />
            {validation.pickupDate && !isRequired(pickupDate) ? (
              <Typography color="error">Pickup date is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item sm={6}>
            <TextField
              // className={classes.textBox}
              fullWidth={true}
              margin="dense"
              id="dropoffDate"
              label="Dropoff Date & Time"
              // inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              inputProps={{ min: pickupDate, className: classes.dateBox }}
              placeholder="Dropoff Date & Time"
              type="datetime-local"
              variant="outlined"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(dateToPickerFormat(e.target.value))}
              onBlur={(e) => setValidation({ ...validation, dropoffDate: true })}
            />
            {validation.dropoffDate && !isRequired(dropoffDate) ? (
              <Typography color="error">Dropoff date is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Cost & Price
            </Typography>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              className={classes.labelBox}
              fullWidth={true}
              inputProps={{ className: classes.textBox }}
              margin="dense"
              id="price"
              label="Customer Price (Rs.)"
              placeholder="Customer Price (Rs.)"
              type="number"
              variant="outlined"
              value={!!price && price}
              minuteStep={15}
              onChange={(e) => setPrice(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={(e) => setValidation({ ...validation, price: true })}
            />
            {validation.price && !isRequired(price) ? (
              <Typography color="error">Customer Price is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.labelBox}
              fullWidth={true}
              inputProps={{ className: classes.textBox }}
              margin="dense"
              id="cost"
              label="Vendor Cost (Rs.)"
              placeholder="Vendor Cost (Rs.)"
              type="number"
              variant="outlined"
              value={!!cost && cost}
              onChange={(e) => setCost(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={(e) => setValidation({ ...validation, cost: true })}
            />
            {validation.cost && !isRequired(cost) ? (
              <Typography color="error">Vendor Cost is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              className={classes.labelBox}
              fullWidth={true}
              inputProps={{ className: classes.textBox }}
              margin="dense"
              id="customerDiscount"
              label="Customer Discount (Rs.)"
              placeholder="Customer Discount (Rs.)"
              type="number"
              variant="outlined"
              value={!!customerDiscount && customerDiscount}
              minuteStep={15}
              onChange={(e) => setCustomerDiscount(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={(e) => setValidation({ ...validation, customerDiscount: true })}
            />
            {validation.customerDiscount && !isRequired(customerDiscount) ? (
              <Typography color="error">Customer Discount is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.labelBox}
              fullWidth={true}
              inputProps={{ className: classes.textBox }}
              margin="dense"
              id="driverIncentive"
              label="Driver Incentive (Rs.)"
              placeholder="Driver Incentive (Rs.)"
              type="number"
              variant="outlined"
              value={!!driverIncentive && driverIncentive}
              onChange={(e) => setDriverIncentive(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={(e) => setValidation({ ...validation, driverIncentive: true })}
            />
            {validation.driverIncentive && !isRequired(driverIncentive) ? (
              <Typography color="error">Driver Incentive is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
        </Grid>

        {/* Memo Addition Starts */}
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Other Details
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <TextField
              multiline
              fullWidth={true}
              // inputProps={{className:classes.textBox}}
              margin="dense"
              rows={6}
              id="memo"
              label="Memo for driver"
              type="text"
              variant="outlined"
              InputProps={{ inputProps: { maxLength: 1000 }, className: classes.memoBox }}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            // onBlur={e => setValidation({ ...validation, memo: true })}
            />
            {/* { !!{inputProps: { maxLength: 1000 }} && memo.length >=1000 ? <Typography color="error">Length should be less than 1000 words.</Typography> : ''} */}
            <Typography style={{ color: "#1d1d1d", fontSize: 12 }}>Max Length (1000 characters)</Typography>
          </Grid>
        </Grid>

        {/* Memo Addition Ends */}
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Product Details
            </Typography>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={3}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <InputLabel className={classes.labelPadding}>Product Category</InputLabel>
                <Select
                  className={classes.selectBox}
                  fullWidth={true}
                  id="productCategoryId"
                  label="Product Category"
                  variant="outlined"
                  value={productCategoryId}
                  onChange={(e) => setProductCategoryId(e.target.value)}
                  onBlur={(e) => setValidation({ ...validation, productCategoryId: true })}
                >
                  <MenuItem value="" disabled>
                    Select a product category
                  </MenuItem>
                  {productCategories.map((productCategory) => (
                    <MenuItem key={productCategory.id} value={productCategory.id}>
                      {productCategory.name}
                    </MenuItem>
                  ))}
                </Select>
                {validation.productCategoryId && !isRequired(productCategoryId) ? (
                  <Typography color="error">Product Category is required!</Typography>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                className={classes.labelBox}
                fullWidth={true}
                inputProps={{ className: classes.textBox }}
                margin="dense"
                id="productName"
                label="Product name"
                type="text"
                variant="outlined"
                value={productName}
                onChange={(e) => {
                  // const regex = /^[a-zA-Z1-9]*$/
                  // if (regex.test(e.target.value))
                  setProductName(e.target.value);
                }}
                onBlur={(e) => setValidation({ ...validation, productName: true })}
              />
              {validation.productName && !isRequired(productName) ? (
                <Typography color="error">Product name is required!</Typography>
              ) : (
                ""
              )}
              {/* {validation.productName && !isChar(productName) ? <Typography color="error">Product name is only alphabets!</Typography> : ''} */}
            </Grid>
            <Grid item xs={3}>
              <TextField
                className={classes.labelBox}
                fullWidth={true}
                inputProps={{ className: classes.textBox }}
                margin="dense"
                id="productQuantity"
                label="Product quantity"
                type="number"
                variant="outlined"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
                onBlur={(e) => setValidation({ ...validation, productQuantity: true })}
              />
              {validation.productQuantity && !isRequired(productQuantity) ? (
                <Typography color="error">Product quantity is required!</Typography>
              ) : (
                ""
              )}
              {/* {validation.productQuantity && !isNumber(productQuantity) ? <Typography color="error">Product quantity is only numbers!</Typography> : ''} */}
            </Grid>
            <Grid item xs={3}>
              <FormControl margin="dense" variant="outlined">
                <Button
                  variant="contained"
                  onClick={() =>
                    addProduct({
                      categoryId: productCategoryId,
                      name: productName,
                      quantity: productQuantity,
                    })
                  }
                  color="primary"
                >
                  Add Product
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                      Category
                    </TableCell>
                    <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                      Name
                    </TableCell>
                    <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                      Quantity
                    </TableCell>
                    <TableCell style={{ background: "transparent", fontWeight: "bolder", fontSize: "12px" }}>
                      Manifest
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => {
                    return (
                      <TableRow hover role="checkbox">
                        <TableCell>
                          {productCategoriesMap[product.categoryId]
                            ? productCategoriesMap[product.categoryId].name
                            : ""}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {product.manifestId && product.Manifest ? (
                            <a target="_blank" href={getURL("preview", product.manifestId)}>
                              {product.Manifest.originalName}
                            </a>
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            color="error"
                            key="delete"
                            onClick={() => setProducts(products.filter((_product, _index) => _index != index))}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              {selectedRide && selectedRide.Manifest ? (
                <a target="_blank" href={getURL("preview", selectedRide.Manifest.id)}>
                  Product Manifest Image
                </a>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={3}>
            <Grid item sm={12}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Button
                  variant="contained"
                  component="label"
                  color={(selectedRide && selectedRide.manifestId) || manifestImage ? "primary" : "default"}
                  startIcon={<CloudUploadIcon />}
                >
                  Product Manifest {(selectedRide && selectedRide.manifestId) || manifestImage ? "Uploaded" : ""}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      setManifestImage(e.target.files[0]);
                    }}
                    accept=".jpg,.png,.jpeg"
                  />
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={3}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {!selectedRide ? "Add Ride" : "Update Ride"}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU",
})(AddRideView);
