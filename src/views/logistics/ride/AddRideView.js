import { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  FormControl,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ButtonGroup,
  IconButton,
  Tooltip,
  Modal,
  Box,
} from "@material-ui/core";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import { isRequired, isNotEmptyArray, isPhone, isValidDate } from "../../../utils/validators";
import {
  dateToPickerFormat,
  getURL,
  digitize,
  removeItemFromArrayIfExistInAnotherArray,
  sortByKey,
} from "../../../utils/common";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { useLocation, useNavigate } from "react-router";
import { RIDE_STATUS } from "../../../utils/enums/ride";
import reverseGeocoding from "../../../utils/Geocoding";
import { DROPOFF_STATUS } from "../../../utils/enums/ride.js";
import { Link } from "react-router-dom";
import { upload } from "../../../utils/upload";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import axios from "axios";
import { Alert, Autocomplete } from "@material-ui/lab";
import { GoogleApiWrapper } from "google-maps-react";
import GoogleMap from "../../../components/GoogleMap.js";
import ConfirmDelete from "../../../components/ConfirmDelete";
import MaskedInput from "react-text-mask";
import clsx from "clsx";
import { RIDE_COLUMNS_WITH_MANDATORY_STATUSES } from "./columnsMandatoryStatuses";
import DropoffGoogleMap from "../../../components/DropoffGoogleMap";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import ArrowCircleUpIcon from "@material-ui/icons/ArrowUpward";
import AddRideBackdrop from "../../../components/Ride/AddRideBackdrop";
import MoveDropoffDialog from "./MoveDropoffDialog.js";
import ChangeRideDropoffDialog from "./ChangeRideDropoffDialog.js";
import DeleteDropoffDialog from "./DeleteDropoffDialog.js";
import MessageSnackbar from "../../../components/MessageSnackbar";

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
  },
  commentBox: {
    height: 57,
  },
  pocBox: {
    height: 34,
    // width: "102%",
  },
  weightBox: {
    display: "none",
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
  const [dropoffStatuses, setDropoffStatuses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [cities, setCities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [cars, setCars] = useState([]);
  const [eirImage, setEIRImage] = useState(null);
  const [manifestImage, setManifestImage] = useState(null);
  const [manifestType, setManifestType] = useState(false);
  const [manifestSize, setManifestSize] = useState(false);
  const [manifestImageSrc, setManifestImageSrc] = useState(null);
  const [eirImageSrc, setEIRImageSrc] = useState(null);
  const [eirType, setEIRType] = useState(false);
  const [eirSize, setEIRSize] = useState(false);
  const [builtyImage, setBuiltyImage] = useState(null);
  const [builtyImageSrc, setBuiltyImageSrc] = useState(null);
  const [builtyType, setBuiltyType] = useState(false);
  const [builtySize, setBuiltySize] = useState(false);
  const [dropoffs, setDropoffs] = useState([]);
  const [currentDropoff, setCurrentDropoff] = useState({});
  const [outwardId, setOutwardId] = useState(null);
  const [addDropoffMessage, setAddDropoffMessage] = useState(null);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [showChangeConfirmMessage, setShowChangeConfirmMessage] = useState(false);
  const [initialProductOutwards, setInitialProductOutwards] = useState([]);

  useEffect(() => {
    getRelations();
  }, []);

  const removeDuplicateDropoff = (data) => {
    const prevAdded = [];
    const newArray = [];
    if (data.length > 0) {
      data.forEach((item) => {
        if (!prevAdded.includes(item.outwardId)) {
          newArray.push(item);
          prevAdded.push(item.outwardId);
        }
      });
    }

    return newArray;
  };

  const addRide = (data) => {
    if (checkDropoffValidation()) {
      let apiPromise = null;
      if (!selectedRide) {
        apiPromise = axios.post(getURL("ride"), data);
        setAddDropoffMessage({ message: `Load has been added successfully` });
      } else {
        data.dropoffs = removeDuplicateDropoff(data.dropoffs);
        apiPromise = axios.put(getURL(`ride/${selectedRide.id}`), data);
        setAddDropoffMessage({ message: `Load has been updated successfully` });
      }
      apiPromise.then((res) => {
        if (!res.data.success) {
          setFormErrors(
            <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
              {res.data.message}
            </Alert>
          );
          return;
        }
        navigate("/logistics/ride", { state: { prevPath: location.pathname } });
      });
    }
  };

  const addDropoff = (data, dropoffNumber) => {
    console.log(":- newDropoff", data, "dropoffNumber", dropoffNumber);
    if (dropoffs[dropoffNumber - 1]) {
      dropoffs[dropoffNumber - 1] = data;
      // setAddDropoffMessage({ message: `Dropoff ${dropoffNumber} has been saved!` });
    } else {
      dropoffs.push(data);
      // setAddDropoffMessage({ message: `Dropoff ${dropoffNumber} has been added!` });
    }
    selectedRide
      ? setProductOutwards(removeItemFromArrayIfExistInAnotherArray(productOutwards, selectedRide.RideDropoff))
      : setProductOutwards(removeItemFromArrayIfExistInAnotherArray(productOutwards, dropoffs));
    setDropoffs(dropoffs);
    setDropoffStatus(DROPOFF_STATUS.DROPOFF_SCHEDULED);
  };

  const productCategoriesMap = productCategories.reduce((acc, category) => ({ ...acc, [category.id]: category }), {});

  const [validation, setValidation] = useState({});
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [selectedDropoffNumber, setSelectedDropoffNumber] = useState(1);
  const [status, setStatus] = useState(RIDE_STATUS.NOT_ASSIGNED);
  const [dropoffStatus, setDropoffStatus] = useState(
    selectedRide && selectedRide.RideDropoff[selectedDropoffNumber - 1]
      ? selectedRide.RideDropoff[selectedDropoffNumber - 1].status
      : DROPOFF_STATUS.DROPOFF_SCHEDULED
  );
  const [customerId, setCustomerId] = useState("");
  const [driverId, setDriverId] = useState(null);
  const [pickupCityId, setPickupCityId] = useState(null);
  const [dropoffCityId, setDropoffCityId] = useState(null);
  const [products, setProducts] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [carName, setCarName] = useState("");
  const [vehicleId, setVehicleId] = useState(null);
  const [carId, setCarId] = useState(null);
  const [memo, setMemo] = useState(""); // optional comment

  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationComment, setCancellationComment] = useState("");

  const [weightCargo, setWeightCargo] = useState("");
  const [pocName, setPOCName] = useState("");
  const [pocNumber, setPOCNumber] = useState("");
  const [eta, setETA] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const [productCategoryId, setProductCategoryId] = useState(null);
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
  const [duration, setDuration] = useState(0);
  const [cancellationReasons, setCancellationReasons] = useState([]);

  const phoneNumberMask = [/[0-9]/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  const [productOutwards, setProductOutwards] = useState([]);
  // const [selectedProductOutward, setSelectedProductOutward] = useState(null);
  const location = useLocation();

  const [singleLocationLatlng, setSingleLocationLatlng] = useState(null);
  const [singleLocationAddress, setSingleLocationAddress] = useState("");

  // dropoff count should not be used for fetch data from array, it is only for displaying n number of dropoff btns
  const [dropoffCount, setDropoffCount] = useState(selectedRide ? selectedRide.RideDropoff : [1]); // for tracking no. of dropoffs
  const [activedropoffCount, setActiveDropoffCount] = useState(1); // for tracking the currently active/clicked dropoff
  const [rideDropoffs, setRideDropoffs] = useState([]); // this will contain the details of all the dropoffs. e.g. [ {id:1,ride:abc }, {id,ride:xyz}]
  const [openReplaceRideBackdrop, setOpenReplaceRideBackdrop] = useState(true);
  const [dropoffDialogState, setDropoffDialogState] = useState(false);
  const [changeDropoffDialogState, setChangeDropoffDialogState] = useState(false);
  const [removeDropoffDialogState, setRemoveDropoffDialogState] = useState(false);
  const [flag, setFlag] = useState(false);

  const getRelations = () => {
    axios.get(getURL("ride/relations")).then((res) => {
      setVehicles(res.data.vehicles);
      setDrivers(res.data.drivers);
      setStatuses(res.data.statuses);
      setDropoffStatuses(res.data.dropoffStatuses);
      setCities(res.data.cities);
      setCompanies(res.data.companies);
      setProductCategories(res.data.productCategories);
      setCars(res.data.cars);
      setVehicleType(removeCarDuplicate(res.data.cars));
      setVendors(res.data.vendors);
      setCancellationReasons(res.data.cancellationReasons);
    });
  };

  useEffect(() => {
    if (!!selectedRide && vendors.length > 0) {
      if (selectedRide.RideDropoff.length > 0) {
        selectedRide.RideDropoff = sortByKey(selectedRide.RideDropoff, "sequenceNumber");
        for (const drop of selectedRide.RideDropoff) {
          if (!dropoffs.find((x) => x.outwardId === drop.outwardId))
            dropoffs.push({
              sequenceNumber: drop.sequenceNumber,
              outwardId: drop.outwardId,
              dropoffCityId: drop.cityId,
              dropoffAddress: drop.address,
              dropoffLocation: drop.location,
              dropoffDate: drop.dateTime,
              dropoffStatus: drop.status,
              pocName: drop.pocName,
              pocNumber: drop.pocNumber,
              currentLocation: drop.currentLocation,
              memo: drop.memo,
              manifestId: drop.manifestId,
            });
        }
        setFlag(true);
      }
      setDropoffs(sortByKey(dropoffs, "sequenceNumber"));
      setVendorId(selectedRide.Vehicle ? selectedRide.Vehicle.Vendor.id : null);
      setStatus(selectedRide.status ? selectedRide.status : RIDE_STATUS.NOT_ASSIGNED);
      setVehicleId(selectedRide.Vehicle ? selectedRide.Vehicle.id : null);
      setCarId(carId ? carId : selectedRide.Vehicle ? selectedRide.Vehicle.carId : null);
      setDriverId(selectedRide.Driver ? selectedRide.Driver.id : null);
      setPickupAddress(selectedRide.pickupAddress ? selectedRide.pickupAddress : "");
      setDropoffAddress(
        selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].address
          : ""
      );
      setOutwardId(
        selectedRide.RideDropoff[selectedDropoffNumber - 1] &&
          selectedRide.RideDropoff[selectedDropoffNumber - 1].outwardId
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].outwardId
          : null
      );
      setSingleLocationLatlng(selectedRide ? selectedRide.pickupLocation : "");
      setCustomerId(selectedRide.Customer ? selectedRide.Customer.id : null);
      setCancellationComment(selectedRide.cancellationComment ? selectedRide.cancellationComment : "");
      setCancellationReason(selectedRide.cancellationReason ? selectedRide.cancellationReason : "");
      setPickupCityId(selectedRide.pickupCity ? selectedRide.pickupCity.id : null);
      setDropoffCityId(
        selectedRide && selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].cityId
          : null
      );
      setProducts(selectedRide.RideProducts ? selectedRide.RideProducts : "");
      setPickupDate(selectedRide.pickupDate ? dateToPickerFormat(selectedRide.pickupDate) : "");
      setDropoffDate(
        selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? dateToPickerFormat(selectedRide.RideDropoff[selectedDropoffNumber - 1].dateTime)
          : ""
      );
      setActive(!!selectedRide.isActive);
      setPrice(selectedRide.price || null);
      setCost(selectedRide.cost || null);
      setCustomerDiscount(selectedRide.customerDiscount || null);
      setDriverIncentive(selectedRide.driverIncentive || null);
      setMemo(
        selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].memo
          : null
      );
      setWeightCargo(selectedRide.weightCargo || "");
      setPOCName(
        selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].pocName
          : null
      );
      setPOCNumber(
        selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].pocNumber
          : ""
      );

      selectedRide && selectedRide.eta ? setETA(Math.floor(selectedRide.eta / 60)) : setETA(null);
      selectedRide && selectedRide.completionTime
        ? setCompletionTime(Math.floor(selectedRide.completionTime / 60))
        : setCompletionTime(null);
      setCurrentLocation(
        selectedRide.RideDropoff[selectedDropoffNumber - 1]
          ? selectedRide.RideDropoff[selectedDropoffNumber - 1].currentLocation
          : ""
      );
      selectedRide &&
      selectedRide.RideDropoff[selectedDropoffNumber - 1] &&
      typeof selectedRide.RideDropoff[selectedDropoffNumber - 1].manifestId === "number"
        ? setManifestImageSrc(getURL("preview", selectedRide.RideDropoff[selectedDropoffNumber - 1].manifestId))
        : setManifestImageSrc(null);
      selectedRide && selectedRide.eirId ? setEIRImageSrc(getURL("preview", selectedRide.eirId)) : setEIRImageSrc(null);
      selectedRide && selectedRide.builtyId
        ? setBuiltyImageSrc(getURL("preview", selectedRide.builtyId))
        : setBuiltyImageSrc(null);
    }
    setOutwardId(
      selectedRide && selectedRide.RideDropoff && selectedRide.RideDropoff[selectedDropoffNumber - 1]
        ? selectedRide.RideDropoff[selectedDropoffNumber - 1].outwardId
        : null
    );
  }, [selectedRide, vendors]);

  useEffect(() => {
    setProductName("");
    setProductQuantity("");
    setProductCategoryId("");
  }, [products]);

  useEffect(() => {
    if (vendorId) setSelectedVendor(vendors.find((vendor) => vendor.id === vendorId));
  }, [vendorId]);

  useEffect(() => {
    setOutwardId(outwardId);
    setInitialProductOutwards(initialProductOutwards);
  }, [outwardId, initialProductOutwards]);

  useEffect(() => {
    if (!!selectedRide && !!vendorId && !mounted) {
      setVehicleId(selectedRide.Vehicle ? selectedRide.Vehicle.Car.id : null);
      setMounted(true);
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (carId) {
      getVendors(carId);
    }
    if (vendorId) {
      getVehicles(carId, vendorId);
    }
  }, [carId, vendorId]);

  function getVendors(carId) {
    axios.get(getURL("vehicle"), { params: { carId } }).then((res) => {
      setVendors(removeVendorDuplicate(res.data.data));
    });
  }

  function getVehicles(carId, vendorId) {
    axios.get(getURL("vehicle"), { params: { carId, companyId: vendorId } }).then((res) => {
      setVehicles(res.data.data);
    });
  }

  function getDrivers(vendorId) {
    axios.get(getURL("driver"), { params: { companyId: vendorId } }).then((res) => {
      setDrivers(res.data.data);
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

  function removeVendorDuplicate(vendorTemp) {
    const prevAdded = [];
    const newArray = [];
    vendorTemp.forEach((item) => {
      if (!prevAdded.includes(item.companyId)) {
        newArray.push(item);
        prevAdded.push(item.companyId);
      }
    });

    return newArray;
  }

  function removeDriverDuplicate(driverTemp) {
    const prevAdded = [];
    const newArray = [];
    driverTemp.forEach((item) => {
      if (!prevAdded.includes(item.driverId)) {
        newArray.push(item);
        prevAdded.push(item.driverId);
      }
    });

    return newArray;
  }

  useEffect(() => {
    const vehicle = vehicles.find((vehicle) => vehicle.id == vehicleId);
    if (vehicle) {
      // setDriverId(vehicle.driverId);
      getDrivers(vendorId);
    }
  }, [vehicleId]);

  const setSelectedRideMap = async (idx) => {
    if (selectedRide) {
      const addr = await reverseGeocoding(
        selectedRide && selectedRide.RideDropoff[idx] ? selectedRide.RideDropoff[idx].location : null
      );

      setSingleLocationAddress(addr);
      setSingleLocationLatlng(selectedRide.RideDropoff[idx] ? selectedRide.RideDropoff[idx].location : null);
    }
  };

  useEffect(() => {
    getOutwards();
    setSelectedRideMap(selectedDropoffNumber - 1);
  }, []);

  useEffect(() => {
    // console.log(":- before manifestImageSrc", manifestImageSrc);
    console.log(":- useEffect dropoffs", dropoffs);
    if (
      dropoffs &&
      dropoffs[selectedDropoffNumber - 1] &&
      typeof dropoffs[selectedDropoffNumber - 1].manifestId === "number"
    ) {
      console.log(
        ":- useEffect dropoffs[selectedDropoffNumber - 1].manifestId ",
        dropoffs[selectedDropoffNumber - 1].manifestId
      );
      setManifestImageSrc(getURL("preview", dropoffs[selectedDropoffNumber - 1].manifestId));
    } else {
      setManifestImageSrc(null);
    }
    // console.log(":- after manifestImageSrc", manifestImageSrc);
  }, [selectedDropoffNumber]);

  const handleAddDropoff = async (e) => {
    if (checkDropoffValidation()) {
      let newDropoff = {
        dropoffCityId,
        dropoffAddress,
        dropoffDate: new Date(dropoffDate),
        dropoffLocation: singleLocationLatlng,
        dropoffStatus,
        pocName,
        pocNumber: pocNumber ? pocNumber.replace(/-/g, "") : "",
        outwardId,
        // manifestId: (selectedRide && selectedRide.manifestId) || manifestImage || null,
        manifestId:
          dropoffs && dropoffs[selectedDropoffNumber - 1] ? dropoffs[selectedDropoffNumber - 1].manifestId : null,
        currentLocation,
        memo,
      };

      setValidation({
        dropoffDate: true,
        dropoffCityId: true,
        singleLocationLatlng: true,
        dropoffAddress: true,
        dropoffStatus: true,
        pocName: true,
        pocNumber: true,
        outwardId: true,
        currentLocation: true,
        memo: true,
      });

      console.log(":- adddropoff manifestImage", manifestImage);

      if (manifestImage) {
        const [manifestId] = await upload([manifestImage], "ride");
        newDropoff.manifestId = manifestId;
        setManifestImage(null);
      }

      // if (dropoffs && dropoffs[selectedDropoffNumber - 1] && dropoffs[selectedDropoffNumber - 1].manifestId) {
      //   newDropoff.manifestId = dropoffs[selectedDropoffNumber - 1].manifestId;
      // }
      // setManifestImageSrc(getURL("preview", newDropoff.manifestId));

      if (
        isRequired(dropoffDate) &&
        isRequired(dropoffCityId) &&
        isRequired(dropOff) &&
        isRequired(dropoffAddress) &&
        isRequired(dropoffStatus) &&
        isRequired(outwardId) &&
        isRequired(currentLocation) &&
        isRequired(singleLocationLatlng) &&
        isRequired(pocNumber) &&
        isRequired(pocName)
      ) {
        addDropoff(newDropoff, selectedDropoffNumber);
      }
    } else {
      triggerDropoffValidation();
      // setDropoffCount([...dropoffCount, dropoffCount.length - 1]);
    }
  };

  const handleSubmit = async (e) => {
    await handleAddDropoff();
    let newRide = {
      status,
      vehicleId,
      driverId,
      pickupAddress,
      customerId,
      cancellationReason,
      cancellationComment,
      price,
      cost,
      customerDiscount: customerDiscount === "" ? null : customerDiscount,
      driverIncentive: driverIncentive === "" ? null : driverIncentive,
      pickupDate: new Date(pickupDate),
      weightCargo,
      eta: eta * 60,
      completionTime: completionTime * 60,
      isActive,
      pickupCityId,
      pickupLocation: pickUp,
      eirId: (selectedRide && selectedRide.eirId) || eirImage || null,
      builtyId: (selectedRide && selectedRide.builtyId) || builtyImage || null,
      dropoffs,
    };

    setValidation({
      carId: true,
      pickupAddress: true,
      status: true,
      customerId: true,
      vehicleId: true,
      driverId: true,
      vendorId: true,
      vehicleId: true,
      customerId: true,
      cancellationReason: true,
      cancellationComment: true,
      price: true,
      cost: true,
      pickupDate: true,
      weightCargo: true,
      pocName: true,
      pocNumber: true,
      eta: true,
      completionTime: true,
      currentLocation: true,
      isActive: true,
      pickupCityId: true,
      pickupLocation: true,
      productCategoryId: products.length > 0 ? false : true,
      productName: products.length > 0 ? false : true,
      productQuantity: products.length > 0 ? false : true,
      dropoffs: true,
      dropoffStatus: true,
      outwardId: true,
      singleLocationLatlng: true,
    });

    if (eirImage) [newRide.eirId] = await upload([eirImage], "ride");

    if (builtyImage) [newRide.builtyId] = await upload([builtyImage], "ride");
    if (status === RIDE_STATUS.NOT_ASSIGNED) {
      if (
        isRequired(carId) &&
        isRequired(customerId) &&
        // isRequired(vehicleType) &&
        isRequired(pickupCityId) &&
        isRequired(pickupDate) &&
        isRequired(weightCargo) &&
        isRequired(pocName) &&
        isRequired(pocNumber) &&
        isPhone(pocNumber.replace(/-/g, ""))
      ) {
        addRide(newRide);
      }
    } else if (status === RIDE_STATUS.SCHEDULED || status === RIDE_STATUS.ON_THE_WAY) {
      if (
        isRequired(vendorId) &&
        isRequired(carId) &&
        isRequired(vehicleId) &&
        isRequired(driverId) &&
        isRequired(customerId) &&
        // isRequired(vehicleType) &&
        isRequired(pickupCityId) &&
        isRequired(pickupDate) &&
        isRequired(weightCargo)
        // isRequired(dropoffCityId) &&
        // isRequired(dropoffAddress) &&
        // isNotEmptyArray(products) &&
        // isRequired(pocName) &&
        // isRequired(pocNumber) &&
        // isPhone(pocNumber.replace(/-/g, ""))
      ) {
        addRide(newRide);
      }
    } else if (
      status === RIDE_STATUS.ARRIVED ||
      status === RIDE_STATUS.LOADING_IN_PROGRESS ||
      status === RIDE_STATUS.LOADING_COMPLETE
    ) {
      if (
        isRequired(vendorId) &&
        isRequired(carId) &&
        isRequired(vehicleId) &&
        isRequired(driverId) &&
        isRequired(customerId) &&
        // isRequired(vehicleType) &&
        isRequired(pickupCityId) &&
        // isRequired(dropoffCityId) &&
        // isRequired(dropoffAddress) &&
        isRequired(pickupDate) &&
        isRequired(weightCargo) &&
        isRequired(price) &&
        isRequired(cost) &&
        // isNotEmptyArray(products) &&
        // isRequired(pocName) &&
        // isRequired(pocNumber) &&
        // isPhone(pocNumber.replace(/-/g, "")) &&
        isRequired(currentLocation)
      ) {
        addRide(newRide);
      }
    } else if (status === RIDE_STATUS.JOURNEY_IN_PROGRESS) {
      if (
        isRequired(customerId) &&
        isRequired(vendorId) &&
        // isRequired(vehicleType) &&
        isRequired(vehicleId) &&
        isRequired(driverId) &&
        isRequired(pickupCityId) &&
        isRequired(pickupAddress) &&
        isRequired(pickupDate) &&
        isRequired(price) &&
        isRequired(cost) &&
        isRequired(weightCargo)
        // isRequired(dropoffCityId) &&
        // isRequired(dropoffAddress) &&
        // isRequired(pocName) &&
        // isRequired(pocNumber) &&
        // isPhone(pocNumber.replace(/-/g, "")) &&
        // isNotEmptyArray(products) &&
        // isRequired(dropoffDate)
      ) {
        addRide(newRide);
      }
    } else if (status === RIDE_STATUS.COMPLETED) {
      if (
        isRequired(customerId) &&
        isRequired(vendorId) &&
        // isRequired(vehicleType) &&
        isRequired(vehicleId) &&
        isRequired(driverId) &&
        isRequired(pickupCityId) &&
        isRequired(pickupAddress) &&
        isRequired(pickupDate) &&
        isRequired(price) &&
        isRequired(cost) &&
        isRequired(weightCargo)
        // isRequired(dropoffCityId) &&
        // isRequired(dropoffAddress) &&
        // isNotEmptyArray(products) &&
        // isRequired(dropoffDate) &&
      ) {
        addRide(newRide);
      }
    } else if (status === RIDE_STATUS.CANCELLED) {
      if (
        isRequired(customerId) &&
        isRequired(vendorId) &&
        // isRequired(vehicleType) &&
        isRequired(vehicleId) &&
        isRequired(driverId) &&
        isRequired(pickupCityId) &&
        isRequired(pickupAddress) &&
        isRequired(pickupDate) &&
        isRequired(price) &&
        isRequired(cost) &&
        isRequired(weightCargo) &&
        isRequired(cancellationReason)
        // isRequired(dropoffCityId) &&
        // isRequired(dropoffAddress) &&
        // isNotEmptyArray(products) &&
      ) {
        if (isRequired(cancellationReason) && cancellationReason === "Other" && !isRequired(cancellationComment)) {
          return;
        }
        addRide(newRide);
      }
    }
  };

  const checkDropoffValidation = () => {
    if (
      isRequired(dropoffDate) &&
      isRequired(dropoffCityId) &&
      isRequired(dropOff) &&
      isRequired(dropoffAddress) &&
      isRequired(dropoffStatus) &&
      isRequired(outwardId) &&
      isRequired(currentLocation) &&
      isRequired(singleLocationLatlng) &&
      isRequired(pocNumber)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const triggerDropoffValidation = () => {
    setValidation({
      ...validation,
      dropoffCityId: true,
      dropoffCityId: true,
      singleLocationLatlng: true,
      dropoffAddress: true,
      dropoffStatus: true,
      pocName: true,
      pocNumber: true,
      outwardId: true,
      currentLocation: true,
      memo: true,
    });
  };

  const handleDropoffClick = async (idx) => {
    if (checkDropoffValidation()) {
      handleAddDropoff();
      setSelectedDropoffNumber(idx + 1);
      setDropoffs(removeDuplicateDropoff(dropoffs));
      if (typeof dropoffs[idx] === "object" && dropoffs[idx] !== null) {
        await resetDropoffState(dropoffs[idx]);
      } else if (selectedRide && selectedRide.RideDropoff[idx]) {
        await resetDropoffState(selectedRide.RideDropoff[idx]);
      } else {
        resetDropoffState(null);
        setValidation("");
      }
    } else {
      triggerDropoffValidation("");
    }
  };

  const handleDropoffPosition = async (idx) => {
    handleAddDropoff();
    setDropoffDialogState(!dropoffDialogState);
    setSelectedDropoffNumber(idx + 1);
  };

  const handleChangeDropoffClick = async (idx) => {
    setChangeDropoffDialogState(!changeDropoffDialogState);
    setSelectedDropoffNumber(idx + 1);
  };

  //open model only
  const handleRemoveDropoffClick = async (idx) => {
    setRemoveDropoffDialogState(!removeDropoffDialogState);
    // handleCancelDropoff(selectedDropoffNumber - 1);
  };

  const handleCancelDropoff = async (idx) => {
    const filteredDropoffCount = dropoffCount.filter((dp, index) => index !== selectedDropoffNumber - 1);
    setDropoffCount(filteredDropoffCount);
    if (typeof dropoffs[idx] === "object" && dropoffs[idx] !== null) {
      if (idx > -1) {
        dropoffs.splice(idx, 1);
        setDropoffs(dropoffs);
        setSelectedDropoffNumber(1);
        resetDropoffState(dropoffs[0]);
        setAddDropoffMessage({ message: `Dropoff ${idx + 1} has been removed!` });
      } else {
        setAddDropoffMessage({ message: "Incorrect dropoff selected!" });
      }
    } else {
      setSelectedDropoffNumber(1);
      resetDropoffState(dropoffs[0]);
      setAddDropoffMessage({ message: `Dropoff ${idx + 1} has been removed!` });
    }
  };

  const handleCustomerSearch = (vendorId, vendorName) => {
    setVendorId(vendorId);
    setSelectedVendorName(vendorName);
  };

  const resetDropoffState = async (currentDropoff) => {
    if (currentDropoff) {
      const addr = await reverseGeocoding(currentDropoff.location || currentDropoff.dropoffLocation);
      await setDropoffCityId(currentDropoff.cityId || currentDropoff.dropoffCityId);
      await setDropoffAddress(currentDropoff.address || currentDropoff.dropoffAddress);
      await setDropoffStatus(currentDropoff.status || currentDropoff.dropoffStatus);
      await setPOCName(currentDropoff.pocName);
      await setPOCNumber(currentDropoff.pocNumber);
      await setCurrentLocation(currentDropoff.currentLocation);
      await setOutwardId(currentDropoff.outwardId);
      await setDropoffDate(
        dateToPickerFormat(currentDropoff.dateTime) || dateToPickerFormat(currentDropoff.dropoffDate)
      );
      await setMemo(currentDropoff.memo);
      await setSingleLocationLatlng(currentDropoff.location || currentDropoff.dropoffLocation);
      // await setManifestImage(currentDropoff.manifestId);
      await setSingleLocationAddress(addr);
      setManifestImageSrc(getURL("preview", currentDropoff.manifestId));
    } else {
      setDropoffCityId(null);
      setDropoffAddress("");
      setDropoffStatus(DROPOFF_STATUS.DROPOFF_SCHEDULED);
      setPOCName("");
      setPOCNumber(null);
      setCurrentLocation("");
      setOutwardId(null);
      setDropoffDate(dateToPickerFormat(new Date()));
      setMemo("");
      setSingleLocationLatlng(null);
      // setManifestImage(null);
      setSingleLocationAddress("");
      setManifestImageSrc(null);
      setManifestImage(null);
    }
  };

  const removePreviewId = (event) => {
    setManifestImage(null);
    setManifestImageSrc(null);
    console.log("selectedDropoffNumber", selectedDropoffNumber);
    if (selectedRide && selectedRide.RideDropoff[selectedDropoffNumber - 1]) {
      console.log(":- preview debug 1");
      selectedRide.RideDropoff[selectedDropoffNumber - 1].manifestId = null;
    }
    if (dropoffs && dropoffs[selectedDropoffNumber - 1]) {
      console.log(":- preview debug 2");
      dropoffs[selectedDropoffNumber - 1].manifestId = null;
      setDropoffs(dropoffs);
    }
    console.log(":- preview remove dropoffs", dropoffs);
  };

  const removeEIRPreviewId = (event) => {
    setEIRImage(null);
    setEIRImageSrc(null);
    if (selectedRide) {
      selectedRide.eirId = null;
    }
  };

  const removeBuiltyPreviewId = (event) => {
    setBuiltyImage(null);
    setBuiltyImageSrc(null);
    if (selectedRide) {
      selectedRide.builtyId = null;
    }
  };

  const newManifestValidateLogoImage = async (event) => {
    const checkFile = event.target.files[0];
    setManifestType(false);
    setManifestSize(false);
    if (checkFile && !checkFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setManifestImage(null);
      setManifestType(true);
      return false;
    }
    const isLt2M = checkFile && checkFile.size / 1024 / 1024 < 1; // < 1mb
    if (checkFile && !isLt2M) {
      setManifestImage(null);
      setManifestSize(true);
      return false;
    }
    const reader = new FileReader();
    checkFile && reader.readAsDataURL(checkFile);
    reader.addEventListener("load", (event) => {
      const _loadedImageUrl = event.target.result;
      const image = document.createElement("img");
      image.src = _loadedImageUrl;
      image.addEventListener("load", async () => {
        setManifestImageSrc(_loadedImageUrl);
        const logoFile = checkFile ? checkFile : null;
        await setManifestImage(logoFile);
      });
    });
  };

  const newEIRValidateLogoImage = (event) => {
    const checkEIRFile = event.target.files[0];
    setEIRType(false);
    setEIRSize(false);
    if (checkEIRFile && !checkEIRFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setEIRImage(null);
      setEIRType(true);
      return false;
    }
    const isLtt2M = checkEIRFile && checkEIRFile.size / 1024 / 1024 < 1; // < 1mb
    if (checkEIRFile && !isLtt2M) {
      setEIRImage(null);
      setEIRSize(true);
      return false;
    }

    const readerEIR = new FileReader();
    checkEIRFile && readerEIR.readAsDataURL(checkEIRFile);
    readerEIR.addEventListener("load", (event) => {
      const _loadedEIRImageUrl = event.target.result;
      const imageEIR = document.createElement("img");
      imageEIR.src = _loadedEIRImageUrl;
      imageEIR.addEventListener("load", () => {
        setEIRImageSrc(_loadedEIRImageUrl);
        const eirFile = checkEIRFile ? checkEIRFile : null;
        setEIRImage(eirFile);
      });
    });
  };

  const newBuiltyValidateLogoImage = (event) => {
    const checkBuiltyFile = event.target.files[0];
    setBuiltyType(false);
    setBuiltySize(false);
    if (checkBuiltyFile && !checkBuiltyFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setBuiltyImage(null);
      setBuiltyType(true);
      return false;
    }
    const isLttt2M = checkBuiltyFile && checkBuiltyFile.size / 1024 / 1024 < 1; // < 1mb
    if (checkBuiltyFile && !isLttt2M) {
      setBuiltyImage(null);
      setBuiltySize(true);
      return false;
    }

    const readerBuilty = new FileReader();
    checkBuiltyFile && readerBuilty.readAsDataURL(checkBuiltyFile);
    readerBuilty.addEventListener("load", (event) => {
      const _loadedBuiltyImageUrl = event.target.result;
      const imageBuilty = document.createElement("img");
      imageBuilty.src = _loadedBuiltyImageUrl;
      imageBuilty.addEventListener("load", () => {
        setBuiltyImageSrc(_loadedBuiltyImageUrl);
        const builtyFile = checkBuiltyFile ? checkBuiltyFile : null;
        setBuiltyImage(builtyFile);
      });
    });
  };

  const getOutwards = () => {
    axios
      .get(getURL("ride/outward"))
      .then((res) => {
        // setProductOutwards(res.data.data);
        setInitialProductOutwards(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(getURL("ride/filtered-outwards"))
      .then((res) => {
        setProductOutwards(res.data.data);
        // setInitialProductOutwards(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {formErrors}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.pageHeading}>
              {!selectedRide ? "Create" : "Edit"} Load
            </Typography>
            {selectedRide && <Typography variant="p">Load ID: {digitize(selectedRide.id, 6)}</Typography>}
          </Grid>
          <Grid item xs={1}>
            <Link
              to={"/logistics/ride"} // providing state to clear the persists state filter of ride listing.
              // state={{ prevPath: location.pathname }}
            >
              <Button variant="contained" color="primary">
                Cancel
              </Button>
            </Link>
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
                  setCustomerId(newValue ? newValue.id : null);
                }}
              />
              {validation.customerId &&
              !isRequired(customerId) &&
              RIDE_COLUMNS_WITH_MANDATORY_STATUSES.customerId.includes(status) ? (
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
                options={Object.values(statuses)}
                defaultValue={!!selectedRide ? selectedRide.status : RIDE_STATUS.NOT_ASSIGNED}
                renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
                getOptionLabel={(status) => status || ""}
                onBlur={(e) => {
                  setValidation({ ...validation, status: true });
                  setStatus(status ? status : RIDE_STATUS.NOT_ASSIGNED);
                }}
                onChange={(event, newValue) => {
                  setStatus(newValue ? newValue : null);
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
        {RIDE_COLUMNS_WITH_MANDATORY_STATUSES.cancellationReason.includes(status) ? (
          <Grid container item xs={12} spacing={3}>
            <Grid item sm={6}>
              <FormControl margin="dense" fullWidth={true} variant="outlined">
                <Autocomplete
                  id="cancellationReason"
                  key={cancellationReasons}
                  options={Object.values(cancellationReasons)}
                  defaultValue={
                    !!selectedRide && selectedRide.cancellationReason ? selectedRide.cancellationReason : ""
                  }
                  renderInput={(params) => <TextField {...params} label="Cancellation Reason" variant="outlined" />}
                  getOptionLabel={(reason) => reason || ""}
                  onBlur={(e) => setValidation({ ...validation, cancellationReason: true })}
                  onChange={(event, newValue) => {
                    setCancellationReason(newValue);
                  }}
                />
                {validation.cancellationReason &&
                !isRequired(cancellationReason) &&
                RIDE_COLUMNS_WITH_MANDATORY_STATUSES.cancellationReason.includes(status) ? (
                  <Typography color="error">Cancellation reason is required!</Typography>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item sm={6}>
              <TextField
                // InputProps={{ inputProps: { maxLength: 1000 }, className: classes.textBox }}
                className={classes.labelBox}
                fullWidth={true}
                margin="dense"
                id="cancellationComment"
                label="Cancellation comment (Max 1000 characters)"
                type="text"
                variant="outlined"
                value={cancellationComment}
                InputProps={{ inputProps: { maxLength: 1000 }, className: classes.commentBox }}
                onChange={(e) => setCancellationComment(e.target.value)}
              />
              {validation.cancellationReason && isRequired(cancellationReason) && cancellationReason == "Other" ? (
                <Typography color="error">Cancellation Comment is required!</Typography>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        ) : (
          ""
        )}

        <Grid container item xs={12} spacing={3} style={{ marginBottom: -30 }}>
          <Grid item sm={6} style={{ paddingTop: 4 }}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="carId"
                key={vehicleType}
                options={vehicleType}
                defaultValue={
                  !!selectedRide && selectedRide.Vehicle
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
                  setCarId(newValue ? newValue.carId : null);
                }}
              />
              {validation.carId && !isRequired(carId) && RIDE_COLUMNS_WITH_MANDATORY_STATUSES.carId.includes(status) ? (
                <Typography color="error">Vehicle Type is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <Autocomplete
              id="vendorId"
              options={vendors}
              defaultValue={
                selectedRide && selectedRide.Vehicle ? { name: selectedRide.Vehicle.Vendor.name, id: vendorId } : ""
              }
              getOptionLabel={(vendor) => {
                return vendor && vendor.name ? vendor.name : vendor.Vendor ? vendor.Vendor.name : "";
              }}
              onChange={(event, newValue) => {
                setVendorId(newValue ? newValue.companyId : null);
                if (newValue) handleCustomerSearch(newValue.companyId, newValue.name || "");
              }}
              renderInput={(params) => <TextField {...params} label="Vendor" variant="outlined" />}
              onBlur={(e) => setValidation({ ...validation, vendorId: true })}
            />
            {validation.vendorId &&
            !isRequired(vendorId) &&
            RIDE_COLUMNS_WITH_MANDATORY_STATUSES.vendorId.includes(status) ? (
              <Typography color="error">Vendor is required!</Typography>
            ) : (
              <Typography color="error" style={{ visibility: "hidden" }}>
                Dummy
              </Typography>
            )}
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
                defaultValue={
                  !!selectedRide && selectedRide.Vehicle
                    ? { registrationNumber: selectedRide.Vehicle.registrationNumber, id: selectedRide.Vehicle.id }
                    : ""
                }
                renderInput={(params) => <TextField {...params} label="Vehicle" variant="outlined" />}
                // getOptionLabel={(vehicle) => vehicle.registrationNumber || ""}
                getOptionLabel={(vehicle) => {
                  return vehicle && vehicle.registrationNumber
                    ? vehicle.registrationNumber
                    : vehicle.Vehicle
                    ? vehicle.Vehicle.registrationNumber
                    : "";
                }}
                onBlur={(e) => setValidation({ ...validation, status: true })}
                onChange={(event, newValue) => {
                  setVehicleId(newValue ? newValue.id : null);
                }}
              />
              {validation.vehicleId &&
              !isRequired(vehicleId) &&
              RIDE_COLUMNS_WITH_MANDATORY_STATUSES.vendorId.includes(status) ? (
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
                key={drivers}
                options={drivers}
                defaultValue={
                  !!selectedRide && selectedRide.Driver
                    ? { name: selectedRide.Driver.name, id: selectedRide.Driver.id }
                    : ""
                }
                renderInput={(params) => <TextField {...params} label="Driver" variant="outlined" />}
                // getOptionLabel={(driver) => driver.name || ""}
                getOptionLabel={(driver) => {
                  return driver && driver.name ? driver.name : driver.Driver ? driver.Driver.name : "";
                }}
                onBlur={(e) => setValidation({ ...validation, driverId: true })}
                onChange={(event, newValue) => {
                  setDriverId(newValue ? newValue.id : null);
                }}
              />

              {validation.driverId &&
              !isRequired(driverId) &&
              RIDE_COLUMNS_WITH_MANDATORY_STATUSES.driverId.includes(status) ? (
                <Typography color="error">Driver is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
        </Grid>
        {/* MAP */}
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Pickup
            </Typography>
          </Grid>
          <Grid
            item
            sm={12}
            className={classes.locationMap}
            style={{ position: "relative", minHeight: 350, marginBottom: 30, maxWidth: "98%" }}
          >
            <GoogleMap
              // setDropOff={setDropOff}
              setPickUp={setPickUp}
              pickupLocation={selectedRide && selectedRide.pickupLocation ? selectedRide.pickupLocation : "hello"}
              // dropoffLocation={selectedRide && selectedRide.dropoffLocation ? selectedRide.dropoffLocation : ""}
              showMapSearchFields={false}
              setPickupAddress={setPickupAddress}
              // setDropoffAddress={setDropoffAddress}
              showPickupOnly={true}
            />
          </Grid>
        </Grid>

        <Grid container item xs={12} spacing={1}>
          <Grid item sm={4}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Autocomplete
                id="cities"
                key={[cities]}
                options={cities}
                defaultValue={!!selectedRide && selectedRide.pickupCity ? selectedRide.pickupCity : ""}
                renderInput={(params) => <TextField {...params} label="Pickup City" variant="outlined" />}
                getOptionLabel={(city) => city.name || ""}
                onBlur={(e) => setValidation({ ...validation, pickupCityId: true })}
                onChange={(event, newValue) => {
                  setPickupCityId(newValue ? newValue.id : null);
                }}
              />
              {validation.pickupCityId &&
              !isRequired(pickupCityId) &&
              RIDE_COLUMNS_WITH_MANDATORY_STATUSES.pickupCityId.includes(status) ? (
                <Typography color="error">Pickup City is required!</Typography>
              ) : (
                ""
              )}
            </FormControl>
          </Grid>
          <Grid item sm={4}>
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
            {validation.pickupAddress &&
            !isRequired(pickupAddress) &&
            RIDE_COLUMNS_WITH_MANDATORY_STATUSES.pickupAddress.includes(status) ? (
              <Typography color="error">Pickup address is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item sm={4}>
            <TextField
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
            {validation.pickupDate &&
            !isValidDate(pickupDate) &&
            RIDE_COLUMNS_WITH_MANDATORY_STATUSES.pickupDate.includes(status) ? (
              <Typography color="error">Pickup date is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} style={{ marginTop: 15 }}></Grid>
          {/* Dropoffs */}
          {flag || !selectedRide ? (
            <Grid container item xs={12} spacing={1}>
              {/* Dropoff number buttons */}
              <Grid item xs={12}>
                <Typography variant="h5" className={classes.pageSubHeading}>
                  Drop-off
                </Typography>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid container item xs={12} justifyContent="center" alignItems="center">
                <Grid
                  item
                  sm={12}
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  style={{ gridRowGap: "10px" }}
                >
                  {
                    // add + 1 because index starts from 0
                    dropoffCount.map((dropoff, idx) => {
                      return (
                        <ButtonGroup size="small" aria-label="large outlined primary button group" key={idx}>
                          <Button
                            variant="contained"
                            value={idx}
                            onClick={() => {
                              handleDropoffClick(idx);
                            }}
                            style={{
                              borderBottom: selectedDropoffNumber === idx + 1 ? "2px solid black" : "none",
                              fontWeight: "normal",
                              backgroundColor: "white",
                            }}
                            // startIcon={dropoffs[idx] ? <AddSharpIcon /> : " "}
                          >
                            Dropoff {idx + 1}
                          </Button>
                          {idx + 1 > 1 || dropoffCount.length > 1 ? (
                            <>
                              <IconButton></IconButton>
                            </>
                          ) : (
                            <IconButton></IconButton>
                          )}
                        </ButtonGroup>
                      );
                    })
                  }
                  <Tooltip title="Add Dropoff">
                    <IconButton
                      onClick={() => {
                        handleAddDropoff();
                        if (checkDropoffValidation()) {
                          setDropoffCount([...dropoffCount, dropoffCount.length + 1]);
                          setSelectedDropoffNumber(dropoffCount.length + 1);
                          resetDropoffState(dropoffs[dropoffCount.length + 1]);
                          setValidation("");
                        }
                        if (selectedRide && selectedRide.RideDropoff.length > 0) {
                          setProductOutwards(
                            removeItemFromArrayIfExistInAnotherArray(productOutwards, selectedRide.RideDropoff)
                          );
                        }
                      }}
                    >
                      <ControlPointIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <>
                  <MoveDropoffDialog
                    dropoffDialogState={dropoffDialogState}
                    setDropoffDialogState={setDropoffDialogState}
                    idx={selectedDropoffNumber - 1}
                    setDropoffs={setDropoffs}
                    dropoffs={dropoffs}
                    setSelectedDropoffNumber={setSelectedDropoffNumber}
                    handleDropoffClick={handleDropoffClick}
                    setShowConfirmMessage={setShowConfirmMessage}
                    resetDropoffState={resetDropoffState}
                  />
                  <ChangeRideDropoffDialog
                    changeDropoffDialogState={changeDropoffDialogState}
                    setChangeDropoffDialogState={setChangeDropoffDialogState}
                    idx={selectedDropoffNumber - 1}
                    setDropoffs={setDropoffs}
                    dropoffs={dropoffs}
                    setSelectedDropoffNumber={setSelectedDropoffNumber}
                    handleChangeDropoffClick={handleChangeDropoffClick}
                    setShowChangeConfirmMessage={setShowChangeConfirmMessage}
                  />
                  <DeleteDropoffDialog
                    removeDropoffDialogState={removeDropoffDialogState}
                    setRemoveDropoffDialogState={setRemoveDropoffDialogState}
                    idx={selectedDropoffNumber - 1}
                    setDropoffs={setDropoffs}
                    dropoffs={dropoffs}
                    setSelectedDropoffNumber={setSelectedDropoffNumber}
                    handleCancelDropoff={handleCancelDropoff}
                    // key={4}
                    // confirmDelete={handleCancelDropoff}
                    // open={setRemoveDropoffDialogState}
                    // handleClose={closeThisModel}
                    // title={"ProductOutward"}
                    // setShowChangeConfirmMessage={setShowChangeConfirmMessage}
                  />
                </>
              </Grid>
              <Grid container item xs={12} spacing={1} style={{ boxSizing: "border-box" }}>
                {dropoffCount.length > 1 ? (
                  <Grid container item xs={12} spacing={1}>
                    <Grid item xs={1} container justifyContent="center">
                      <Tooltip title="Remove">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            handleRemoveDropoffClick();
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1} container justifyContent="center">
                      <Tooltip title="Re-position">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            handleDropoffPosition(selectedDropoffNumber - 1);
                          }}
                        >
                          <ControlCameraIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
              <Grid
                container
                item
                xs={4}
                spacing={1}
                style={{ position: "relative", maxHeight: 455, marginBottom: 30, maxWidth: "98%" }}
              >
                <Grid item sm={12}>
                  <DropoffGoogleMap
                    setSingleLocationLatlng={setSingleLocationLatlng}
                    singleLocationLatlng={singleLocationLatlng}
                    showSingleSearchField={true}
                    setSingleLocationAddress={setSingleLocationAddress}
                    singleLocationAddress={singleLocationAddress}
                    setDropoffAddress={setDropoffAddress}
                    checkValidation={
                      validation.singleLocationLatlng && !isRequired(singleLocationLatlng) ? true : false
                    }
                  />
                  {validation.singleLocationLatlng && !isRequired(singleLocationLatlng) ? (
                    <Typography color="error">Dropoff Location is required!</Typography>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              <Grid container item xs={8} spacing={1} style={{ boxSizing: "border-box", paddingLeft: 30 }}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="dropoffStatus"
                      key={selectedDropoffNumber}
                      options={Object.values(dropoffStatuses)}
                      defaultValue={
                        dropoffs &&
                        dropoffs[selectedDropoffNumber - 1] &&
                        dropoffs[selectedDropoffNumber - 1].dropoffStatus
                          ? dropoffs[selectedDropoffNumber - 1].dropoffStatus
                          : DROPOFF_STATUS.DROPOFF_SCHEDULED
                      }
                      renderInput={(params) => <TextField {...params} label="Dropoff Status" variant="outlined" />}
                      getOptionLabel={(status) => {
                        return status || "";
                      }}
                      onBlur={(e) => {
                        setValidation({ ...validation, dropoffStatus: true });
                        setDropoffStatus(dropoffStatus ? dropoffStatus : DROPOFF_STATUS.DROPOFF_SCHEDULED);
                      }}
                      onChange={(event, newValue) => {
                        setDropoffStatus(newValue ? newValue : DROPOFF_STATUS.DROPOFF_SCHEDULED);
                      }}
                    />
                    {validation.dropoffStatus && !isRequired(dropoffStatus) ? (
                      <Typography color="error">Status is required!</Typography>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="outwards"
                      key={outwardId}
                      options={productOutwards}
                      defaultValue={
                        !!outwardId
                          ? initialProductOutwards.find((po) => po.id === outwardId)
                          : { internalIdForBusiness: "" }
                      }
                      renderInput={(params) => <TextField {...params} label="Outwards" variant="outlined" />}
                      getOptionLabel={(productOutward) => {
                        return productOutward.internalIdForBusiness ? `${productOutward.internalIdForBusiness}` : "";
                      }}
                      onChange={(event, newValue) => {
                        if (newValue.id) {
                          setOutwardId(newValue.id);
                          setProductOutwards(removeItemFromArrayIfExistInAnotherArray(productOutwards, dropoffs));
                        }
                      }}
                    />
                    {validation.outwardId && !isRequired(outwardId) ? (
                      <Typography color="error">Outward is required!</Typography>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={4}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <Autocomplete
                      id="dropoffCityId"
                      key={dropoffCityId}
                      options={cities}
                      defaultValue={!!dropoffCityId ? cities.find((city) => city.id === dropoffCityId) : { name: "" }}
                      renderInput={(params) => <TextField {...params} label="Dropoff City" variant="outlined" />}
                      getOptionLabel={(city) => {
                        return city.name || "";
                      }}
                      onBlur={(e) => setValidation({ ...validation, dropoffCityId: true })}
                      onChange={(event, newValue) => {
                        setDropoffCityId(newValue ? newValue.id : null);
                      }}
                    />
                    {validation.dropoffCityId && !isRequired(dropoffCityId) ? (
                      <Typography color="error">Dropoff City is required!</Typography>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={4}>
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
                <Grid item sm={4}>
                  <TextField
                    inputProps={{ className: classes.pocBox }}
                    className={classes.labelBox}
                    fullWidth
                    margin="dense"
                    id="pocName"
                    label="POC Name"
                    variant="outlined"
                    value={pocName}
                    onChange={(e) => {
                      const regex = /^[a-zA-Z]*$/;
                      if (regex.test(e.target.value)) {
                        setPOCName(e.target.value);
                      }
                    }}
                    onBlur={(e) => setValidation({ ...validation, pocName: true })}
                  />
                  {validation.pocName && !isRequired(pocName) ? (
                    <Typography color="error">POC Name is required!</Typography>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item sm={4} style={{ boxSizing: "border-box", paddingRight: 30 }}>
                  <MaskedInput
                    className={clsx({ ["mask-text"]: true }, { ["mask-text:focus"]: true })}
                    variant="outlined"
                    name="pocNumber"
                    mask={phoneNumberMask}
                    label="POC Number(e.g 032*-*******)"
                    id="pocNumber"
                    type="text"
                    value={pocNumber}
                    placeholder="POC Number(e.g 032*-*******)"
                    onChange={(e) => {
                      setPOCNumber(e.target.value);
                    }}
                    style={{
                      height: "17%",
                      width: "97%",
                      marginLeft: 0,
                      marginTop: 6,
                      borderColor: "#c4c4c4",
                      color: "#2f2727",
                      fontWeight: 600,
                    }}
                    // style={{ padding: '21px 26px',marginTop: '8px',marginLeft: '8px', color: 'black', borderColor: 'rgba(0,0,0,0.3)' }}
                    onBlur={(e) => setValidation({ ...validation, pocNumber: true })}
                  />
                  {validation.pocNumber && isRequired(pocNumber) && !isPhone(pocNumber.replace(/-/g, "")) ? (
                    <Typography color="error">Incorrect phone number!</Typography>
                  ) : (
                    ""
                  )}
                  {validation.pocNumber && !isRequired(pocNumber) ? (
                    <Typography color="error">POC Number is required!</Typography>
                  ) : (
                    <Typography color="error" style={{ visibility: "hidden" }}>
                      Dummy
                    </Typography>
                  )}
                </Grid>
                <Grid item sm={4}>
                  <TextField
                    inputProps={{ className: classes.textBox }}
                    className={classes.labelBox}
                    fullWidth={true}
                    margin="dense"
                    id="currentLocation"
                    label="Current Location"
                    variant="outlined"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    onBlur={(e) => setValidation({ ...validation, currentLocation: true })}
                  />
                  {validation.currentLocation && !isRequired(currentLocation) ? (
                    <Typography color="error">Current Location is required!</Typography>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item sm={4}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="dropoffDate"
                    label="Dropoff Date & Time"
                    inputProps={{ min: pickupDate, className: classes.dateBox }}
                    placeholder="Dropoff Date & Time"
                    type="datetime-local"
                    variant="outlined"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(dateToPickerFormat(e.target.value))}
                    onBlur={(e) => setValidation({ ...validation, dropoffDate: true })}
                  />
                  {validation.dropoffDate && !isValidDate(dropoffDate) ? (
                    <Typography color="error">Dropoff date is required!</Typography>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item sm={12}>
                  <TextField
                    multiline
                    fullWidth={true}
                    margin="dense"
                    rows={6}
                    id="memo"
                    label="Memo for driver"
                    type="text"
                    variant="outlined"
                    InputProps={{ inputProps: { maxLength: 1000 }, className: classes.memoBox }}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                  {validation.memo && !isRequired(memo) ? (
                    <Typography style={{ color: "#1d1d1d", fontSize: 12 }}>Max Length (1000 characters)</Typography>
                  ) : (
                    ""
                  )}
                </Grid>
                {/* <Grid container item sm={12}>
                  <Grid item xs={!!manifestImageSrc ? 11 : 12}>
                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                      <Button
                        variant="contained"
                        component="label"
                        color={
                          (selectedRide &&
                            selectedRide.RideDropoff &&
                            selectedRide.RideDropoff[selectedDropoffNumber - 1] &&
                            selectedRide.RideDropoff[selectedDropoffNumber - 1].manifestId) ||
                          manifestImage
                            ? "primary"
                            : "default"
                        }
                        startIcon={<CloudUploadIcon />}
                      >
                        Product Manifest{" "}
                        {(selectedRide &&
                          selectedRide.RideDropoff &&
                          selectedRide.RideDropoff[selectedDropoffNumber - 1] &&
                          selectedRide.RideDropoff[selectedDropoffNumber - 1].manifestId) ||
                        manifestImage
                          ? "Uploaded"
                          : ""}
                        <input
                          type="file"
                          hidden
                          value={(e) => e.target.value + 3}
                          onChange={async (e) => {
                            await newManifestValidateLogoImage(e);
                          }}
                          accept=".jpg,.png,.jpeg"
                        />
                      </Button>
                      {manifestSize == true ? (
                        <Typography color="error">Manifest size should be less than 1 MB</Typography>
                      ) : (
                        ""
                      )}
                      {manifestType == true ? (
                        <Typography color="error">Manifest image accepted formats are .jpg, .jpeg or .png</Typography>
                      ) : (
                        ""
                      )}
                    </FormControl>
                  </Grid>
                  {!manifestImageSrc ? (
                    ""
                  ) : (
                    <Grid container item xs={1} justifyContent="center" alignItems="center">
                      <DeleteSharpIcon onClick={() => removePreviewId()} style={{ cursor: "pointer" }} />
                    </Grid>
                  )}

                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    {manifestImageSrc ? <img id="previewImage" src={manifestImageSrc} /> : null}
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {/* <MessageSnackbar showMessage={addDropoffMessage} /> */}
          {/* {showConfirmMessage ? <MessageSnackbar showMessage={`Dropoff has been moved`} /> : null} */}
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
            {validation.price && !isRequired(price) && RIDE_COLUMNS_WITH_MANDATORY_STATUSES.price.includes(status) ? (
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
            {validation.cost && !isRequired(cost) && RIDE_COLUMNS_WITH_MANDATORY_STATUSES.cost.includes(status) ? (
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
            />
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
              // onBlur={(e) => setValidation({ ...validation, driverIncentive: true })}
            />
          </Grid>
        </Grid>

        {/* Memo Addition Starts */}
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Other Details
            </Typography>
          </Grid>
        </Grid>

        <Grid container item xs={12} spacing={3} style={{ paddingBottom: 0 }}></Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item sm={6}>
            <TextField
              inputProps={{ className: classes.textBox }}
              className={classes.labelBox}
              fullWidth={true}
              margin="dense"
              id="eta"
              label="ETA (minutes)"
              type="number"
              variant="outlined"
              value={!!eta && eta}
              onChange={(e) => setETA(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={(e) => setValidation({ ...validation, eta: true })}
            />
            {validation.eta && !isRequired(eta) && RIDE_COLUMNS_WITH_MANDATORY_STATUSES.eta.includes(status) ? (
              <Typography color="error">ETA is required!</Typography>
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
              id="completionTime"
              label="Trip Completion Time (minutes)"
              type="number"
              variant="outlined"
              value={!!completionTime && completionTime}
              onChange={(e) => {
                setCompletionTime(e.target.value < 0 ? e.target.value == 0 : e.target.value);
              }}
              onBlur={(e) => setValidation({ ...validation, completionTime: true })}
            />
            {validation.completionTime &&
            !isRequired(completionTime) &&
            RIDE_COLUMNS_WITH_MANDATORY_STATUSES.completionTime.includes(status) ? (
              <Typography color="error">Trip Completion Time is required!</Typography>
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
              id="weightCargo"
              label="Weight of Cargo (Kg)"
              placeholder="Weight of Cargo (Kg)"
              type="number"
              variant="outlined"
              value={!!weightCargo && weightCargo}
              minuteStep={15}
              onChange={(e) => setWeightCargo(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
              onBlur={(e) => setValidation({ ...validation, weightCargo: true })}
            />
            {validation.weightCargo &&
            !isRequired(weightCargo) &&
            RIDE_COLUMNS_WITH_MANDATORY_STATUSES.weightCargo.includes(status) ? (
              <Typography color="error">Weight Of Cargo is required!</Typography>
            ) : (
              ""
            )}
          </Grid>
        </Grid>

        <Grid container item xs={12} spacing={3}></Grid>

        {/* Memo Addition Ends */}
        <Grid container item xs={12} spacing={3}>
          <Grid container item xs={12} spacing={3}></Grid>

          <Grid container item xs={12} spacing={3}></Grid>

          {/* Builty EIR Addition Starts */}

          {/* <Grid container item xs={12} spacing={3}> */}
          <Grid container item xs={12} spacing={3}>
            <Grid container item sm={12}>
              <Grid item xs={!!eirImageSrc ? 11 : 12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Button
                    variant="contained"
                    component="label"
                    color={(selectedRide && selectedRide.eirId) || eirImage ? "primary" : "default"}
                    startIcon={<CloudUploadIcon />}
                  >
                    EIR {(selectedRide && selectedRide.eirId) || eirImage ? "Uploaded" : ""}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        newEIRValidateLogoImage(e);
                      }}
                      onBlur={(e) => setValidation({ ...validation, eirImage: true })}
                      accept=".jpg,.png,.jpeg"
                    />
                  </Button>
                  {eirSize == true ? <Typography color="error">EIR size should be less than 1 MB</Typography> : ""}
                  {eirType == true ? (
                    <Typography color="error">EIR image accepted formats are .jpg, .jpeg or .png</Typography>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>

              {!eirImageSrc ? (
                ""
              ) : (
                <Grid item xs={1} style={{ marginTop: 15, textAlign: "center" }}>
                  <DeleteSharpIcon onClick={() => removeEIRPreviewId()} />
                </Grid>
              )}
              <Grid item xs={12} style={{ textAlign: "center" }}>
                {eirImageSrc ? <img id="previewImage" src={eirImageSrc} /> : null}
              </Grid>
            </Grid>
            <Grid container item sm={12}>
              <Grid item xs={!!builtyImageSrc ? 11 : 12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Button
                    variant="contained"
                    component="label"
                    color={(selectedRide && selectedRide.builtyId) || builtyImage ? "primary" : "default"}
                    startIcon={<CloudUploadIcon />}
                  >
                    Builty Recieving {(selectedRide && selectedRide.builtyId) || builtyImage ? "Uploaded" : ""}
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        newBuiltyValidateLogoImage(e);
                      }}
                      onBlur={(e) => setValidation({ ...validation, builtyImage: true })}
                      accept=".jpg,.png,.jpeg"
                    />
                  </Button>
                  {builtySize == true ? (
                    <Typography color="error">Builty size should be less than 1 MB</Typography>
                  ) : (
                    ""
                  )}
                  {builtyType == true ? (
                    <Typography color="error">Builty image accepted formats are .jpg, .jpeg or .png</Typography>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
              {!builtyImageSrc ? (
                ""
              ) : (
                <Grid item xs={1} style={{ marginTop: 15, textAlign: "center" }}>
                  <DeleteSharpIcon onClick={() => removeBuiltyPreviewId()} style={{ cursor: "pointer" }} />
                </Grid>
              )}

              <Grid item xs={12} style={{ textAlign: "center" }}>
                {builtyImageSrc ? <img id="previewImage" src={builtyImageSrc} /> : null}
              </Grid>
            </Grid>
          </Grid>
          {/* </Grid> */}

          {/* Builty EIR Ends  */}
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={3}>
            <FormControl margin="dense" fullWidth={true} variant="outlined">
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {!selectedRide ? "Add Load" : "Update Load"}
              </Button>
              {validation.status && !isRequired(status) ? (
                <Typography color="error">Please select a status</Typography>
              ) : (
                ""
              )}
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
