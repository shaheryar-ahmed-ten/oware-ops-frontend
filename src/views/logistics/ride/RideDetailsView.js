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
} from "@material-ui/core";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { dateFormat, getURL } from "../../../utils/common";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";
import { Map, GoogleApiWrapper } from "google-maps-react";
import GoogleMap from "../../../components/GoogleMap.js";

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
  const { uid } = useParams();

  useEffect(() => {
    if (!selectedRide) {
      fetchSelectedRide();
    }
  }, [uid]);

  const fetchSelectedRide = () => {
    _getSelectedRide();
  };
  const _getSelectedRide = () => {
    axios.get(getURL(`ride/single/${uid}`)).then((res) => {
      // console.log(res.data.data)
      setSelectedRide(res.data.data);
    });
    axios
      .get(getURL(`ride/preview/7`))
      .then((res) => {
        console.log(res);
        setProductManifestPreview(res.data.preview);
      })
      .catch((err) => {
        console.log(err);
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

  return selectedRide ? (
    <>
      {/* Only for printing */}
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box style={{ padding: "25mm 15mm" }}>
          <Grid container item xs={12} justifyContent="space-between">
            <Grid item xs={12}>
              <Typography variant="h3" className={classes.heading}>
                Ride Details
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
                {selectedRide.Driver.Vendor.name || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Vehicle Type :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Vehicle.Car.CarMake.name + " " + selectedRide.Vehicle.Car.CarModel.name || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Vehicle :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Vehicle.registrationNumber || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Driver :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.Driver.name || "-"}
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                PICKUP & DROPOFF
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                PickupCity :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.pickupCity.name || "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                PickupAddress :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.pickupAddress || "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                DropoffCity :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.dropoffCity.name || "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                DropoffAddress :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {selectedRide.dropoffAddress || "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                PickupDate :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {dateFormat(selectedRide.pickupDate) || "-"}
              </Grid>
              <Grid item style={{ fontWeight: 500 }} xs={3}>
                DropoffDate :
              </Grid>
              <Grid item xs={3} style={{ fontStyle: "italic" }}>
                {dateFormat(selectedRide.dropoffDate) || "-"}
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
              <Grid style={{ fontWeight: 500 }} item xs={4}>
                Customer Price (Rs.) :
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.price || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={4}>
                Vendor Cost (Rs.) :
              </Grid>
              <Grid item xs={2} style={{ fontStyle: "italic", transform: "translateX(-50px)" }}>
                {selectedRide.cost || "-"}
              </Grid>
              <Grid style={{ fontWeight: 500 }} item xs={4}>
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
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                OTHER DETAILS
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid style={{ fontWeight: 500 }} item xs={3}>
                Memo :
              </Grid>
              <Grid item xs={9} style={{ fontStyle: "italic", paddingTop: 23 }}>
                {selectedRide.memo || "-"}
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} style={{ marginTop: 20 }} justifyContent="space-between">
            <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
              <Typography variant="h5" className={classes.pageSubHeading}>
                PRODUCT DETAILS
              </Typography>
            </Grid>
            <TableContainer className={classes.parentContainer}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow className={classes.shadedTableHeader}>
                    <TableCell className={classes.tableHeadText}>CATEGORY</TableCell>
                    <TableCell className={classes.tableHeadText}>NAME</TableCell>
                    <TableCell className={classes.tableHeadText}>QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRide.RideProducts.map((product) => {
                    return (
                      <TableRow>
                        <TableCell>{product.Category.name}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Box>
      {/* Only for Displaying */}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Ride Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/logistics/ride")}>
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
                <TableCell>{selectedRide.Customer.name || ""}</TableCell>
                <TableCell>{selectedRide.status || ""}</TableCell>
                <TableCell>{selectedRide.Driver.Vendor.name || ""}</TableCell>
                <TableCell>
                  {selectedRide.Vehicle.Car.CarMake.name + " " + selectedRide.Vehicle.Car.CarModel.name || ""}
                </TableCell>
                <TableCell>{selectedRide.Vehicle.registrationNumber || ""}</TableCell>
                <TableCell>{selectedRide.Driver.name || ""}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Pickup & Drop-off
            </Typography>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>PICKUP CITY</TableCell>
                <TableCell className={classes.tableHeadText}>PICKUP ADDRESS</TableCell>
                <TableCell className={classes.tableHeadText}>DROPOFF CITY</TableCell>
                <TableCell className={classes.tableHeadText}>DROPOFF ADDRESS</TableCell>
                <TableCell className={classes.tableHeadText}>PICKUP DATE</TableCell>
                <TableCell className={classes.tableHeadText}>DROPOFF DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{selectedRide.pickupCity.name}</TableCell>
                <TableCell>{selectedRide.pickupAddress}</TableCell>
                <TableCell>{selectedRide.dropoffCity.name}</TableCell>
                <TableCell>{selectedRide.pickupAddress}</TableCell>
                <TableCell>{dateFormat(selectedRide.pickupDate)}</TableCell>
                <TableCell>{dateFormat(selectedRide.dropoffDate)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

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
                <TableCell className={classes.tableHeadText}>MEMO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedRide.memo}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container item xs={12} spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" className={classes.pageSubHeading}>
              Product Details
            </Typography>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell className={classes.tableHeadText}>CATEGORY</TableCell>
                <TableCell className={classes.tableHeadText}>NAME</TableCell>
                <TableCell className={classes.tableHeadText}>QUANTITY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRide.RideProducts.map((product) => {
                return (
                  <TableRow>
                    <TableCell>{product.Category.name}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container item xs={12} spacing={3}>
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
              </>
            ) : (
              ""
            )}
          </Grid>
          {/* <Grid item xs={12}>
            <Map google={props.google} zoom={8} style={mapStyles} initialCenter={{ lat: 47.444, lng: -122.176 }} />
          </Grid> */}
        </Grid>

        <Grid container item xs={12} spacing={3} style={{ minHeight: 400 }}>
          <Grid item xs={12} className={classes.locationMap} style={{ position: "relative" }}>
            <GoogleMap pickupLocation={selectedRide.pickupLocation} dropoffLocation={selectedRide.dropoffLocation} />
          </Grid>
        </Grid>
      </Grid>
    </>
  ) : (
    ""
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU",
})(RideDetailsView);
