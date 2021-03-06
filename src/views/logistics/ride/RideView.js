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
  FormControl,
  MenuItem,
  ListItemText,
  TextField,
  Modal,
  Typography,
  Box,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  FormHelperText,
} from "@material-ui/core";
import TableHeader from "../../../components/TableHeader";
import axios from "axios";
import { getURL, dateFormat, digitize, dividerDateFormatForFilter } from "../../../utils/common";
import { Alert, Pagination } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/EditOutlined";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { debounce } from "lodash";
import { DEBOUNCE_CONST } from "../../../Config";
import MessageSnackbar from "../../../components/MessageSnackbar";
import { Select } from "@material-ui/core";
import TableStatsHeader from "../../../components/TableStatsHeader";
import { useNavigate } from "react-router";
import fileDownload from "js-file-download";
import moment from "moment-timezone";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SelectDropdown from "../../../components/SelectDropdown";
import SelectCustomDropdown from "../../../components/SelectCustomDropdown";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { gridColumnLookupSelector } from "@material-ui/data-grid";
import qs from "qs";
import history from "../../../utils/history";
import { useLocation } from "react-router-dom";

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
  formControl: {
    minWidth: 160,
    boxSizing: "border-box",
    paddingLeft: "8px",
  },
  placeholderText: {
    color: "#CAC9C9",
    "& .MuiSelect-outlined": {
      paddingTop: "0px",
      paddingBottom: "0px",
      // height: '10px',
    },
  },
  dropdownListItem: {
    fontSize: 12,
    // paddingBottom: 10,
  },
  buttonDate: {
    color: "#FFFFFF",
    backgroundColor: "blue",
    "&:hover": {
      color: "white",
      backgroundColor: "blue",
    },
  },
  filtered: {
    display: "flex",
  },
}));

