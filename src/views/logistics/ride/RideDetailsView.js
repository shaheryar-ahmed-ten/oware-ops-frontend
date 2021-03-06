import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tab,
} from "@material-ui/core";
// import Tab from '@material-ui/core';
import { TabContext, TabPanel, TabList } from "@material-ui/lab";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { dateFormat, getURL } from "../../../utils/common";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";
import { Map, GoogleApiWrapper } from "google-maps-react";
import GoogleMap from "../../../components/GoogleMap.js";
import Geocode from "react-geocode";
import owareLogo from "../../../assets/icons/oware-logo-black.png";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("pk");
Geocode.enableDebug();
const useStyles = makeStyles((theme) => ({
  parentContainer: {
    // boxSizing: "border-box",
    padding: "30px 30px",
  },
  pageHeading: {
    fontWeight: 700,
  },
  pageSubHeading: {
    fontWeight: 700,
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
  tableRow: {
    "&:last-child th, &:last-child td": {
      borderBottom: 0,
    },
  },
  locationMap: {
    width: "100%",
    height: "100%",
    // marginTop: 17,
    color: "white",
    display: "flex",
    flexFlow: "column",
  },
  root: {
    boxSizing: "border-box",
    padding: "40px 0",
    backgroundColor: "rgba(299,299,299,1)",
    position: "relative",
  },
}));

function RideDetailsView(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedRide, setSelectedRide] = useState(null);
  const [productManifestPreview, setProductManifestPreview] = useState("");
  const [mapPickupAddress, setMapPickupAddress] = useState("");
  const [mapDropoffAddress, setMapDropoffAddress] = useState("");

  const { uid } = useParams();

  useEffect(() => {
    if (!selectedRide) {
      fetchSelectedRide();
    }
  }, [uid]);

  const fetchSelectedRide = () => {
    _getSelectedRide();
  };
  const _getSelectedRide = async () => {
    axios.get(getURL(`ride/${uid}`)).then((res) => {
      setSelectedRide(res.data.data);
      const { pickupLocation, dropoffLocation } = res.data.data;
      if (pickupLocation && pickupLocation.lat && dropoffLocation) {
        Geocode.fromLatLng(pickupLocation.lat, pickupLocation.lng)
          .then((addresses) => addresses.results[0].formatted_address)
          .then((result) => {
            setMapPickupAddress(result);
          });
        Geocode.fromLatLng(dropoffLocation.lat, dropoffLocation.lng)
          .then((addresses) => addresses.results[0].formatted_address)
          .then((result) => {
            setMapDropoffAddress(result);
          });
      }
    });
    axios
      .get(getURL(`ride/preview/7`))
      .then((res) => {
        setProductManifestPreview(res.data.preview);
      })
      .catch((err) => {
        console.info(err);
      });
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const mapStyles = {
    width: "50%",
    height: "50%",
  };

  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return selectedRide ? (
    <>
      {/* Only for printing */}
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box style={{ padding: "25mm 15mm" }}>
          <Grid container item xs={12} justifyContent="space-between">
            <Grid item xs={12}>
              <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
              <Typography variant="h3" className={classes.heading}>
                Load Details
              </Typography>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                COMPANY & VEHICLE
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Company :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Customer.name || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Status :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.status || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Vendor :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Driver && selectedRide.Driver.Vendor ? selectedRide.Driver.Vendor.name : "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Vehicle Type :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Vehicle
                  ? selectedRide.Vehicle.Car.CarMake.name + " " + selectedRide.Vehicle.Car.CarModel.name
                  : "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Vehicle :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Vehicle ? selectedRide.Vehicle.registrationNumber : "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Driver :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Driver ? selectedRide.Driver.name : "-"}
              </Grid>
            </Grid>
          </Grid>

          {selectedRide.status === "Cancelled" ? (
            <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
              <Grid container spacing={2}>
                <Grid style={{ fontWeight: 500 }} item xs={3}>
                  Cancellation Reason :
                </Grid>
                <Grid item xs={3} style={{ fontStyle: "italic" }}>
                  {selectedRide.cancellationReason ? selectedRide.cancellationReason : "-"}
                </Grid>
                <Grid style={{ fontWeight: 500 }} item xs={3}></Grid>
                <Grid item xs={3} style={{ fontStyle: "italic" }}></Grid>

                <Grid style={{ fontWeight: 500 }} item xs={3}>
                  Cancellation Comment :
                </Grid>
                <Grid item xs={9} style={{ fontStyle: "italic" }}>
                  {selectedRide.cancellationComment ? selectedRide.cancellationComment : "-"}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            ""
          )}

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                PICKUP
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                PickupCity :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.pickupCity ? selectedRide.pickupCity.name : "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                PickupAddress :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.pickupAddress ? selectedRide.pickupAddress : "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                PickupDate :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.pickupDate ? dateFormat(selectedRide.pickupDate) : "-"}
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                COST & PRICE
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              {/* <Grid style={{ fontWeight: 500 }} item xs={4}>
                Customer Price (Rs.) :
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.price || "-"}
              </Grid> */}
              <Grid style={{ fontWeight: 500 }} item xs={4}>
                Vendor Cost (Rs.) :
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.cost || "-"}
              </Grid>
              {/* <Grid style={{ fontWeight: 500 }} item xs={4}>
                Customer Discount (Rs.) :
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.customerDiscount || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={4}>
                Driver Incentive (Rs.) :
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.driverIncentive || "-"}
              </Grid> */}
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                OTHER DETAILS
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid style={{ fontWeight: 500 }} item xs={4}>
                ETA(Minutes):
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {Math.floor(selectedRide.eta / 60) || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={4}>
                Trip Completion Time(Minutes):
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {Math.floor(selectedRide.completionTime / 60) || "-"}
              </Grid>

              <Grid style={{ fontWeight: 500 }} item xs={4}>
                Weight of Cargo(Kg):
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.weightCargo || "-"}
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                DROPOFF
              </Typography>
            </Grid>
            <Grid container style={{ display: "block" }}>
              {selectedRide.RideDropoff.map((dropoff, index) => {
                return (
                  <>
                    <Grid container style={{ display: "inline-block" }}>
                      <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
                        <Typography variant="h6" className={classes.pageSubHeading}>
                          {index > -1 ? `DROPOFF ${index + 1}` : `DROPOFF ${index + 1}`}
                        </Typography>
                      </Grid>
                      {/* <Grid container item xs={12} spacing={2}> */}
                      <Grid container item xs={12} spacing={2}>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Dropoff Status:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.status ? dropoff.status : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Outward ID:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.ProductOutward ? dropoff.ProductOutward.internalIdForBusiness : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Dropoff City:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.DropoffCity ? dropoff.DropoffCity.name : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Dropoff Address:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.address ? dropoff.address : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Dropoff Date:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.dateTime ? dateFormat(dropoff.dateTime) : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          POC Name:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.pocName || "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          POC Number:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.pocNumber ? dropoff.pocNumber : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Current Location:
                        </Grid>
                        <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.currentLocation ? dropoff.currentLocation : "-"}
                        </Grid>
                        <Grid style={{ fontWeight: 500 }} item xs={4}>
                          Memo :
                        </Grid>
                        <Grid item xs={8} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                          {dropoff.memo ? dropoff.memo : "-"}
                        </Grid>
                        {/* </Grid> */}
                      </Grid>

                      {/* </Grid> */}
                      {/* </Grid> */}
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Only for Displaying */}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Load Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/logistics/load")}>
              Back
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
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>COMPANY</TableCell>
                <TableCell className={classes.tableHeadText}>STATUS</TableCell>
                <TableCell className={classes.tableHeadText}>VENDOR</TableCell>
                <TableCell className={classes.tableHeadText}>VEHICLE TYPE</TableCell>
                <TableCell className={classes.tableHeadText}>VEHICLE</TableCell>
                <TableCell className={classes.tableHeadText}>DRIVER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedRide.Customer.name || "-"}</TableCell>
                <TableCell>{selectedRide.status || "-"}</TableCell>
                <TableCell>{selectedRide.Driver ? selectedRide.Driver.Vendor.name : "-"}</TableCell>
                <TableCell>
                  {selectedRide.Vehicle
                    ? selectedRide.Vehicle.Car.CarMake.name + " " + selectedRide.Vehicle.Car.CarModel.name
                    : "-"}
                </TableCell>
                <TableCell>{selectedRide.Vehicle ? selectedRide.Vehicle.registrationNumber : "-"}</TableCell>
                <TableCell>{selectedRide.Driver ? selectedRide.Driver.name : "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {selectedRide.status === "Cancelled" ? (
          <TableContainer className={classes.parentContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadText} style={{ width: "20%" }}>
                    CANCELLATION REASON
                  </TableCell>
                  <TableCell className={classes.tableHeadText}>CANCELLATION COMMENT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.tableRow} className={classes.tableRow}>
                  <TableCell>{selectedRide.cancellationReason || "-"}</TableCell>
                  <TableCell>{selectedRide.cancellationComment || "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ""
        )}

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Pickup
            </Typography>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>PICKUP CITY</TableCell>
                <TableCell className={classes.tableHeadText}>PICKUP ADDRESS</TableCell>
                <TableCell className={classes.tableHeadText}>PICKUP DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedRide.pickupCity.name || "-"}</TableCell>
                <TableCell>{selectedRide.pickupAddress || "-"}</TableCell>
                <TableCell>{dateFormat(selectedRide.pickupDate) || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {selectedRide.pickupLocation ? (
          <Grid item sm={12}>
            <Grid item sm={12} className={classes.locationMap} style={{ position: "relative", minHeight: 300 }}>
              <GoogleMap
                editable={false}
                showSingleSearchField={false}
                singleLocationLatlng={selectedRide.pickupLocation}
                showMapSearchFields={false}
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}

        {/* </Grid> */}

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Cost & Price
            </Typography>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>CUSTOMER PRICE (Rs.)</TableCell>
                <TableCell className={classes.tableHeadText}>VENDOR COST (Rs.)</TableCell>
                <TableCell className={classes.tableHeadText}>CUSTOMER DISCOUNT (Rs.)</TableCell>
                <TableCell className={classes.tableHeadText}>DRIVER INCENTIVE (Rs.)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedRide.price || "-"}</TableCell>
                <TableCell>{selectedRide.cost || "-"}</TableCell>
                <TableCell>{selectedRide.customerDiscount || "-"}</TableCell>
                <TableCell>{selectedRide.driverIncentive || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Other Details
            </Typography>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer} style={{ paddingTop: 0 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>ETA(MINUTES)</TableCell>
                <TableCell className={classes.tableHeadText}>TRIP COMPLETION TIME(MINUTES)</TableCell>
                <TableCell className={classes.tableHeadText}>WEIGHT OF CARGO (KG)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{Math.floor(selectedRide.eta / 60) || "-"}</TableCell>
                <TableCell>{Math.floor(selectedRide.completionTime / 60) || "-"}</TableCell>
                <TableCell>{selectedRide.weightCargo || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              DropOff
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid container item xs={12} spacing={3}> */}
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <>
              <Box sx={{ borderBottom: 1, borderColor: "divider", justifyContent: "flex-start" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {selectedRide.RideDropoff.map((dropoff, index) => {
                    return <Tab label={"Dropoff" + `${index + 1}`} value={index + 1} />;
                  })}
                </TabList>
              </Box>

              {selectedRide.RideDropoff.map((dropoff, index) => {
                return (
                  <TabPanel value={index + 1}>
                    <TableContainer className={classes.parentContainer} style={{ overflow: "hidden" }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableHeadText}>DROPOFF STATUS</TableCell>
                            <TableCell className={classes.tableHeadText}>OUTWARD ID</TableCell>
                            <TableCell className={classes.tableHeadText}>DROPOFF CITY</TableCell>
                            <TableCell className={classes.tableHeadText}>DROPOFF ADDRESS</TableCell>
                            <TableCell className={classes.tableHeadText}>DROPOFF DATE</TableCell>
                            <TableCell className={classes.tableHeadText}>POC NAME</TableCell>
                            <TableCell className={classes.tableHeadText}>POC NUMBER</TableCell>
                            <TableCell className={classes.tableHeadText}>CURRENT LOCATION</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <>
                            <TableRow className={classes.tableRow} className={classes.tableRow}>
                              <TableCell>{dropoff.status ? dropoff.status : "-"}</TableCell>
                              <TableCell>
                                {dropoff.ProductOutward ? dropoff.ProductOutward.internalIdForBusiness : "-"}
                              </TableCell>
                              <TableCell>{dropoff.DropoffCity ? dropoff.DropoffCity.name : "-"}</TableCell>
                              <TableCell>{dropoff.address ? dropoff.address : "-"}</TableCell>
                              <TableCell>{dropoff.dateTime ? dateFormat(dropoff.dateTime) : "-"}</TableCell>
                              <TableCell>{dropoff.pocName ? dropoff.pocName : "-"}</TableCell>
                              <TableCell>{dropoff.pocNumber ? dropoff.pocNumber : "-"}</TableCell>
                              <TableCell>{dropoff.currentLocation ? dropoff.currentLocation : "-"}</TableCell>
                            </TableRow>
                          </>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TableContainer className={classes.parentContainer} style={{ paddingTop: 0 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableHeadText}>MEMO</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className={classes.tableRow} className={classes.tableRow}>
                            <TableCell>{dropoff.memo ? dropoff.memo : "-"}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Grid item sm={12}>
                      {selectedRide.RideDropoff ? (
                        // <Grid container item xs={12} spacing={3} style={{ minHeight: 400, marginBottom: 20 }}>
                        <Grid
                          item
                          sm={12}
                          className={classes.locationMap}
                          style={{ position: "relative", minHeight: 300 }}
                        >
                          <GoogleMap
                            // pickupLocation={selectedRide.pickupLocation}
                            editable={false}
                            showSingleSearchField={false}
                            singleLocationLatlng={selectedRide.RideDropoff[index].location}
                            showMapSearchFields={false}
                          />
                        </Grid>
                      ) : (
                        // </Grid>
                        ""
                      )}
                    </Grid>
                    {dropoff.manifestId ? (
                      <Grid item sm={12} style={{ marginTop: 20 }}>
                        <Grid>
                          <Typography variant="h6" className={classes.pageSubHeading} style={{ marginTop: 20 }}>
                            Manifest Image
                          </Typography>
                        </Grid>
                        <Grid item sm={12} style={{ marginTop: 20 }}>
                          <a target="_blank" href={getURL("preview", dropoff.manifestId)}>
                            <img src={getURL("preview", dropoff.manifestId)} alt="Manifest Image" />
                          </a>
                        </Grid>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </TabPanel>
                );
              })}
            </>
          </TabContext>
        </Box>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            {selectedRide && selectedRide.eirId !== null ? (
              <>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" className={classes.pageSubHeading}>
                      EIR (Port Shipment)
                    </Typography>
                  </Grid>
                </Grid>
                {/* <a target="_blank" href={productManifestPreview}>
                  Product Manifest Image
                </a> */}
                <Grid item xs={12}>
                  <a target="_blank" href={getURL("preview", selectedRide.eirId)}>
                    <img src={getURL("preview", selectedRide.eirId)} alt="EIR Image" />
                  </a>
                </Grid>
              </>
            ) : (
              ""
            )}
          </Grid>
          {/* <Grid item xs={12}>
            <Map google={props.google} zoom={8} style={mapStyles} initialCenter={{ lat: 47.444, lng: -122.176 }} />
          </Grid> */}
        </Grid>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            {selectedRide && selectedRide.builtyId !== null ? (
              <>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" className={classes.pageSubHeading}>
                      Builty Recieving
                    </Typography>
                  </Grid>
                </Grid>
                {/* <a target="_blank" href={productManifestPreview}>
                  Product Manifest Image
                </a> */}
                <Grid item xs={12}>
                  <a target="_blank" href={getURL("preview", selectedRide.builtyId)}>
                    <img src={getURL("preview", selectedRide.builtyId)} alt="Manifest Image" />
                  </a>
                </Grid>
              </>
            ) : (
              ""
            )}
          </Grid>
          {/* <Grid item xs={12}>
            <Map google={props.google} zoom={8} style={mapStyles} initialCenter={{ lat: 47.444, lng: -122.176 }} />
          </Grid> */}
        </Grid>

        {/* <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            {selectedRide && selectedRide.Manifest ? (
              <>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" className={classes.pageSubHeading}>
                      Product Manifest
                    </Typography>
                  </Grid>
                </Grid>
                <a target="_blank" href={productManifestPreview}>
                  Product Manifest Image
                </a>
                <Grid item xs={12}>
                  <a target="_blank" href={getURL("preview", selectedRide.manifestId)}>
                    <img src={getURL("preview", selectedRide.manifestId)} alt="Manifest Image" />
                  </a>
                </Grid>
              </>
            ) : (
              ""
            )}
          </Grid> */}
        {/* <Grid item xs={12}>
            <Map google={props.google} zoom={8} style={mapStyles} initialCenter={{ lat: 47.444, lng: -122.176 }} />
          </Grid> */}
        {/* </Grid> */}
      </Grid>
    </>
  ) : (
    ""
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU",
})(RideDetailsView);
