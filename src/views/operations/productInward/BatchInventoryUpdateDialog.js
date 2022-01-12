import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  TextField,
  Select,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
  RadioGroup,
  RadioButtonGroup,
  Radio,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import {
  dateToPickerFormat,
  dividerDateFormat,
  // dateToPickerDayFormat,
} from "../../../utils/common";

const useStyles = makeStyles((theme) => ({
  parentContainer: {
    boxSizing: "border-box",
    padding: "30px 30px",
  },
  tableHeadTextBold: {
    background: "transparent",
    fontWeight: "bolder",
    fontSize: "12px",
  },
  tableHeadText: {
    // background: "transparent",
    fontWeight: "bolder",
    fontSize: "12px",
  },
  tableRow: {
    "&:last-child th, &:last-child td": {
      borderBottom: 0,
    },
  },
}));

const BatchInventoryUpdateDialog = ({
  productGroups,
  open,
  setOpen,
  batchData,
  localStates,
  handleAddedProducts,
  setLocalStates,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [selectedValue, setSelectedValue] = useState(null);

  const [prevSelectedStates, setPrevSelectedStates] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    const selectedBatchData = batchData.find(
      (data) => data.id == event.target.value
    );
    setPrevSelectedStates({
      batchNumber: selectedBatchData.batchNumber || localStates.batchNumber,
      expiryDate: selectedBatchData.expiryDate,
      manufacturingDate:
        selectedBatchData.manufacturingDate || localStates.manufacturingDate,
      generatedBatchName: selectedBatchData.batchName,
    });
  };

  return (
    <div>
      <Dialog
        // fullScreen={fullScreen}
        maxWidth="xl"
        open={open}
        // onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <Typography variant="h3" align="center" style={{ fontWeight: 600 }}>
            Product Inward
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TableContainer className={classes.parentContainer}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow className={classes.shadedTableHeader}>
                    <TableCell className={classes.tableHeadTextBold}>
                      PRODUCT NAME
                    </TableCell>
                    <TableCell className={classes.tableHeadTextBold}>
                      WAREHOUSE
                    </TableCell>
                    <TableCell className={classes.tableHeadTextBold}>
                      QUANTITY
                    </TableCell>
                    <TableCell className={classes.tableHeadTextBold}>
                      BATCH NUMBER
                    </TableCell>
                    <TableCell className={classes.tableHeadTextBold}>
                      MANUFACTURING DATE
                    </TableCell>
                    <TableCell className={classes.tableHeadTextBold}>
                      EXPIRY DATE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" className={classes.tableRow}>
                    <TableCell>
                      {localStates && localStates.product
                        ? localStates.product.name
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {localStates && localStates.warehouse
                        ? localStates.warehouse.name
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {localStates && localStates.quantity
                        ? localStates.quantity
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {localStates && localStates.batchNumber
                        ? localStates.batchNumber
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {localStates && localStates.manufacturingDate
                        ? dividerDateFormat(localStates.manufacturingDate)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {localStates && localStates.expiryDate
                        ? dividerDateFormat(localStates.expiryDate)
                        : "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {/* <Grid>&nbsp;</Grid> */}
            <Grid className={classes.parentContainer}>
              <Typography>
                Following record matches some of your data you have provided for
                the inward entry
              </Typography>
            </Grid>
            <TableContainer className={classes.parentContainer}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow className={classes.shadedTableHeader}>
                    <TableCell className={classes.tableHeadText}>
                      SELECT
                    </TableCell>
                    <TableCell className={classes.tableHeadText}>
                      BATCH NAME
                    </TableCell>
                    <TableCell className={classes.tableHeadText}>
                      BATCH NUMBER
                    </TableCell>
                    <TableCell className={classes.tableHeadText}>
                      MANUFACTURING DATE
                    </TableCell>
                    <TableCell className={classes.tableHeadText}>
                      EXPIRY DATE
                    </TableCell>
                    <TableCell className={classes.tableHeadText}>
                      AVAILABLE QUANTITY
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batchData
                    ? batchData.map((batch, idx) => {
                      return (
                        <TableRow hover role="checkbox" key={idx}>
                          <TableCell>
                            <Radio
                              checked={selectedValue == batch.id}
                              onChange={handleChange}
                              value={batch.id}
                              name="radio-buttons"
                              inputProps={{ "aria-label": batch.id }}
                            />
                          </TableCell>
                          <TableCell>
                            {batch ? batch.batchName : "-"}
                          </TableCell>
                          <TableCell>
                            {batch ? batch.batchNumber : "-"}
                          </TableCell>
                          <TableCell>
                            {batch
                              ? dividerDateFormat(batch.manufacturingDate)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {batch
                              ? dividerDateFormat(batch.expiryDate)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {batch ? batch.availableQuantity : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                    : ""}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid className={classes.parentContainer}>
              <Typography>
                <strong>Note:</strong> Selected existing entry will be updated
                with the batch number of the new data being updated if the batch
                number was empty
              </Typography>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ marginBottom: 20 }}>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="default"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            // autoFocus
            onClick={() => {
              // console.log("debug", prevSelectedStates);
              setLocalStates(prevSelectedStates);
              handleClose();
            }}
            color="primary"
            variant="contained"
          >
            Update Existing Entry
          </Button>
          <Button
            onClick={() => {
              handleAddedProducts();
              handleClose();
            }}
            color="primary"
            // autoFocus
            // color="primary"
            variant="contained"
          >
            Create New Entry
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BatchInventoryUpdateDialog;
