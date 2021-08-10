import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles
} from '@material-ui/core'
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

function InwardProductDetailsView() {
  const classes = useStyles();
  const { state } = useLocation();
  const { uid } = useParams();
  const [selectedProductInward, setSelectedProductInward] = useState(state ? state.selectedProductInward : null);

  useEffect(() => {
    if (!selectedProductInward) {
      fetchInwardOrders();
    }
  }, [uid])

  const fetchInwardOrders = () => {
    _getProductInwards()
  }

  const _getProductInwards = () => {
    axios.get(getURL('product-inward'))
      .then(res => {
        setSelectedProductInward(res.data.data.find((product) => product.id == uid))
      });
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    selectedProductInward ? <>
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box display="none" displayPrint="block" style={{ padding: "25mm 25mm 0mm 25mm" }}>
          <Typography variant="h3">
            Inward Products
          </Typography>
        </Box>
        <Box display="none" displayPrint="block" style={{ padding: "10mm 25mm 0mm 25mm" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Inward Id :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.internalIdForBusiness}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Customer Name :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.Company.name}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Warehouse :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.Warehouse.name}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                City :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.Warehouse.city}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Processed By :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.User.firstName + ` ` + selectedProductInward.User.lastName}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Created at :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {dateFormat(selectedProductInward.createdAt)}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tableHeadText}>
                        PRODUCT
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        PRODUCT WEIGHT
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        UOM
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadText}>
                        QUANTITY
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      selectedProductInward.Products.map((product, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell>
                              {product.name}
                            </TableCell>
                            <TableCell>
                              {product.weight} KG/UNIT
                            </TableCell>
                            <TableCell>
                              {product.UOM.name}
                            </TableCell>
                            <TableCell>
                              {product.InwardGroup.quantity}
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
          <Typography variant="h3" className={classes.heading}>Product Inward Details
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
                  className={classes.tableHeadText}>Inward Id
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Customer
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Warehouse
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Products
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Reference Id
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Inward Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role="checkbox">
                <TableCell>
                  {selectedProductInward.internalIdForBusiness}
                </TableCell>
                <TableCell>
                  {selectedProductInward.Company.name}
                </TableCell>
                <TableCell>
                  {selectedProductInward.Warehouse.name}
                </TableCell>
                <TableCell>
                  {selectedProductInward.Products.length}
                </TableCell>
                <TableCell>
                  {selectedProductInward.referenceId}
                </TableCell>
                <TableCell>
                  {dateFormat(selectedProductInward.createdAt)}
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
                  QUANTITY
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  UOM
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProductInward.Products.map((product, index) => {
                return (
                  <TableRow hover role="checkbox" key={index}>
                    <TableCell>
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.InwardGroup.quantity}
                    </TableCell>
                    <TableCell>
                      {product.UOM.name}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
      :
      null
  )
}

export default InwardProductDetailsView