export default function RideView(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const columns = [
    {
      id: "id",
      label: "LOAD ID",
      minWidth: "auto",
      className: "",
    },
    {
      id: "status",
      label: "STATUS",
      minWidth: 100,
      className: "",
      format: (value) => value,
    },
    {
      id: "customerId",
      label: "COMPANY",
      minWidth: 100,
      className: "",
      format: (value, entity) => entity.Customer.name,
    },
    {
      id: "driverId",
      label: "DRIVER",
      minWidth: 100,
      className: "",
      format: (value, entity) => (entity.Driver ? entity.Driver.name : "-"),
    },

    {
      id: "vehicleId",
      label: "VEHICLE NO.",
      minWidth: "auto",
      className: "",
      format: (value, entity) => (entity.Vehicle ? entity.Vehicle.registrationNumber : "-"),
    },
    {
      id: "vendorName",
      label: "VENDOR",
      minWidth: 100,
      className: "",
      format: (value, entity) => (entity.Driver ? entity.Driver.Vendor.name : "-"),
    },

    {
      id: "pickupDate",
      label: "PICKUP DATE",
      minWidth: 150,
      className: "",
      format: dateFormat,
    },

    {},
    {
      id: "actions",
      label: "ACTIONS",
      minWidth: 120,
      className: "",
      format: (value, entity) => [
        <VisibilityIcon key="view" style={{ cursor: "pointer" }} onClick={() => navigate(`view/${entity.id}`)} />,
        <EditIcon
          key="edit"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("create", {
              state: {
                selectedRide: entity,
              },
            })
          }
        />,
      ],
    },
  ];

  const divStyle = {
    fontSize: 15,
    display: "inline-table",
    paddingRight: 20,
  };

  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [rides, setRides] = useState([]);

  const [statuses, setStatuses] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [formErrors, setFormErrors] = useState("");
  const [addRideViewOpen, setAddRideViewOpen] = useState(false);
  const [deleteRideViewOpen, setDeleteRideViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [stats, setStats] = useState([]);
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
  const [startDate, setStartDate] = useState(dividerDateFormatForFilter(null));
  const [endDate, setEndDate] = useState(dividerDateFormatForFilter(null));
  const [filteredCount, setFilteredCount] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [mounted, setMounted] = useState(false);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDay(null);
  };

  const deleteRide = (data) => {
    axios.delete(getURL(`ride/${selectedRide.id}`)).then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      closeDeleteRideView();
      getRides();
    });
  };

  const closeDeleteRideView = () => {
    setSelectedRide(null);
    setDeleteRideViewOpen(false);
  };

  const _getRides = (page, searchKeyword, currentFilter, selectedDay, startDate, endDate) => {
    getStats();
    axios
      .get(getURL("ride"), {
        params: {
          page,
          search: searchKeyword,
          status: currentFilter,
          days: selectedDay,
          start: startDate,
          end: endDate,
        },
      })
      .then((res) => {
        setPageCount(res.data.pages);
        setRides(res.data.data);
        setFilteredCount(res.data.count);
      });
  };

  const getRides = useCallback(
    debounce((page, searchKeyword, currentFilter, selectedDay, startDate, endDate) => {
      _getRides(page, searchKeyword, currentFilter, selectedDay, startDate, endDate);
    }, DEBOUNCE_CONST),
    []
  );

  const getRelations = () => {
    axios.get(getURL("ride/relations")).then((res) => {
      setStatuses(res.data.statuses);
    });
  };

  const getStats = () => {
    axios.get(getURL("ride/stats")).then((res) => {
      setStats(res.data.stats);
    });
  };

  // state persist start
  let location = useLocation();

  useEffect(() => {
    // if location.state means the user is navigating from another route other than ride. So clear the presisting filters.
    if (location.state) {
      return;
    }
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);

    if (filtersFromParams.currentFilter) {
      setCurrentFilter(filtersFromParams.currentFilter);
    }
    if (filtersFromParams.selectedDay) {
      setSelectedDay(filtersFromParams.selectedDay);
    }
    if (filtersFromParams.searchKeyword) {
      setSearchKeyword(filtersFromParams.searchKeyword);
    }
  }, []);

  // state persist end
  useEffect(() => {
    history.push(
      `/logistics/load?currentFilter=${currentFilter}&searchKeyword=${searchKeyword}&selectedDay=${
        selectedDay ? selectedDay : ""
      }`
    );

    getRides(
      page,
      searchKeyword,
      currentFilter == "ALL" ? "" : currentFilter,
      selectedDay == "custom" ? "" : selectedDay ? selectedDay : "",
      startDate == "-" ? "" : startDate,
      endDate == "-" ? "" : endDate
    );
  }, [page, searchKeyword, currentFilter, selectedDay, mounted]);

  useEffect(() => {
    getRelations();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [currentFilter]);

  useEffect(() => {
    if (currentFilter == "ALL") {
      setTotalProducts(stats[0]?.value);
    } else {
      <TableStatsHeader
        stats={stats}
        setCurrentFilter={setCurrentFilter}
        currentFilter={currentFilter}
        setTotalProducts={setTotalProducts}
      />;
    }
  });

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

  const [open, setOpen] = useState(false);

  const daysSelect = (
    <SelectCustomDropdown
      icon={<CalendarTodayOutlinedIcon fontSize="small" />}
      resetFilters={resetFilters}
      type="Days"
      name="Select Days"
      list={[{ name: "All" }, ...days]}
      selectedType={selectedDay}
      open={open}
      setOpen={setOpen}
      setSelectedType={setSelectedDay}
      setPage={setPage}
      startDate={startDate}
      endDate={endDate}
    />
  );

  const exportToExcel = () => {
    axios
      .get(getURL("ride/export"), {
        responseType: "blob",
        params: {
          page,
          search: searchKeyword,
          days: selectedDay == "custom" ? "" : selectedDay,
          start: startDate == "-" ? "" : startDate,
          end: endDate == "-" ? "" : endDate,
          status: currentFilter == "ALL" ? "" : currentFilter,
          client_Tz: moment.tz.guess(),
        },
      })
      .then((response) => {
        fileDownload(response.data, `Loads ${moment().format("DD-MM-yyyy")}.xlsx`);
      });
  };

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
      inputProps={{ min: startDate, max: dividerDateFormatForFilter(Date.now()) }}
      defaultValue={endDate}
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      margin="dense"
    />
  );

  const addRideButton = (
    <Button variant="contained" color="primary" size="small" onClick={() => navigate("/logistics/load/create")}>
      {" "}
      ADD LOAD
    </Button>
  );

  const exportButton = (
    <Button key={2} variant="contained" color="primary" size="small" onClick={() => exportToExcel()}>
      {" "}
      EXPORT TO EXCEL
    </Button>
  );

  const deleteRideModal = (
    <ConfirmDelete
      key={4}
      confirmDelete={deleteRide}
      open={deleteRideViewOpen}
      handleClose={closeDeleteRideView}
      selectedEntity={selectedRide && selectedRide.name}
      title={"Load"}
    />
  );

  const handleClose = () => {
    setOpen(false);
  };
  const customOption = (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Date Range"}</DialogTitle>
        <DialogContent>
          <ListItemText>{startDateRange}</ListItemText>
          <ListItemText>{endDateRange}</ListItemText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMounted(!mounted);
              handleClose();
            }}
            autoFocus
            className={classes.buttonDate}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const filterText =
    selectedDay || (selectedDay !== null && selectedDay !== undefined && startDate !== "-") ? (
      <FormHelperText style={divStyle}>
        Showing {filteredCount} filtered rides out of {totalProducts} rides
      </FormHelperText>
    ) : (
      " "
    );

  const topHeaderButtons = [addRideButton, deleteRideModal];
  const headerButtons = [filterText, searchInput, daysSelect, exportButton];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Loads" buttons={topHeaderButtons} />
        <TableStatsHeader
          stats={stats}
          setCurrentFilter={setCurrentFilter}
          currentFilter={currentFilter}
          setTotalProducts={setTotalProducts}
        />
        <TableHeader buttons={headerButtons} />
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
            {rides.map((ride) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={ride.id}>
                  {columns.map((column) => {
                    const value = ride[column.id];
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
                        {column.format ? column.format(value, ride) : value}
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
          />
        </Grid>
      </Grid>
      <MessageSnackbar showMessage={showMessage} />
      {customOption}
    </Paper>
  );
}
