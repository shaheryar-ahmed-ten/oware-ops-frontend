import { useEffect, useState, useCallback } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  InputBase,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  TextField,
  ListItem,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import TableHeader from "../../../components/TableHeader";
import axios from "axios";
import { getURL, dividerDateFormatForFilter } from "../../../utils/common";
import { Alert, Pagination } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import ConfirmDelete from "../../../components/ConfirmDelete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddWarehouseView from "./AddWarehouseView";
import WarehouseDetailsView from "./WarehouseDetailsView";
import { debounce } from "lodash";
import { DEBOUNCE_CONST } from "../../../Config";
import MessageSnackbar from "../../../components/MessageSnackbar";
import moment from "moment-timezone";
import FileDownload from "js-file-download";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "20px",
  },
  container: {
    // maxHeight: 450,
    padding: 20,
  },
  active: {
    color: theme.palette.success.main,
  },
  searchInput: {
    border: "1px solid grey",
    borderRadius: 4,
    opacity: 0.6,
    padding: "0px 8px",
    marginRight: 7,
    height: 30,
  },
  exportBtn: {
    marginLeft: 5,
  },
  placeholderText: {
    color: "#CAC9C9",
    "& .MuiSelect-outlined": {
      paddingTop: "6px",
      paddingBottom: "6px",
    },
    marginRight: 5,
  },
}));

