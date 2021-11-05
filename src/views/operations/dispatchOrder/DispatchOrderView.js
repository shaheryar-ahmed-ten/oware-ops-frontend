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
  Backdrop,
  Typography,
  Tooltip,
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
import { getURL, dateFormat, dividerDateFormatForFilter } from "../../../utils/common";
import { Alert, Pagination } from "@material-ui/lab";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { debounce } from "lodash";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { DEBOUNCE_CONST } from "../../../Config";
import MessageSnackbar from "../../../components/MessageSnackbar";
import { useNavigate } from "react-router";
import clsx from "clsx";
import EditIcon from "@material-ui/icons/EditOutlined";
import CancelIcon from "@material-ui/icons/Cancel";
import SelectDropdown from '../../../components/SelectDropdown';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment-timezone';
import FileDownload from 'js-file-download';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

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
  pendingStatusButtonStyling: {
    backgroundColor: "#FFEEDB",
    color: "#F69148",
    borderRadius: "10px",
  },
  partialStatusButtonStyling: {
    backgroundColor: "#F0F0F0",
    color: "#7D7D7D",
    width: "100%",
    borderRadius: "10px",
  },
  fullfilledStatusButtonStyling: {
    backgroundColor: "#EAF7D5",
    color: "#69A022",
    borderRadius: "10px",
  },
  canceledStatusButtonStyling: {
    backgroundColor: "rgba(255, 132, 0,0.3)",
    color: "#FF8700",
    borderRadius: "10px",
  },
  tableCellStyle: {
    color: "#383838",
    fontSize: 14,
    display: "table-cell",
    textAlign: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  backdropGrid: {
    backgroundColor: "white",
    padding: "18px 18px",
    boxSizing: "border-box",
    borderRadius: "4px",
    color: "black",
  },
  backdropTitle: {
    fontSize: 24,
    marginBottom: 18,
  },
  backdropAgreeButton: {
    marginLeft: 10,
  },
  bulkBtn: {
    marginLeft: 5
  },
  exportBtn: {
    marginLeft: 5
  },
  placeholderText: {
    color: "#CAC9C9",
    '& .MuiSelect-outlined': {
      paddingTop: '6px',
      paddingBottom: '6px',
    },
    marginLeft: 5
  },
}));

