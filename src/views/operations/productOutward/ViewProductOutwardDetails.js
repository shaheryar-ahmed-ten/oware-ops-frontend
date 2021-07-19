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
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Product Ouward Details</Typography>
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
                  {selectedProductOutward.Inventories.length}
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
                selectedProductOutward.Inventories.map((order) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {order.Product.name}
                      </TableCell>
                      <TableCell>
                        {order.Product.UOM.name} KG
                      </TableCell>
                      <TableCell>
                        {order.OutwardGroup.quantity}
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