export default function WarehouseView() {
  const classes = useStyles();
  const columns = [
    {
      id: "name",
      label: "Name",
      minWidth: "auto",
      className: "",
    },
    {
      id: "businessWarehouseCode",
      label: "Business Warehouse Code",
      minWidth: "auto",
      className: "",
    },
    {
      id: "address",
      label: "Address",
      minWidth: "auto",
      className: "",
    },
    {
      id: "city",
      label: "City",
      minWidth: "auto",
      className: "",
      format: (value) => cities && cities.find((c) => c.id == value) ? cities.find((c) => c.id == value).name || '' : ''
    },
    {
      id: "isActive",
      label: "Status",
      minWidth: "auto",
      className: (value) => (value ? classes.active : ""),
      format: (value) => (value ? "Active" : "In-Active"),
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: "auto",
      className: "",
      format: (value, entity) => [
        <VisibilityIcon key="view" onClick={() => openViewDetails(entity)} />,
        <EditIcon key="edit" onClick={() => openEditView(entity)} />,
      ],
    },
  ];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formErrors, setFormErrors] = useState("");
  const [addWarehouseViewOpen, setAddWarehouseViewOpen] = useState(false);
  const [deleteWarehouseViewOpen, setDeleteWarehouseViewOpen] = useState(false);
  const [warehouseDetailsView, setWarehouseDetailsView] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [trackDateFilterOpen, setTrackDateFilterOpen] = useState(false);
  const [days] = useState([
    {
      id: 7,
      name: "7 days",
    },
    {
      id: 14,
      name: "14 days",
    },
    {
      id: 30,
      name: "30 days",
    },
    {
      id: 60,
      name: "60 days",
    },
  ]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(false); // bool
  const [reRender, setReRender] = useState(false);
  const [cities, setCities] = useState([])

  function getCities() {
    axios.get(getURL("warehouse/relations"))
      .then((res) => {
        setCities(res.data.cities)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  const addWarehouse = (data) => {
    let apiPromise = null;
    if (!selectedWarehouse) apiPromise = axios.post(getURL("warehouse"), data);
    else apiPromise = axios.put(getURL(`warehouse/${selectedWarehouse.id}`), data);
    apiPromise.then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      setShowMessage({
        message: !selectedWarehouse ? "New Warehouse has been created." : "The Warehouse has been updated.",
      });
      closeAddWarehouseView(false);
      getWarehouses();
    });
  };

  const deleteWarehouse = (data) => {
    axios.delete(getURL(`warehouse/${selectedWarehouse.id}`)).then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      closeDeleteWarehouseView();
      getWarehouses();
    });
  };

  const openEditView = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setAddWarehouseViewOpen(true);
  };

  const openViewDetails = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseDetailsView(true);
  };

  const openDeleteView = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDeleteWarehouseViewOpen(true);
  };

  const closeAddWarehouseView = () => {
    setSelectedWarehouse(null);
    setAddWarehouseViewOpen(false);
  };

  const closeWarehouseDetailsView = () => {
    setWarehouseDetailsView(false);
    setSelectedWarehouse(null);
  };

  const closeDeleteWarehouseView = () => {
    setSelectedWarehouse(null);
    setDeleteWarehouseViewOpen(false);
  };

  const _getWarehouses = (page, searchKeyword, selectedDay, selectedDateRange, startDate, endDate) => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios
      .get(getURL("warehouse"), {
        params: {
          page,
          search: searchKeyword,
          days: !selectedDateRange ? selectedDay : null,
          startingDate: selectedDateRange ? startingDate : null,
          endingDate: selectedDateRange ? endingDate : null,
        },
      })
      .then((res) => {
        setPageCount(res.data.pages);
        setWarehouses(res.data.data);
      });
  };

  const getWarehouses = useCallback(
    debounce((page, searchKeyword, selectedDay, selectedDateRange, startDate, endDate) => {
      _getWarehouses(page, searchKeyword, selectedDay, selectedDateRange, startDate, endDate);
    }, DEBOUNCE_CONST),
    []
  );

  useEffect(() => {
    getCities();
  }, [])

  useEffect(() => {
    if ((selectedDay === "custom" && !!selectedDateRange) || selectedDay !== "custom") {
      getWarehouses(page, searchKeyword, selectedDay, selectedDateRange, startDate, endDate);
    }
  }, [page, searchKeyword, selectedDay, reRender]);

  const exportToExcel = () => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios
      .get(getURL("warehouse/export"), {
        responseType: "blob",
        params: {
          page,
          search: searchKeyword,
          days: !selectedDateRange ? selectedDay : null,
          startingDate: selectedDateRange ? startingDate : null,
          endingDate: selectedDateRange ? endingDate : null,
          client_Tz: moment.tz.guess(),
        },
      })
      .then((response) => {
        FileDownload(response.data, `Warehouse ${moment().format("DD-MM-yyyy")}.xlsx`);
      });
  };

  const searchInput = (
    <InputBase
      placeholder="Search"
      className={classes.searchInput}
      id="search"
      label="Search"
      type="text"
      variant="outlined"
      value={searchKeyword}
      key={1}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  );
  const addWarehouseButton = (
    <Button key={2} variant="contained" color="primary" size="small" onClick={() => setAddWarehouseViewOpen(true)}>
      ADD WAREHOUSE
    </Button>
  );
  const addWarehouseModal = (
    <AddWarehouseView
      key={3}
      formErrors={formErrors}
      selectedWarehouse={selectedWarehouse}
      open={addWarehouseViewOpen}
      addWarehouse={addWarehouse}
      handleClose={() => closeAddWarehouseView()}
      cities={cities}
    />
  );
  const deleteWarehouseModal = (
    <ConfirmDelete
      key={4}
      confirmDelete={deleteWarehouse}
      open={deleteWarehouseViewOpen}
      handleClose={closeDeleteWarehouseView}
      selectedEntity={selectedWarehouse && selectedWarehouse.name}
      title={"Warehouse"}
    />
  );
  const warehouseDetailsViewModal = (
    <WarehouseDetailsView
      key={5}
      selectedWarehouse={selectedWarehouse}
      open={warehouseDetailsView}
      handleClose={closeWarehouseDetailsView}
      cities={cities}
    />
  );
  const exportButton = (
    <Button
      key={2}
      variant="contained"
      color="primary"
      size="small"
      className={classes.exportBtn}
      onClick={() => exportToExcel()}
    >
      {" "}
      EXPORT TO EXCEL
    </Button>
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (event) => {
    // reset the local state to remove the helper text
    if (event.target.value !== "custom" && selectedDateRange) {
      setSelectedDateRange(false);
    }
    setPage(1);
    setSelectedDay(event.target.value);
  };

  const daysSelect = (
    <FormControl className={classes.formControl}>
      <Select
        value={selectedDay}
        variant="outlined"
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        className={classes.placeholderText}
        startAdornment={
          <InputAdornment
            position="start"
            classes={{ positionStart: classes.inputAdronmentStyle, root: classes.inputAdronmentStyle }}
          >
            <CalendarTodayOutlinedIcon fontSize="small" />
          </InputAdornment>
        }
        onOpen={() => setTrackDateFilterOpen(true)}
        onClose={() => setTrackDateFilterOpen(false)}
      >
        <MenuItem value={null} disabled>
          <span className={classes.dropdownListItem}>Select Days</span>
        </MenuItem>
        {[{ name: "All" }, ...days].map((item, idx) => {
          return (
            <MenuItem key={idx} value={item.id}>
              <span className={classes.dropdownListItem}>{item.name || ""}</span>
            </MenuItem>
          );
        })}
        <MenuItem
          key={"custom"}
          value={"custom"}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <span className={classes.dropdownListItem}>
            {startDate !== "-" && startDate !== null && endDate !== null && !trackDateFilterOpen
              ? moment(startDate).format("DD/MM/YYYY") + " - " + moment(endDate).format("DD/MM/YYYY")
              : "Custom"}
          </span>
        </MenuItem>
      </Select>
    </FormControl>
  );

  const startDateRange = (
    <TextField
      id="date"
      label="From"
      type="date"
      variant="outlined"
      className={classes.textFieldRange}
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      inputProps={{ max: endDate ? endDate : dividerDateFormatForFilter(Date.now()) }}
      defaultValue={startDate}
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      margin="dense"
    />
  );

  const endDateRange = (
    <TextField
      id="date"
      label="To"
      type="date"
      variant="outlined"
      className={classes.textFieldRange}
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      inputProps={{ min: startDate, max: dividerDateFormatForFilter(Date.now()) }}
      defaultValue={endDate}
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      margin="dense"
    />
  );
  const headerButtons = [
    addWarehouseButton,
    exportButton,
    addWarehouseModal,
    deleteWarehouseModal,
    warehouseDetailsViewModal,
  ];
  const headerButtonsTwo = [searchInput, daysSelect];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Warehouse" buttons={headerButtons} />
        <TableHeader title="" buttons={headerButtonsTwo} />
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
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
            {warehouses.map((warehouse) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={warehouse.id}>
                  {columns.map((column) => {
                    const value = warehouse[column.id];
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
                        {column.format ? column.format(value, warehouse) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justify="space-between">
        <Grid item></Grid>
        <Grid item>
          <Pagination
            component="div"
            shape="rounded"
            count={pageCount}
            color="primary"
            page={page}
            className={classes.pagination}
            onChange={(e, page) => setPage(page)}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
      <MessageSnackbar showMessage={showMessage} />

      <Dialog onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle>Choose Date</DialogTitle>
        <ListItem button key={"startDate"}>
          {startDateRange}
        </ListItem>
        <ListItem button key={"startDate"}>
          {endDateRange}
        </ListItem>
        <ListItem autoFocus button style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!startDate || !endDate}
            onClick={() => {
              setSelectedDateRange(true);
              setOpenDialog(false);
              setReRender(!reRender);
            }}
          >
            OK
          </Button>
        </ListItem>
      </Dialog>
    </Paper>
  );
}
