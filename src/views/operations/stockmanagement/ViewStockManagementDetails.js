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
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { dateFormat, getURL } from "../../../utils/common";
import PrintIcon from "@material-ui/icons/Print";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import owareLogo from "../../../assets/icons/oware-logo-black.png";

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

function ViewStockManagementDetails() {
  const classes = useStyles();
  const navigate = useNavigate();
  const productsColumns = [
    {
      id: "companyName",
      label: "COMPANY",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Company.name,
    },
    {
      id: "warehouseName",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Warehouse.name,
    },
    {
      id: "productName",
      label: "PRODUCTS",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Product.name,
    },
    {
      id: "availableQty",
      label: "ADJUSTMENT QTY",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.AdjustmentDetails.adjustmentQuantity,
    },
    {
      id: "UOM",
      label: "UoM",
      minWidth: "auto",
      className: "",
      format: (value, inventory) => inventory.Product.UOM.name,
    },
    {
      id: "reasonType",
      label: "REASON",
      minWidth: "auto",
      className: "",
      format: (value, inventory) =>
        inventory.AdjustmentDetails && inventory.AdjustmentDetails.WastagesType
          ? inventory.AdjustmentDetails.WastagesType.name.charAt(0).toUpperCase() +
          inventory.AdjustmentDetails.WastagesType.name.slice(1).toLowerCase()
          : "",
    },
    {
      id: "comment",
      label: "COMMENT",
      minWidth: "auto",
      className: classes.commentWrapper,
      format: (value, inventory, print) => {
        return (
          <Tooltip title={`${inventory.AdjustmentDetails.comment}`} classes={{ tooltip: classes.customWidth }} arrow>
            <Typography>
              {inventory.AdjustmentDetails.comment.length > 20 && !print
                ? `${inventory.AdjustmentDetails.comment.substring(0, 20)}...` || "-"
                : inventory.AdjustmentDetails.comment || "-"}
            </Typography>
          </Tooltip>
        );
      },
    },
  ];

  const { uid } = useParams();
  const [selectedInventoryWastages, setSelectedInventoryWastages] = useState(null); // selected one to view
  const componentRef = useRef(); // for printing

  // If uid exists than fetch details of the selecteInventoryWastages
  useEffect(() => {
    if (uid) _getInventoryWastage(); // only in case of edit
  }, [uid]);

  const _getInventoryWastage = () => {
    axios
      .get(getURL(`inventory-wastages/${uid}`))
      .then((res) => {
        setSelectedInventoryWastages(res.data.data);
      })
      .catch((error) => {
        console.info(error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return selectedInventoryWastages ? (
    <>
      {/* Only for printing */}
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box style={{ padding: "25mm 15mm" }}>
          <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
          <Typography variant="h3">Stock Adjustment Details</Typography>
          <TableContainer className={classes.parentContainerForPrint}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadText}>ADJUSTMENT ID</TableCell>
                  <TableCell className={classes.tableHeadText}>ADJUSTMENT DATE</TableCell>
                  {/* <TableCell
                                            className={classes.tableHeadText}>CITY
                                        </TableCell> */}
                  <TableCell className={classes.tableHeadText}>NO. OF PRODUCTS</TableCell>
                  <TableCell className={classes.tableHeadText}>CREATED BY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.tableRow}>
                  <TableCell>{selectedInventoryWastages.internalIdForBusiness}</TableCell>
                  <TableCell>{dateFormat(selectedInventoryWastages.updatedAt)}</TableCell>
                  {/* <TableCell>
                                            {selectedInventoryWastages.Inventories[0].Warehouse.city}
                                        </TableCell> */}
                  <TableCell>{selectedInventoryWastages.Inventories.length}</TableCell>
                  <TableCell>
                    {selectedInventoryWastages.Admin.firstName + selectedInventoryWastages.Admin.lastName}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.heading}>
              Products Details
            </Typography>
          </Grid>
          <TableContainer className={classes.parentContainerForPrint}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className={classes.shadedTableHeader}>
                  {productsColumns.map((column) =>
                    column.id !== "comment" ? (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          background: "transparent",
                          fontWeight: "bolder",
                          fontSize: "12px",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ) : (
                      ""
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedInventoryWastages.Inventories.map((inventoryWastage) => {
                  return (
                    <>
                      <TableRow hover role="checkbox" tabIndex={-1} key={inventoryWastage.id}>
                        {productsColumns.map((column) => {
                          const value = inventoryWastage[column.id];
                          return column.id !== "comment" ? (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ borderBottom: "0" }}
                              className={
                                column.className && typeof column.className === "function"
                                  ? column.className(value)
                                  : column.className
                              }
                            >
                              {column.format ? column.format(value, inventoryWastage, { print: true }) : value}
                            </TableCell>
                          ) : (
                            ""
                          );
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell align="right" style={{ fontWeight: 600 }}>
                          Comment
                        </TableCell>
                        <TableCell align="left" colSpan={5}>
                          {" "}
                          {inventoryWastage.AdjustmentDetails.comment
                            ? inventoryWastage.AdjustmentDetails.comment
                            : "-"}{" "}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* Only for Displaying */}
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Stock Adjustment Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={() => navigate("/operations/stock-adjustment")}>
              Back
            </Button>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>ADJUSTMENT ID</TableCell>
                <TableCell className={classes.tableHeadText}>ADJUSTMENT DATE</TableCell>
                {/* <TableCell
                                            className={classes.tableHeadText}>CITY
                                        </TableCell> */}
                <TableCell className={classes.tableHeadText}>NO. OF PRODUCTS</TableCell>
                <TableCell className={classes.tableHeadText}>CREATED BY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={classes.tableRow}>
                <TableCell>{selectedInventoryWastages.internalIdForBusiness}</TableCell>
                <TableCell>{dateFormat(selectedInventoryWastages.updatedAt)}</TableCell>
                <TableCell>{selectedInventoryWastages.Inventories.length}</TableCell>
                {/* <TableCell>
                                        {selectedInventoryWastages.Inventories[0].Warehouse.city}
                                    </TableCell> */}
                <TableCell>
                  {selectedInventoryWastages.Admin.firstName + selectedInventoryWastages.Admin.lastName}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid item xs={12}>
          <Typography variant="h4" className={classes.heading}>
            Products Details
          </Typography>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                {productsColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      background: "transparent",
                      fontWeight: "bolder",
                      fontSize: "12px",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedInventoryWastages.Inventories.map((inventoryWastage) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={inventoryWastage.id}>
                    {productsColumns.map((column) => {
                      const value = inventoryWastage[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={
                            column.className && typeof column.className === "function"
                              ? column.className(value)
                              : column.className
                          }
                        >
                          {column.format ? column.format(value, inventoryWastage) : value}
                        </TableCell>
                      );
                    })}
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

export default ViewStockManagementDetails;
