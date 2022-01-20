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
import { dateFormat, dividerDateFormat, dividerDateWithoutTimeFormat, getURL } from "../../../utils/common";
import PrintIcon from "@material-ui/icons/Print";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import owareLogo from "../../../assets/icons/oware-logo-black.png";

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
      className: "",
      format: (value, product, batch) => product.name || '-'
    },
    {
      id: "uom",
      label: "UOM",
      minWidth: "auto",
      className: "",
      format: (value, product, batch) => product.UOM?.name || '-'
    },
    {
      id: "weight",
      label: "PRODUCT WEIGHT",
      minWidth: "auto",
      className: "",
      format: (value, product, batch) => product.weight || '-'
    },
  ]

  const midColumns = [
    {
      id: "batchNumber",
      label: "BATCH NUMBER",
      minWidth: "auto",
      className: "",
    },
    {
      id: "quantity",
      label: "QUANTITY",
      minWidth: "auto",
      className: "",
      format: (value, product, batch) => product.InwardGroup?.quantity || 0
    },
    {
      id: "manufacturingDate",
      label: "MANUFACTURING DATE",
      minWidth: "auto",
      className: "",
      format: (value, product, batch) => batch.manufacturingDate ? dividerDateWithoutTimeFormat(batch.manufacturingDate) : '-',
    },
    {
      id: "expiryDate",
      label: "EXPIRY DATE",
      minWidth: "auto",
      className: "",
      format: (value, product, batch) => batch.expiryDate ? dividerDateWithoutTimeFormat(batch.expiryDate) : '-',
    },
  ]

  useEffect(() => {
    if (!selectedProductInward) {
      fetchInwardOrders();
    }
  }, [uid]);

  const fetchInwardOrders = () => {
    _getProductInwards();
  };

  const _getProductInwards = () => {
    axios.get(getURL(`product-inward/${uid}`)).then((res) => {
      setSelectedProductInward(
        res.data.data
      );
    });
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return selectedProductInward ? (
    <>
      <Box display="none" displayPrint="block" ref={componentRef} >
        <Box
          display="none"
          displayPrint="block"
          style={{ padding: "25mm 25mm 0mm 25mm" }}
        >
          <img style={{ width: "20%", margin: "20px 0px" }} src={owareLogo} />
          <Typography variant="h3">Inward Products</Typography>
        </Box>
        <Box
          display="none"
          displayPrint="block"
          style={{ padding: "10mm 25mm 0mm 25mm" }}
        >
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
                Company Name :
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
                Vehicle Type :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.vehicleType
                  ? selectedProductInward.vehicleType
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Vehicle Name :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.vehicleName
                  ? selectedProductInward.vehicleName
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Vehicle Number :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.vehicleNumber
                  ? selectedProductInward.vehicleNumber
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Driver Name :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.driverName
                  ? selectedProductInward.driverName
                  : "-"}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Created by :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.User.firstName +
                  ` ` +
                  selectedProductInward.User.lastName}
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
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                Memo :
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="block" displayPrint="block">
                {selectedProductInward.memo ? selectedProductInward.memo : "-"}
              </Box>
            </Grid>

            <Grid
              container
              item
              xs={12}
              justifyContent="space-between"
            >
            </Grid>
          </Grid>

          {
            selectedProductInward.Products.map((product, idx) => {
              return <>
                <TableContainer key={idx}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow >
                        {
                          topColumns.map((column, idx) => {
                            return (
                              <TableCell key={idx}>
                                {column.label}
                              </TableCell>
                            )
                          })
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow className={classes.tableRow}>
                        {
                          topColumns.map((column, idx) => {
                            var value = product[column.id]
                            return (
                              <TableCell key={idx}>
                                {
                                  column.format ?
                                    column.format(value, product)
                                    :
                                    value || '-'
                                }
                              </TableCell>
                            )
                          })
                        }
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer style={{ marginTop: 10, marginBottom: 50, boxSizing: 'border-box', padding: "2mm 0mm 2mm 6mm" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead style={{ backgroundColor: 'transparent' }}>
                      <TableRow className={classes.tableRow} style={{ backgroundColor: 'transparent' }}>
                        {
                          midColumns.map((column, idx) => {
                            return (
                              <TableCell key={idx} style={{ backgroundColor: 'transparent' }}>
                                {column.label}
                              </TableCell>
                            )
                          })
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        product.InwardGroup.InventoryDetail.map((batch, idx) => {
                          return <TableRow className={classes.tableRow}>
                            {
                              midColumns.map((column, idx) => {
                                var value = batch[column.id]
                                return (
                                  <TableCell key={idx}>
                                    {
                                      column.format ?
                                        column.format(value, product, batch)
                                        :
                                        value || '-'
                                    }
                                  </TableCell>
                                )
                              })
                            }
                          </TableRow>
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>

              </>
            })
          }


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
                <TableRow
                  className={classes.tableRow}
                >
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
                        <TableCell>{batch ? batch.batchNumber || "-" : "-"}</TableCell>
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


{/* <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
<Typography
  variant="h5"
  style={{ fontWeight: 700 }}
  className={classes.pageSubHeading}
>
  Product Details
</Typography>
</Grid>
{selectedProductInward.Products.map((product, idx) => {
return product.InwardGroup.InventoryDetail.map(
  (batch, index) => {
    return (
      <>
        <Grid
          container
          style={{ display: "inline-block", pageBreakBefore: 'always', pageBreakInside: 'always', pageBreakAfter: 'always' }}
          key={index}
        >
          <Grid
            container
            item
            xs={12}
            spacing={2}
            style={{ marginTop: 25, pageBreakBefore: 'always', pageBreakInside: 'always', pageBreakAfter: 'always' }}
          >
            <Grid style={{ fontWeight: 600 }} item xs={6}>
              Product Name:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                fontWeight: 600,
                transform: "translateX(-50px)",
              }}
            >
              {product ? product.name : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={6}>
              Product Weight:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                transform: "translateX(-50px)",
              }}
            >
              {product ? product.weight : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={6}>
              UOM:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                transform: "translateX(-50px)",
              }}
            >
              {product.UOM ? product.UOM.name : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={6}>
              Quantity:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                transform: "translateX(-50px)",
              }}
            >
              {product && product.InwardGroup
                ? product.InwardGroup.quantity
                : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={6}>
              Batch Number:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                transform: "translateX(-50px)",
              }}
            >
              {batch ? batch.batchNumber || "-" : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={6}>
              Manufacturing Date:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                transform: "translateX(-50px)",
              }}
            >
              {batch
                ? dividerDateFormat(batch.manufacturingDate)
                : "-"}
            </Grid>
            <Grid style={{ fontWeight: 500 }} item xs={6}>
              Expiry Date:
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                fontStyle: "italic",
                transform: "translateX(-50px)",
              }}
            >
              {batch
                ? dividerDateFormat(batch.expiryDate)
                : "-"}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
);
})} */}