import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  dateFormat,
  dividerDateFormat,
  dividerDateWithoutTimeFormat,
  getURL,
} from "../../../utils/common";
import PrintIcon from "@material-ui/icons/Print";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import owareLogo from "../../../assets/icons/oware-logo-black.png";

const useStyles = makeStyles((theme) => ({
  // tableHeaderContainer: {
  //   // temporary right-to-left patch, waiting for
  //   // https://github.com/bvaughn/react-virtualized/issues/454
  //   "& .makeStyles-tableHeadText-27": {
  //     padding: "4 !important",
  //   },
  // },
  parentContainer: {
    boxSizing: "border-box",
    padding: "30px 30px",
  },
  pageHeading: {
    fontWeight: 600,
    fontSize: "16px",
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
  subHeading: {
    fontWeight: 600,
    fontSize: "12px",
  },
  subHeadingMargin: {
    fontWeight: 600,
    fontSize: "12px",
    marginTop: -15,
  },
  valueMargin: {
    fontSize: "12px",
    marginTop: -15,
  },
  value: {
    fontSize: "12px",
  },
  valueMid: {
    border: "none",
    fontSize: "12px",
  },
  topColumn: {
    fontWeight: 600,
    fontSize: "12px",
  },
  topColumn1: {
    fontWeight: 600,
    fontSize: "12px",
   textAlign: "center",
  },
  tablePadding: {
    // padding: "4px !important",
    height: "20px !important",
  },
}));

function InwardProductDetailsView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { uid } = useParams();
  const [selectedProductInward, setSelectedProductInward] = useState(null);

  const topColumns = [
    {
      id: "productName",
      label: "PRODUCT NAME",
      minWidth: "auto",
      className: classes.topColumn,
      colSpan: "6",
      style: classes.value,
      format: (value, product, batch) => product.name || "-",
    },
    {
      id: "weight",
      label: "PRODUCT WEIGHT(KG)",
      minWidth: "auto",
      colSpan: "2",
      align: "center",
      className: classes.topColumn,
      style: classes.value,
      format: (value, product, batch) =>
        product.weight ? product.weight.toFixed(1) : "-",
    },
    {
      id: "totalBatchQuantity",
      label: "TOTAL QUANTITY",
      minWidth: "auto",
      colSpan: "2",
      align: "center",
      className: classes.topColumn,
      style: classes.value,
      format: (value, product, batch) => product.totalBatchQuantity,
    },
    {
      id: "uom",
      label: "UOM",
      minWidth: "auto",
      colSpan: "2",
      align: "center",
      className: classes.topColumn1,
      style: classes.value,
      format: (value, product, batch) => product.UOM?.name || "-",
    },
  ];

  const midColumns = [
    {
      id: "batchNumber1",
      label: "",
      colSpan: "4",
      minWidth: "auto",
      format: (value) => " ",
      // className: classes.topColumn,
      style: classes.valueMid,
    },
    {
      id: "batchNumber",
      label: "BATCH NUMBER",
      minWidth: "auto",
      colSpan: "2",
      className: classes.topColumn,
      style: classes.valueMid,
    },
    {
      id: "quantity",
      label: "QUANTITY",
      minWidth: "auto",
      colSpan: "2",
      align: "center",
      className: classes.topColumn,
      style: classes.valueMid,
      format: (value, product, batch) => {
        return batch &&
          batch.InwardGroup &&
          batch.InwardGroup[0] &&
          batch.InwardGroup[0].InwardGroupBatch
          ? batch.InwardGroup[0].InwardGroupBatch.quantity
          : 0;
      },
    },
    {
      id: "manufacturingDate",
      label: "MANUFACTURING DATE",
      minWidth: "auto",
      colSpan: "2",
      align: "center",
      className: classes.topColumn,
      style: classes.valueMid,
      format: (value, product, batch) =>
        batch.manufacturingDate
          ? dividerDateWithoutTimeFormat(batch.manufacturingDate)
          : "-",
    },
    {
      id: "expiryDate",
      label: "EXPIRY DATE",
      minWidth: "auto",
      colSpan: "2",
      align: "center",
      className: classes.topColumn,
      style: classes.valueMid,
      format: (value, product, batch) =>
        batch.expiryDate ? dividerDateWithoutTimeFormat(batch.expiryDate) : "-",
    },
  ];

  useEffect(() => {
    if (!selectedProductInward) {
      fetchInwardOrders();
    }
  }, [uid]);

  const fetchInwardOrders = () => {
    _getProductInwards();
  };

  const getProductQuantity = (product) => {
    let totalQuantity = 0;
    product?.InwardGroup?.InventoryDetail?.forEach((_x) => {
      totalQuantity = totalQuantity + _x.availableQuantity;
    });
    return totalQuantity;
  };

  const _getProductInwards = () => {
    axios.get(getURL(`product-inward/${uid}`)).then((res) => {
      let {
        data: { data: _data },
      } = res;

      const __data = {
        ..._data,
        Products: _data.Products.map((_pr) => ({
          ..._pr,
          totalBatchQuantity: getProductQuantity(_pr),
        })),
      };
      setSelectedProductInward(__data);
    });
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return selectedProductInward ? (
    <>
      <Box display="none" displayPrint="block" ref={componentRef}>
        <Box
          display="none"
          displayPrint="block"
          style={{ padding: "5mm 5mm 0mm 5mm" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img
                style={{ width: "40%", margin: "20px 0px" }}
                src={owareLogo}
              />
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                marginTop: 25,
                textAlign: "right",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {/* <Box display="block" displayPrint="block"> */}
              {`Date: ${dateFormat(selectedProductInward.createdAt)}`}
              {/* </Box> */}
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: -26 }}>
            <Grid item xs={6}>
              <Typography variant="h3" className={classes.pageHeading}>
                Goods Recieved Note
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h3"
                className={classes.pageHeading}
                style={{ textAlign: "right" }}
              >
                {selectedProductInward.internalIdForBusiness}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box
          display="none"
          displayPrint="block"
          style={{ padding: "5mm 5mm 0mm 5mm" }}
        >
          <Grid container spacing={2} style={{ marginTop: -20 }}>
            <Grid item xs={3} className={classes.subHeading}>
              <Box display="block" displayPrint="block">
                Reference Id :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.value}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.referenceId
                  ? selectedProductInward.referenceId
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeading}>
              <Box display="block" displayPrint="block">
                Vehicle Type :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.value}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.vehicleType
                  ? selectedProductInward.vehicleType
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeadingMargin}>
              <Box display="block" displayPrint="block">
                Company Name :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.valueMargin}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.Company.name}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeadingMargin}>
              <Box display="block" displayPrint="block">
                Vehicle Name :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.valueMargin}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.vehicleName
                  ? selectedProductInward.vehicleName
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeadingMargin}>
              <Box display="block" displayPrint="block">
                Warehouse :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.valueMargin}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.Warehouse.name}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeadingMargin}>
              <Box display="block" displayPrint="block">
                Vehicle Number :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.valueMargin}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.vehicleNumber
                  ? selectedProductInward.vehicleNumber
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeadingMargin}>
              <Box display="block" displayPrint="block">
                Created by :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.valueMargin}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.User.firstName +
                  ` ` +
                  selectedProductInward.User.lastName}
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.subHeadingMargin}>
              <Box display="block" displayPrint="block">
                Driver Name :
              </Box>
            </Grid>
            <Grid item xs={3} className={classes.valueMargin}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.driverName
                  ? selectedProductInward.driverName
                  : "-"}
              </Box>
            </Grid>
            <Grid container item xs={12} justifyContent="space-between"></Grid>
          </Grid>

          <TableContainer>
            <Table
              stickyHeader
              aria-label="sticky table"
              // style={{ width: "100%" }}
              // style={{ padding: "4px !important" }}
              // className={classes.tableHeaderContainer}
              // headerHeight={30}
              // rowHeight={30}
            >
              <TableHead>
                <TableRow>
                  {topColumns.map((column, idx) => {
                    return (
                      <TableCell
                        key={idx}
                        className={column.className}
                        colSpan={column.colSpan}
                        align={column.center}
                      >
                        {column.label}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              {selectedProductInward.Products.map((product, idx) => {
                return (
                  <>
                    <TableBody>
                      <TableRow
                        className={classes.tableRow}
                        // style={{ backgroundColor: "purple" }}
                      >
                        {topColumns.map((column, idx) => {
                          var value = product[column.id];
                          return (
                            <TableCell
                              key={idx}
                              className={column.style}
                              colSpan={column.colSpan}
                              align={column.align}
                            >
                              {column.format
                                ? column.format(value, product)
                                : value || "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableBody>
                    {/* <TableContainer
                      style={{
                        width: "100%",
                        backgroundColor: "red",
                        borderWidth: 3,
                      }}
                    > */}
                    {/* <Table
                      style={{
                        backgroundColor: "transparent",
                        // marginRight: 123,
                        marginLeft: 40,
                        // width: "120%",
                      }}
                    > */}
                    <TableHead>
                      <TableRow className={classes.tableRow}>
                        {midColumns.map((column, idx) => {
                          return (
                            <TableCell
                              key={idx}
                              className={column.className}
                              colSpan={column.colSpan}
                              align={column.align}
                            >
                              {column.label}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.InwardGroup.InventoryDetail.map((batch, idx) => {
                        return (
                          <TableRow
                            className={classes.tableRow}
                            // style={{ backgroundColor: "blue" }}
                          >
                            {midColumns.map((column, idx) => {
                              var value = batch[column.id];
                              return (
                                <TableCell
                                  key={idx}
                                  className={column.style}
                                  colSpan={column.colSpan}
                                  align={column.align}
                                >
                                  {column.format
                                    ? column.format(value, product, batch)
                                    : value || "-"}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </>
                );
              })}
            </Table>
          </TableContainer>

          <Grid container item xs={12} justifyContent="space-between">
            <Grid item xs={12} className={classes.subHeading}>
              <Box display="block" displayPrint="block">
                Memo :
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.value}
              // style={{ border: "1px solid black" }}
            >
              <Box display="block" displayPrint="block">
                {selectedProductInward.memo ? selectedProductInward.memo : "-"}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid container item xs={12} justifyContent="space-between">
          <Grid item xs={11}>
            <Typography variant="h3" className={classes.heading}>
              Product Inward Details
              <IconButton aria-label="print" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/operations/product-inward")}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadText}>
                  INWARD ID
                </TableCell>
                <TableCell className={classes.tableHeadText}>COMPANY</TableCell>
                <TableCell className={classes.tableHeadText}>
                  WAREHOUSE
                </TableCell>
                {selectedProductInward.vehicleType ? (
                  <TableCell className={classes.tableHeadText}>
                    VEHICLE TYPE
                  </TableCell>
                ) : (
                  ""
                )}
                {selectedProductInward.vehicleName ? (
                  <TableCell className={classes.tableHeadText}>
                    VEHICLE NAME
                  </TableCell>
                ) : (
                  ""
                )}
                {selectedProductInward.vehicleNumber ? (
                  <TableCell className={classes.tableHeadText}>
                    VEHICLE NUMBER
                  </TableCell>
                ) : (
                  ""
                )}
                {selectedProductInward.driverName ? (
                  <TableCell className={classes.tableHeadText}>
                    DRIVER NAME
                  </TableCell>
                ) : (
                  ""
                )}
                <TableCell className={classes.tableHeadText}>
                  CREATED BY
                </TableCell>
                <TableCell className={classes.tableHeadText}>
                  REFERENCE ID
                </TableCell>
                <TableCell className={classes.tableHeadText}>
                  INWARD DATE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role="checkbox" className={classes.tableRow}>
                <TableCell>
                  {selectedProductInward.internalIdForBusiness}
                </TableCell>
                <TableCell>{selectedProductInward.Company.name}</TableCell>
                <TableCell>{selectedProductInward.Warehouse.name}</TableCell>
                {selectedProductInward.vehicleType ? (
                  <TableCell>{selectedProductInward.vehicleType}</TableCell>
                ) : (
                  ""
                )}
                {selectedProductInward.vehicleName ? (
                  <TableCell>{selectedProductInward.vehicleName}</TableCell>
                ) : (
                  ""
                )}
                {selectedProductInward.vehicleNumber ? (
                  <TableCell>{selectedProductInward.vehicleNumber}</TableCell>
                ) : (
                  ""
                )}
                {selectedProductInward.driverName ? (
                  <TableCell>{selectedProductInward.driverName}</TableCell>
                ) : (
                  ""
                )}

                <TableCell>
                  {selectedProductInward.User.firstName +
                    ` ` +
                    selectedProductInward.User.lastName}
                </TableCell>
                <TableCell>{selectedProductInward.referenceId}</TableCell>
                <TableCell>
                  {dateFormat(selectedProductInward.createdAt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {selectedProductInward.memo ? (
          <TableContainer
            className={classes.parentContainer}
            style={{ paddingTop: 0 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeadText}>MEMO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.tableRow}>
                  <TableCell>{selectedProductInward.memo}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ""
        )}

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell className={classes.tableHeadText}>
                  PRODUCT NAME
                </TableCell>
                <TableCell className={classes.tableHeadText}>
                  QUANTITY
                </TableCell>
                <TableCell className={classes.tableHeadText}>UOM</TableCell>
                <TableCell className={classes.tableHeadText}>
                  BATCH NUMBER
                </TableCell>
                <TableCell className={classes.tableHeadText}>
                  MANUFACTURING DATE
                </TableCell>
                <TableCell className={classes.tableHeadText}>
                  EXPIRY DATE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {console.log(selectedProductInward.Products)} */}
              {selectedProductInward.Products.map((product) => {
                return product.InwardGroup.InventoryDetail.map(
                  (batch, index) => {
                    return (
                      <TableRow hover role="checkbox" key={index}>
                        {/* {console.log(batch)} */}
                        <TableCell>{product ? product.name : "-"}</TableCell>
                        <TableCell>
                          {batch &&
                          batch.InwardGroup &&
                          batch.InwardGroup[0] &&
                          batch.InwardGroup[0].InwardGroupBatch
                            ? batch.InwardGroup[0].InwardGroupBatch.quantity
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {product && product.UOM ? product.UOM.name : "-"}
                        </TableCell>
                        <TableCell>
                          {batch ? batch.batchNumber || "-" : "-"}
                        </TableCell>
                        <TableCell>
                          {batch
                            ? dividerDateFormat(batch.manufacturingDate)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {batch ? dividerDateFormat(batch.expiryDate) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  }
                );

                // );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  ) : null;
}

export default InwardProductDetailsView;