export default function DispatchOrderView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [entityToBeCanceled, setEntityToBeCanceled] = useState("");

  const columns = [
    {
      id: "id",
      label: "DISPATCH ORDER ID",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.internalIdForBusiness}`}>
            <Typography>
              {entity.internalIdForBusiness.length > 20 ? `${entity.internalIdForBusiness.substring(0, 20)}...` : entity.internalIdForBusiness}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      id: "Inventory.Company.name",
      label: "COMPANY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.Inventory.Company.name}`} >
            <Typography>
              {entity.Inventory.Company.name > 20 ? `${entity.Inventory.Company.name.substring(0, 20)}...` : entity.Inventory.Company.name}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      id: "Inventory.Warehouse.name",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.Inventory.Warehouse.name,
    },
    {
      id: "Inventories.length",
      label: "NO. OF PRODUCTS",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.Inventories.length,
    },
    {
      id: "creator",
      label: "CREATED BY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => `${entity.User.firstName || ''} ${entity.User.lastName || ''}`,
    },
    {
      id: "shipmentDate",
      label: "SHIPMENT DATE",
      minWidth: "auto",
      className: "",
      format: (value, entity) => dateFormat(entity.shipmentDate),
    },
    {
      id: "referenceid",
      label: "REFERENCE ID",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.referenceId}`}>
            <Typography>

              {entity.referenceId && entity.referenceId.length > 20 ? `${entity.referenceId.substring(0, 20)}...` : entity.referenceId || ''}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      id: "status",
      label: "STATUS",
      maxWidth: 150,
      className: classes.tableCellStyle,
      format: (value, entity) => {
        return entity.status == 0 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.pendingStatusButtonStyling)}>
            Pending
          </Button>
        ) : entity.status == 1 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
            Partially fulfilled
          </Button>
        ) : entity.status == 2 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
            Fulfilled
          </Button>
        ) : entity.status == 3 ? (
          <Button color="primary" className={clsx(classes.statusButtons, classes.canceledStatusButtonStyling)}>
            Canceled
          </Button>
        ) : (
          ""
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      className: "",
      format: (value, entity) => {
        return [
          <VisibilityIcon key="view" onClick={() => navigate(`view/${entity.id}`)} style={{ cursor: "pointer" }} />,
          entity.status != 3 ? (
            <EditIcon key="edit" onClick={() => navigate(`edit/${entity.id}`)} style={{ cursor: "pointer" }} />
          ) : (
            ""
          ),
          entity.status != 3 && entity.status != 1 && entity.status != 2 ? (
            <CancelIcon
              style={{ cursor: "pointer" }}
              onClick={() => {
                setEntityToBeCanceled(entity.id);
                setOpenBackdrop(true);
              }}
            />
          ) : (
            ""
          ),
          <Backdrop className={classes.backdrop} open={openBackdrop} onClick={() => setOpenBackdrop(false)}>
            <Grid container xs={4} className={classes.backdropGrid} justifyContent="flex-end">
              <Grid item xs={12}>
                <Typography className={classes.backdropTitle}>Are you sure to cancel this order ?</Typography>
                <Button autoFocus variant="contained">
                  Cancel
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  color="primary"
                  className={classes.backdropAgreeButton}
                  onClick={() => cancelDispatchOrder(entityToBeCanceled)}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Backdrop>,
        ];
      },
    },
  ];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);
  const [formErrors, setFormErrors] = useState("");
  const [deleteDispatchOrderViewOpen, setDeleteDispatchOrderViewOpen] = useState(false);

  const [showMessage, setShowMessage] = useState(null);
  const [messageType, setMessageType] = useState('green');

  // filters
  const [filterStatus, setFilterStatus] = useState([
    {
      id: 2,
      name: 'Fulfilled'
    },
    {
      id: 1,
      name: 'Partially Fulfilled'
    },
    {
      id: 0,
      name: 'Pending'
    },
    {
      id: 3,
      name: 'Canceled'
    },
  ])
  const [selectedFilterStatus, setSelectedFilterStatus] = useState(null)

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [trackDateFilterOpen, setTrackDateFilterOpen] = useState(false)
  const [days] = useState([{
    id: 7,
    name: '7 days'
  }, {
    id: 14,
    name: '14 days'
  }, {
    id: 30,
    name: '30 days'
  }, {
    id: 60,
    name: '60 days'
  }])
  const [selectedDay, setSelectedDay] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState(false) // bool
  const [reRender, setReRender] = useState(false)

  const cancelDispatchOrder = (dispatchOrderId) => {
    axios
      .patch(getURL(`dispatch-order/cancel/${dispatchOrderId}`))
      .then((response) => {
        setShowMessage({
          message: "The dispatch order has been deleted successfully."
        })
        getDispatchOrders(page, searchKeyword);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteDispatchOrder = (data) => {
    axios.delete(getURL(`dispatch-order/${selectedDispatchOrder.id}`)).then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      closeDeleteDispatchOrderView();
      getDispatchOrders();
    });
  };

  const openDeleteView = (dispatchOrder) => {
    setSelectedDispatchOrder(dispatchOrder);
    setDeleteDispatchOrderViewOpen(true);
  };

  const closeDeleteDispatchOrderView = () => {
    setSelectedDispatchOrder(null);
    setDeleteDispatchOrderViewOpen(false);
  };

  const _getDispatchOrders = (page, searchKeyword, selectedFilterStatus) => {
    axios.get(getURL("dispatch-order"), { params: { page, search: searchKeyword.trim(), status: selectedFilterStatus } }).then((res) => {
      setPageCount(res.data.pages);
      setDispatchOrders(res.data.data);
    });
  };

  const getDispatchOrders = useCallback(
    debounce((page, searchKeyword, selectedFilterStatus) => {
      _getDispatchOrders(page, searchKeyword, selectedFilterStatus);
    }, DEBOUNCE_CONST),
    []
  );

  useEffect(() => {
    if (selectedFilterStatus)
      setSearchKeyword('')
    getDispatchOrders(page, searchKeyword, selectedFilterStatus);
  }, [page, searchKeyword, selectedFilterStatus]);

  const exportToExcel = () => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios.get(getURL('dispatch-order/export'), {
      responseType: 'blob',
      params: {
        page, search: searchKeyword, days: !selectedDateRange ? selectedDay : null, startingDate: selectedDateRange ? startingDate : null, endingDate: selectedDateRange ? endingDate : null
        ,
        client_Tz: moment.tz.guess()
      },
    }).then(response => {
      FileDownload(response.data, `DispatchOrders ${moment().format('DD-MM-yyyy')}.xlsx`);
    });
  }

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
      onChange={(e) => {
        resetFilters()
        setSearchKeyword(e.target.value)
      }}
    />
  );

  const addDispatchOrderButton = (
    <Button
      key={2}
      variant="contained"
      color="primary"
      size="small"
      // onClick={() => setAddDispatchOrderViewOpen(true)}
      onClick={() => navigate("create")}
    >
      ADD DISPATCH ORDER
    </Button>
  );

  const deleteDispatchOrderModal = (
    <ConfirmDelete
      key={4}
      confirmDelete={deleteDispatchOrder}
      open={deleteDispatchOrderViewOpen}
      handleClose={closeDeleteDispatchOrderView}
      selectedEntity={selectedDispatchOrder && selectedDispatchOrder.name}
      title={"DispatchOrder"}
    />
  );

  const addBulkProductsButton = (
    <Button
      key={4}
      variant="contained"
      color="primary"
      size="small"
      className={classes.bulkBtn}
      onClick={() => navigate("bulk-upload")}
    >
      Bulk Upload
    </Button>
  );

  const resetFilters = () => {
    setSelectedFilterStatus(null);
  }

  const exportButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    className={classes.exportBtn}
    onClick={() => exportToExcel()}
  > EXPORT TO EXCEL</Button >;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleChange = (event) => {
    // reset the local state to remove the helper text
    if (event.target.value !== 'custom' && selectedDateRange) {
      setSelectedDateRange(false)
    }
    setPage(1)
    setSelectedDay(event.target.value);
  };

  const daysSelect = <FormControl className={classes.formControl}>
    <Select
      value={selectedDay}
      variant="outlined"
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      className={classes.placeholderText}
      startAdornment={
        <InputAdornment position="start" classes={{ positionStart: classes.inputAdronmentStyle, root: classes.inputAdronmentStyle }}>
          <CalendarTodayOutlinedIcon fontSize="small" />
        </InputAdornment>
      }
      onOpen={() => setTrackDateFilterOpen(true)}
      onClose={() => setTrackDateFilterOpen(false)}
    >
      <MenuItem value={null} disabled>
        <span className={classes.dropdownListItem}>Select Days</span>
      </MenuItem>
      {
        [{ name: 'All' }, ...days].map((item, idx) => {
          return (
            <MenuItem key={idx} value={item.id}>
              <span className={classes.dropdownListItem}>{item.name || ''}</span>
            </MenuItem>
          )
        })
      }
      <MenuItem key={'custom'} value={'custom'} onClick={() => { setOpenDialog(true) }}>
        <span className={classes.dropdownListItem}>{startDate !== "-" && startDate !== null && endDate !== null && !trackDateFilterOpen ? moment(startDate).format("DD/MM/YYYY") + " - " + moment(endDate).format("DD/MM/YYYY") : "Custom"}</span>
      </MenuItem>
    </Select>
  </FormControl>

  const startDateRange = <TextField
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

  const endDateRange = <TextField
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

  // status filter
  const statusSelect = <SelectDropdown icon={<MoreHorizIcon fontSize="small" />} type="Status" name="Select Status" list={[{ name: 'All' }, ...filterStatus]} selectedType={selectedFilterStatus} setSelectedType={setSelectedFilterStatus} setPage={setPage} />

  const headerButtons = [statusSelect, searchInput, addDispatchOrderButton, addBulkProductsButton, deleteDispatchOrderModal,];
  const headerButtonsTwo = [daysSelect, exportButton];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="" buttons={headerButtonsTwo} />
        <TableHeader title="Dispatch Order" buttons={headerButtons} />
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
                    // textAlign: "center",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dispatchOrders.map((dispatchOrder) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={dispatchOrder.id}>
                  {columns.map((column) => {
                    const value = dispatchOrder[column.id];
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
                        {column.format ? column.format(value, dispatchOrder) : value}
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
      <MessageSnackbar showMessage={showMessage} type={messageType} />

      <Dialog onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle>Choose Date</DialogTitle>
        <ListItem button key={'startDate'}>
          {startDateRange}
        </ListItem>
        <ListItem button key={'startDate'}>
          {endDateRange}
        </ListItem>
        <ListItem autoFocus button style={{ justifyContent: 'flex-end' }} >
          <Button variant="contained" color="primary"
            disabled={!startDate || !endDate}
            onClick={() => {
              setSelectedDateRange(true)
              setOpenDialog(false)
              setReRender(!reRender)
            }}>
            OK
          </Button>
        </ListItem>
      </Dialog>
    </Paper>
  );
}
