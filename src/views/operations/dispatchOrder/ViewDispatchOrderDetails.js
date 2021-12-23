import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  Button,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { dateFormat, getURL } from "../../../utils/common";
import PrintIcon from "@material-ui/icons/Print";
import { useLocation, useNavigate, useParams } from "react-router";
import { TableRow } from "@material-ui/core";
import axios from "axios";
import owareLogo from "../../../assets/icons/oware-logo-black.png";
import moment from "moment-timezone";

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
  tableRow: {
    "&:last-child th, &:last-child td": {
      borderBottom: 0,
    },
  },
}));

function ViewDispatchOrderDetails() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { uid } = useParams();
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(state ? state.selectedDispatchOrder : null);
  useEffect(() => {
    if (!selectedDispatchOrder) {
      fetchDispatchOrders();
    }
  }, [uid]);
  const fetchDispatchOrders = () => {
    _getDispatchOrders();
  };
  const _getDispatchOrders = () => {
    axios.get(getURL(`dispatch-order/${uid}`)).then((res) => {
      var end = moment();
      var duration = moment.duration(end.diff(res.data.data.shipmentDate));
      var pendingDays = res.data.data.status != 2 && res.data.data.status != 3
        ?
        Math.floor(duration.asDays())
        :
        ''
      var data = { ...res.data.data, pendingDays }
      setSelectedDispatchOrder(data);
    });
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return selectedDispatchOrder ? (
    <>
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box display="none" displayPrint="block" style={{ padding: "25mm 25mm 0mm 25mm" }}>
          <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
          <Typography variant="h3">Dispatch Order</Typography>
        </Box>
        {/* PRINTING ONLY */}
        <Box display="none" displayPrint="block" style={{ padding: "10mm 25mm 0mm 25mm" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Dispatch Order Id :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.internalIdForBusiness}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Company :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.Inventory.Company.name}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Warehouse :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.Inventory.Warehouse.name}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                City :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.Inventory.Warehouse.city}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Created by :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {`${selectedDispatchOrder.User.firstName || ""} ${selectedDispatchOrder.User.lastName || ""}`}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Receiver Name :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.receiverName}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Receiver Phone :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.receiverPhone}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Requested Shipment Date&Time :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {dateFormat(selectedDispatchOrder.shipmentDate)}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Order Memo :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedDispatchOrder.orderMemo || "-"}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box display="none" displayPrint="block" style={{ margin: "10mm 0mm 0mm 0mm" }}>
                <Typography variant="h3">Products</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className={classes.shadedTableHeader}>
                      <TableCell className={classes.tableHeadText}>PRODUCT</TableCell>
                      <TableCell className={classes.tableHeadText}>PRODUCT WEIGHT</TableCell>
                      <TableCell className={classes.tableHeadText}>UOM</TableCell>
                      <TableCell className={classes.tableHeadText}>QUANTITY</TableCell>
                      {/* <TableCell className={classes.tableHeadText}>AVAILABLE QUANTITY</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDispatchOrder.Inventories.map((order, idx) => {
                      return (
                        <TableRow key={idx}>
                          <TableCell>{order.Product.name}</TableCell>
                          <TableCell>{order.Product.weight} KG/UNIT</TableCell>
                          <TableCell>{order.Product.UOM.name}</TableCell>
                          <TableCell>{order.OrderGroup.quantity}</TableCell>
                          {/* <TableCell>{order.availableQuantity}</TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Dispatch Order Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/operations/dispatch-order")}>
              Back
            </Button>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>DISPATCH ORDER ID</TableCell>
                <TableCell className={classes.tableHeadText}>COMPANY</TableCell>
                <TableCell className={classes.tableHeadText}>WAREHOUSE</TableCell>
                <TableCell className={classes.tableHeadText}>CREATED BY</TableCell>
                <TableCell className={classes.tableHeadText}>REFERENCE ID</TableCell>
                <TableCell className={classes.tableHeadText}>SHIPMENT DATE</TableCell>
                {
                  selectedDispatchOrder.status != 2 && selectedDispatchOrder.status != 3 && selectedDispatchOrder.pendingDays >= 1 ?
                    < TableCell className={classes.tableHeadText}>PENDING DAYS</TableCell>
                    :
                    ''
                }
                <TableCell className={classes.tableHeadText}>RECEIVER NAME</TableCell>
                <TableCell className={classes.tableHeadText}>RECEIVER PHONE</TableCell>
                {/* <TableCell
                  className={classes.tableHeadText}>ORDER MEMO
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedDispatchOrder.internalIdForBusiness}</TableCell>
                <TableCell>{selectedDispatchOrder.Inventory.Company.name}</TableCell>
                <TableCell>{selectedDispatchOrder.Inventory.Warehouse.name}</TableCell>
                <TableCell>
                  {`${selectedDispatchOrder.User.firstName || ""} ${selectedDispatchOrder.User.lastName || ""}`}
                </TableCell>
                <TableCell>{selectedDispatchOrder.referenceId}</TableCell>
                <TableCell
                  style={{
                    color: selectedDispatchOrder.pendingDays > 2 ?
                      'rgba(255,30,0,0.8)' : selectedDispatchOrder.pendingDays > 0 ?
                        '#DBA712' : 'black',
                  }}
                >
                  {dateFormat(selectedDispatchOrder.shipmentDate)}
                </TableCell>
                {
                  selectedDispatchOrder.status != 2 && selectedDispatchOrder.status != 3 && selectedDispatchOrder.pendingDays >= 1 ?
                    <TableCell>{selectedDispatchOrder.pendingDays}</TableCell>
                    :
                    ''
                }
                <TableCell>{selectedDispatchOrder.receiverName}</TableCell>
                <TableCell>{selectedDispatchOrder.receiverPhone}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer className={classes.parentContainer} style={{ paddingTop: 0 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>ORDER MEMO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedDispatchOrder.orderMemo || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell className={classes.tableHeadText}>PRODUCT</TableCell>
                <TableCell className={classes.tableHeadText}>PRODUCT WEIGHT</TableCell>
                <TableCell className={classes.tableHeadText}>UOM</TableCell>
                <TableCell className={classes.tableHeadText}>QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>AVAILABLE QUANTITY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedDispatchOrder.Inventories.map((order, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell>{order.Product.name}</TableCell>
                    <TableCell>{order.Product.weight} KG</TableCell>
                    <TableCell>{order.Product.UOM.name}</TableCell>
                    <TableCell>{order.OrderGroup.quantity}</TableCell>
                    <TableCell>{order.availableQuantity}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  ) : null;
}

export default ViewDispatchOrderDetails;
