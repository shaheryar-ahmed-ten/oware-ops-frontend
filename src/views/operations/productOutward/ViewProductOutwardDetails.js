import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Typography
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat, getURL } from '../../../utils/common';
import PrintIcon from '@material-ui/icons/Print';
import { useLocation, useParams } from 'react-router';
import axios from 'axios';

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
  shadedTableHeader: {
    backgroundColor: 'rgba(202,201,201,0.3)'
  },
  tableHeadText: {
    background: 'transparent', fontWeight: 'bolder', fontSize: '12px'
  }
}));


function ViewProductOutwardDetails() {
  const classes = useStyles();
  const { state } = useLocation();
  const { uid } = useParams();
  const [selectedProductOutward, setselectedProductOutward] = useState(state ? state.selectedOutwardorder : null)

  useEffect(() => {
    if (!selectedProductOutward) {
      fetchProductOutwards()
    }
  }, [uid])
  const fetchProductOutwards = () => {
    _getProductOutwards()
  }
  const _getProductOutwards = () => {
    axios.get(getURL('/product-outward'))
      .then(res => {
        setselectedProductOutward(res.data.data.find((outwardOrder) => outwardOrder.id == uid));
      });
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    selectedProductOutward ? <>
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box display="none" displayPrint="block" style={{ padding: "25mm 25mm 0mm 25mm" }}>
          <Typography variant="h3">
            Product Outwards
          </Typography>
        </Box>
        <Box display="none" displayPrint="block" style={{ padding: "10mm 25mm 0mm 25mm" }}>
          <Grid container spacing={2}>
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
                Customer Name :
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
                {selectedProductOutward.Vehicle.registrationNumber}
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
              <Box display="none" displayPrint="block" style={{ margin: "10mm 0mm 0mm 0mm" }}>
                <Typography variant="h3">
                  Products
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className={classes.shadedTableHeader}>
                      <TableCell
                        className={classes.tableHeadText}>
                        PRODUCT
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        WEIGHT
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        UOM
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        REQUESTED QTY
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        AVAILABLE QTY
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      selectedProductOutward.DispatchOrder.Inventories.map((order, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell>
                              {order.Product.name}
                            </TableCell>
                            <TableCell>
                              {order.Product.weight} KG
                            </TableCell>
                            <TableCell>
                              {order.Product.UOM.name}
                            </TableCell>
                            <TableCell>
                              {order.OrderGroup.quantity}
                            </TableCell>
                            <TableCell>
                              {order.availableQuantity}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Product Ouward Details
            <IconButton aria-label="print" onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Typography>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableHeadText}>OUTWARD ID
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>DISPATCH ORDER ID
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>CUSTOMER
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>WAREHOUSE
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>CITY
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>PRODUCTS
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>VEHICLE NUMBER
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>CREATED AT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {selectedProductOutward.internalIdForBusiness}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.DispatchOrder.internalIdForBusiness}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.DispatchOrder.Inventory.Company.name}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.DispatchOrder.Inventory.Warehouse.name}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.DispatchOrder.Inventory.Warehouse.city}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.DispatchOrder.Inventories.length}
                </TableCell>
                <TableCell>
                  {selectedProductOutward.Vehicle.registrationNumber}
                </TableCell>
                <TableCell>
                  {dateFormat(selectedProductOutward.createdAt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell
                  className={classes.tableHeadText}>
                  PRODUCT
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  UOM
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  QUANTITY
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  AVAILABLE QUANTITY
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                selectedProductOutward.DispatchOrder.Inventories.map((order, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        {order.Product.name}
                      </TableCell>
                      <TableCell>
                        {order.Product.UOM.name}
                      </TableCell>
                      <TableCell>
                        {order.OrderGroup.quantity}
                      </TableCell>
                      <TableCell>
                        {order.availableQuantity}
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

      </Grid>
    </>
      :
      null
  );
}

export default ViewProductOutwardDetails;
