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
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { dateFormat, dividerDateFormat, getURL } from "../../../utils/common";
import PrintIcon from "@material-ui/icons/Print";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import owareLogo from "../../../assets/icons/oware-logo-black.png";
import { isRequired } from "../../../utils/validators";

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
}));

function ViewProductOutwardDetails() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { uid } = useParams();
  const [selectedProductOutward, setSelectedProductOutward] = useState(null);
  useEffect(() => {
    if (!selectedProductOutward) {
      fetchProductOutwards();
    }
  }, [uid]);

  const fetchProductOutwards = () => {
    _getProductOutwards();
  };

  const _getProductOutwards = () => {
    axios.get(getURL(`product-outward/${uid}`)).then((res) => {
      if (!res.data.data.success) {
        setSelectedProductOutward(null);
      }
      setSelectedProductOutward(res.data.data);
    });
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return selectedProductOutward ? (
    <>
      {/* Only for printing */}
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box display="none" displayPrint="block" style={{ padding: "25mm 25mm 0mm 25mm" }}>
          <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
          <Typography variant="h3">Product Outwards</Typography>
        </Box>
        <Box display="none" displayPrint="block" style={{ padding: "10mm 25mm 0mm 25mm" }}>
          <Grid container spacing={2}>
            <Grid container item xs={6}>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Outward Id :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.internalIdForBusiness}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Dispatch Order Id :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.DispatchOrder.internalIdForBusiness}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Company Name :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.DispatchOrder.Inventory.Company.name}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Warehouse :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.DispatchOrder.Inventory.Warehouse.name}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  City :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.DispatchOrder.Inventory.Warehouse.city}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Created by :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {`${selectedProductOutward.User.firstName || ""} ${selectedProductOutward.User.lastName || ""}`}
                </Box>
              </Grid>
            </Grid>
            <Grid container item xs={6}>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Receiver Name :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.DispatchOrder.receiverName}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Receiver Phone :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.DispatchOrder.receiverPhone}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Vehicle Number :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.Vehicle ? selectedProductOutward.Vehicle.registrationNumber : selectedProductOutward.externalVehicle ? selectedProductOutward.externalVehicle : "-"}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Shipment Date&Time :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {dateFormat(selectedProductOutward.createdAt)}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  Transport Type :
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="block" displayPrint="block">
                  {selectedProductOutward.externalVehicle && isRequired(selectedProductOutward.externalVehicle) ? "Customer Provided" : "Oware Provided"}
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Box display="none" displayPrint="block" style={{ margin: "5mm 0mm 0mm 0mm" }}>
                <Typography variant="h3">Products</Typography>
              </Box>
            </Grid>

            <Grid container item xs={12}>
              {
                selectedProductOutward.DispatchOrder.Inventories.map((order, idx) => {
                  let remainingQt = 0,
                    sentQt = 0;
                  const targetedPoInv = selectedProductOutward.Inventories.find(
                    (inv) => inv.OutwardGroup.inventoryId === order.OrderGroup.inventoryId
                  );
                  if (targetedPoInv) {
                    sentQt += targetedPoInv.OutwardGroup.quantity;
                  }
                  remainingQt = order.OrderGroup.quantity - sentQt;
                  if (targetedPoInv) {

                    return targetedPoInv.OutwardGroup.InventoryDetail.map((invDetail) => {
                      return (
                        <>
                          <Grid item xs={12} container style={{ marginTop: 10 }} >
                            <Grid item xs={6}>
                              BATCH NUMBER :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {
                                order.Product.batchEnabled ?
                                  invDetail.batchNumber || '-'
                                  :
                                  '-'
                              }
                            </Grid>
                            <Grid item xs={6}>
                              PRODUCT :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {order.Product.name}
                            </Grid>
                            <Grid item xs={6}>
                              UOM :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {order.Product.UOM.name}
                            </Grid>
                            <Grid item xs={6}>
                              REQUESTED QTY :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {order.OrderGroup.quantity}
                            </Grid>
                            <Grid item xs={6}>
                              DISPATCHED QTY :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {sentQt}
                            </Grid>

                            <Grid item xs={6}>
                              BATCH DISPATCHED QTY :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {
                                order.Product.batchEnabled ?
                                  invDetail.outwardQuantity || '-'
                                  :
                                  '-'
                              }
                            </Grid>
                            <Grid item xs={6}>
                              BATCH EXPIRY DATE :
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'center' }}>
                              {
                                order.Product.batchEnabled ?
                                  dividerDateFormat(invDetail.expiryDate) || '-'
                                  :
                                  '-'
                              }
                            </Grid>
                          </Grid>
                        </>
                      )
                    })
                  }


                })
              }
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* Only for Displaying */}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Product Outward Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/operations/product-outward")}>
              Back
            </Button>
          </Grid>
        </Grid>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>OUTWARD ID</TableCell>
                <TableCell className={classes.tableHeadText}>DISPATCH ORDER ID</TableCell>
                <TableCell className={classes.tableHeadText}>COMPANY</TableCell>
                <TableCell className={classes.tableHeadText}>WAREHOUSE</TableCell>
                <TableCell className={classes.tableHeadText}>CITY</TableCell>
                {/* <TableCell className={classes.tableHeadText}>NO. OF PRODUCTS</TableCell> */}
                <TableCell className={classes.tableHeadText}>CREATED BY</TableCell>
                <TableCell className={classes.tableHeadText}>VEHICLE NUMBER</TableCell>
                <TableCell className={classes.tableHeadText}>CREATED AT</TableCell>
                <TableCell className={classes.tableHeadText}>TRANSPORTATION TYPE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{selectedProductOutward.internalIdForBusiness}</TableCell>
                <TableCell>{selectedProductOutward.DispatchOrder.internalIdForBusiness}</TableCell>
                <TableCell>{selectedProductOutward.DispatchOrder.Inventory.Company.name}</TableCell>
                <TableCell>{selectedProductOutward.DispatchOrder.Inventory.Warehouse.name}</TableCell>
                <TableCell>{selectedProductOutward.DispatchOrder.Inventory.Warehouse.city}</TableCell>
                {/* <TableCell>{selectedProductOutward.DispatchOrder.Inventories.length}</TableCell> */}
                <TableCell>
                  {`${selectedProductOutward.User.firstName || ""} ${selectedProductOutward.User.lastName || ""}`}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.Vehicle ? selectedProductOutward.Vehicle.registrationNumber : selectedProductOutward.externalVehicle ? selectedProductOutward.externalVehicle : "-"}
                </TableCell>
                <TableCell>{dateFormat(selectedProductOutward.createdAt)}</TableCell>
                <TableCell>{selectedProductOutward.externalVehicle && isRequired(selectedProductOutward.externalVehicle) ? "Customer Provided" : "Oware Provided"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell className={classes.tableHeadText}>BATCH NUMBER</TableCell>
                <TableCell className={classes.tableHeadText}>PRODUCT</TableCell>
                <TableCell className={classes.tableHeadText}>UOM</TableCell>
                <TableCell className={classes.tableHeadText}>REQUESTED QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>DISPATCHED QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>BATCH DISPATCHED QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>BATCH EXPIRY DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProductOutward.DispatchOrder.Inventories.map((order, idx) => {
                let remainingQt = 0,
                  sentQt = 0;
                const targetedPoInv = selectedProductOutward.Inventories.find(
                  (inv) => inv.OutwardGroup.inventoryId === order.OrderGroup.inventoryId
                );
                console.log("debug 0", order.OrderGroup.inventoryId)
                console.log("debug 1", selectedProductOutward.Inventories)
                if (targetedPoInv) {
                  sentQt += targetedPoInv.OutwardGroup.quantity;
                }
                remainingQt = order.OrderGroup.quantity - sentQt;
                if (targetedPoInv) {
                  return targetedPoInv.OutwardGroup.InventoryDetail.map((invDetail) => {
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          {
                            order.Product.batchEnabled ?
                              invDetail.batchNumber || '-'
                              :
                              '-'
                          }
                        </TableCell>
                        <TableCell>{order.Product.name}</TableCell>
                        <TableCell>{order.Product.UOM.name}</TableCell>
                        <TableCell>{order.OrderGroup.quantity}</TableCell>
                        <TableCell>{sentQt}</TableCell>
                        <TableCell>
                          {
                            order.Product.batchEnabled ?
                              invDetail.OutwardGroup ?
                                invDetail.OutwardGroup.find((outGrp) => outGrp.inventoryId == invDetail.inventoryId)?.OutwardGroupBatch?.quantity || '-'
                                :
                                '-'
                              // invDetail.outwardQuantity || '-'
                              :
                              '-'
                          }
                        </TableCell>
                        <TableCell>
                          {
                            order.Product.batchEnabled ?
                              dividerDateFormat(invDetail.expiryDate) || '-'
                              :
                              '-'
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  ) : null;
}

export default ViewProductOutwardDetails;
