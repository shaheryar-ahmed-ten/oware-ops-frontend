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
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import TableHeader from '../../../components/TableHeader';
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { dateFormat, dividerDateFormatForFilter, getURL } from "../../../utils/common";
import PrintIcon from "@material-ui/icons/Print";
import { useLocation, useParams } from "react-router";
import axios from "axios";
import owareLogo from "../../../assets/icons/oware-logo-black.png";
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme) => ({
  parentContainer: {
    boxSizing: "border-box",
    padding: "30px 30px",
  },
  parentContainerForPrint: {
    boxSizing: "border-box",
    padding: "30px 0px",
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
  customWidth: {
    maxWidth: 500,
    fontSize: 14,
  },
  commentWrapper: {
    width: 105,
    maxWidth: 105,
    // display: "inline-block",
    // whiteSpace: 'normal',
    wordWrap: "break-word",
  },
}));

function InventoryDetailsView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const columns = [{
    id: 'product',
    label: 'PRODUCT NAME',
    minWidth: 'auto',
    format: (value, entity) => entity.Product ? entity.Product.name : ""
  }, {
    id: 'customer',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Company ? entity.Company.name : ""
  }, {
    id: 'warehouse',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Warehouse ? entity.Warehouse.name : ""
  }, {
    id: 'uom',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Product && entity.Product.UOM ? entity.Product.UOM.name : ""
  }, {
    id: 'availableQuantity',
    label: 'AVAILABLE QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'committedQuantity',
    label: 'COMMITTED QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'dispatchedQuantity',
    label: 'DISPATCHED QUANTITY',
    minWidth: 'auto',
    className: '',
  }
  ];

  const { uid } = useParams();
  const [selectedInventory, setselectedInventory] = useState(null); // selected one to view
  const componentRef = useRef(); // for printing

  useEffect(() => {
    if (!selectedInventory) {
      fetchselectedInventory();
    }
  }, [uid]);

  const fetchselectedInventory = () => {
    _getInventories();
  };

  const _getInventories = () => {
    axios.get(getURL(`inventory/${uid}`),)
      .then(res => {
        setselectedInventory(res.data.data)
      });
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const headerButtons = [];

  return selectedInventory ? (
    <>
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box style={{ padding: "15mm 15mm" }}>
          <Grid container item xs={12} justifyContent="space-between">
            <Grid item xs={12}>
              <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
              <Typography variant="h3" className={classes.heading}>
                Inventory Details
              </Typography>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 30 }} spacing={2}>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              Product Name :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.Product ? selectedInventory.Product.name : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              Company :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.Company ? selectedInventory.Company.name : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              Warehouse :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.Warehouse ? selectedInventory.Warehouse.name : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              UOM :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.Product && selectedInventory.Product.UOM ? selectedInventory.Product.UOM.name : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              Available Quantity :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.availableQuantity ? selectedInventory.availableQuantity : "0"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              Committed Quantity :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.committedQuantity ? selectedInventory.committedQuantity : "0"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={3}>
              Dispatched Quantity :
            </Grid>
            <Grid item xs={3} style={{ fontStyle: "italic" }}>
              {selectedInventory.dispatchedQuantity ? selectedInventory.dispatchedQuantity : "0"}
            </Grid>
          </Grid>
          <Grid container item xs={12} justifyContent="space-between" style={{ marginTop: 20, marginBottom: 20 }}>
            <Typography variant="h3" className={classes.heading}>
              Batch Details
            </Typography>
          </Grid>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className={classes.shadedTableHeader}>
                  <TableCell className={classes.tableHeadText}>QUANTITY</TableCell>
                  <TableCell className={classes.tableHeadText}>BATCH NAME</TableCell>
                  <TableCell className={classes.tableHeadText}>BATCH NUMBER</TableCell>
                  <TableCell className={classes.tableHeadText}>MANUFACTURING DATE</TableCell>
                  <TableCell className={classes.tableHeadText}>EXPIRY DATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  selectedInventory.InventoryDetail.map((invDetail) => {
                    return (
                      <TableRow className={classes.tableRow} className={classes.tableRow}>
                        <TableCell>{invDetail.inwardQuantity || "-"}</TableCell>
                        <TableCell>{invDetail.batchName || "-"}</TableCell>
                        <TableCell>{invDetail.batchNumber || "-"}</TableCell>
                        <TableCell>{dividerDateFormatForFilter(invDetail.manufacturingDate) || "-"}</TableCell>
                        <TableCell>{dividerDateFormatForFilter(invDetail.expiryDate) || "-"}</TableCell>
                      </TableRow>
                    )
                  })
                }

              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>


      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Inventory Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/reporting/inventory")}>
              Back
            </Button>
          </Grid>
        </Grid>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>PRODUCT NAME</TableCell>
                <TableCell className={classes.tableHeadText}>COMPANY</TableCell>
                <TableCell className={classes.tableHeadText}>WAREHOUSE</TableCell>
                <TableCell className={classes.tableHeadText}>UOM</TableCell>
                <TableCell className={classes.tableHeadText}>AVAILABLE QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>COMMITTED QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>DISPATCHED QUANTITY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow} className={classes.tableRow}>
                <TableCell>{selectedInventory.Product.name || "-"}</TableCell>
                <TableCell>{selectedInventory.Company.name || "-"}</TableCell>
                <TableCell>{selectedInventory.Warehouse ? selectedInventory.Warehouse.name : "-"}</TableCell>
                <TableCell>{selectedInventory.Product.UOM.name || "-"}</TableCell>
                <TableCell>{selectedInventory.availableQuantity ? selectedInventory.availableQuantity : "0"}</TableCell>
                <TableCell>{selectedInventory.committedQuantity ? selectedInventory.committedQuantity : "0"}</TableCell>
                <TableCell>{selectedInventory.dispatchedQuantity ? selectedInventory.dispatchedQuantity : "0"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell className={classes.tableHeadText}>QUANTITY</TableCell>
                <TableCell className={classes.tableHeadText}>BATCH NAME</TableCell>
                <TableCell className={classes.tableHeadText}>BATCH NUMBER</TableCell>
                <TableCell className={classes.tableHeadText}>MANUFACTURING DATE</TableCell>
                <TableCell className={classes.tableHeadText}>EXPIRY DATE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                selectedInventory.InventoryDetail.map((invDetail) => {
                  console.log("debug", invDetail.batchName)
                  return (
                    invDetail.batchName && invDetail.batchName.includes('default') ?
                      ''
                      :
                      <TableRow className={classes.tableRow} className={classes.tableRow}>
                        <TableCell>{invDetail.inwardQuantity || "-"}</TableCell>
                        <TableCell>{invDetail.batchName || "-"}</TableCell>
                        <TableCell>{invDetail.batchNumber || "-"}</TableCell>
                        <TableCell>{dividerDateFormatForFilter(invDetail.manufacturingDate) || "-"}</TableCell>
                        <TableCell>{dividerDateFormatForFilter(invDetail.expiryDate) || "-"}</TableCell>
                      </TableRow>
                  )
                })
              }

            </TableBody>
          </Table>
        </TableContainer>

      </Grid>

    </>
  ) : null;
}

export default InventoryDetailsView;
