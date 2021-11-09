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
  Tooltip,
  Typography,
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
  searchFilter: {
    // marginRight: 5,
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
    marginRight: 5
  }
}));

export default function ProductOutwardView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const columns = [
    {
      id: "id",
      label: "OUTWARD ID",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.internalIdForBusiness}`}>
            <Typography>
              {entity.internalIdForBusiness.length > 20
                ? `${entity.internalIdForBusiness.substring(0, 20)}...`
                : entity.internalIdForBusiness}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: "DispatchOrder.internalIdForBusiness",
      label: "DISPATCH ORDER ID",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.DispatchOrder.internalIdForBusiness}`}>
            <Typography>
              {entity.DispatchOrder.internalIdForBusiness.length > 20
                ? `${entity.DispatchOrder.internalIdForBusiness.substring(0, 20)}...`
                : entity.DispatchOrder.internalIdForBusiness}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: "Inventory.Company.name",
      label: "COMPANY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.DispatchOrder.Inventory.Company.name}`}>
            <Typography>
              {entity.DispatchOrder.Inventory.Company.name.length > 20
                ? `${entity.DispatchOrder.Inventory.Company.name.substring(0, 20)}...`
                : entity.DispatchOrder.Inventory.Company.name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      id: "Inventory.Warehouse.name",
      label: "WAREHOUSE",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.DispatchOrder.Inventory.Warehouse.name,
    },
    {
      id: "products",
      label: "NO. OF PRODUCTS",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.DispatchOrder.Inventories.length,
    },
    {
      id: "creator",
      label: "CREATED BY",
      minWidth: "auto",
      className: "",
      format: (value, entity) => `${entity.User.firstName || ""} ${entity.User.lastName || ""}`,
    },
    {
      id: "DispatchOrder.quantity",
      label: "Requested Quantity to Dispatch",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.DispatchOrder.quantity,
      // format: (value, entity, inventory) => inventory.OrderGroup.quantity
    },
    {
      id: "quantity",
      label: "Actual Quantity Dispatched",
      minWidth: "auto",
      className: "",
      // format: (value, entity, inventory) => inventory.dispatchedQuantity
    },
    {
      id: "DispatchOrder.shipmentDate",
      label: "EXPECTED SHIPMENT DATE",
      minWidth: "auto",
      className: "",
      format: (value, entity) => dateFormat(entity.DispatchOrder.shipmentDate),
    },
    {
      id: "createdAt",
      label: "ACTUAL DISPATCH DATE",
      minWidth: "auto",
      className: "",
      format: dateFormat,
    },
    {
      id: "actions",
      label: "",
      minWidth: "auto",
      className: "",
      format: (value, entity) => [
        <VisibilityIcon
          key="view"
          onClick={() =>
            navigate(`view/${entity.id}`, {
              state: {
                selectedProductOutward: entity,
              },
            })
          }
        />,
      ],
    },
  ];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [productOutwards, setProductOutwards] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProductOutward, setSelectedProductOutward] = useState(null);
  const [formErrors, setFormErrors] = useState("");
  const [deleteProductOutwardViewOpen, setDeleteProductOutwardViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null);

  const [searchFilter, setSearchFilter] = useState("Company.name");

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


  const deleteProductOutward = (data) => {
    axios.delete(getURL(`product-outward/${selectedProductOutward.id}`)).then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      closeDeleteProductOutwardView();
      getProductOutwards();
    });
  };

  const openDeleteView = (productOutward) => {
    setSelectedProductOutward(productOutward);
    setDeleteProductOutwardViewOpen(true);
  };

  const closeDeleteProductOutwardView = () => {
    setSelectedProductOutward(null);
    setDeleteProductOutwardViewOpen(false);
  };

  const _getProductOutwards = (page, searchKeyword, searchFilter, selectedDay, selectedDateRange, startDate, endDate) => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios.get(getURL("product-outward"), {
      params: {
        page, search: searchKeyword, days: !selectedDateRange ? selectedDay : null, startingDate: selectedDateRange ? startingDate : null, endingDate: selectedDateRange ? endingDate : null
      }
    }).then((res) => {
      setPageCount(res.data.pages);
      setProductOutwards(res.data.data);
    });
  };

  const getProductOutwards = useCallback(
    debounce((page, searchKeyword, searchFilter, selectedDay, selectedDateRange, startDate, endDate) => {
      _getProductOutwards(page, searchKeyword, searchFilter, selectedDay, selectedDateRange, startDate, endDate);
    }, DEBOUNCE_CONST),
    []
  );

  useEffect(() => {
    if ((selectedDay === 'custom' && !!selectedDateRange) || selectedDay !== 'custom') {
      getProductOutwards(page, searchKeyword, searchFilter, selectedDay, selectedDateRange, startDate, endDate);
    }
  }, [page, searchKeyword, selectedDay, reRender]);

  const exportToExcel = () => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios.get(getURL('product-outward/export'), {
      responseType: 'blob',
      params: {
        page, search: searchKeyword, days: !selectedDateRange ? selectedDay : null, startingDate: selectedDateRange ? startingDate : null, endingDate: selectedDateRange ? endingDate : null
        ,
        client_Tz: moment.tz.guess()
      },
    }).then(response => {
      FileDownload(response.data, `ProductOutwards ${moment().format('DD-MM-yyyy')}.xlsx`);
    });
  }

  const handleSearch = (e) => {
    setPage(1);
    setSearchKeyword(e.target.value);
  };

  const searchInput = (
    <>
      <InputBase
        placeholder="Search"
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        onChange={(e) => handleSearch(e)}
      />
    </>
  );

  const addProductOutwardButton = (
    <Button
      key={2}
      variant="contained"
      color="primary"
      size="small"
      // onClick={() => setAddProductOutwardViewOpen(true)}
      onClick={() => {
        navigate("create");
      }}
    >
      ADD PRODUCT OUTWARD
    </Button>
  );

  const deleteProductOutwardModal = (
    <ConfirmDelete
      key={4}
      confirmDelete={deleteProductOutward}
      open={deleteProductOutwardViewOpen}
      handleClose={closeDeleteProductOutwardView}
      selectedEntity={selectedProductOutward && selectedProductOutward.name}
      title={"ProductOutward"}
    />
  );

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

  const headerButtons = [searchInput, daysSelect, addProductOutwardButton, exportButton, deleteProductOutwardModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Product Outward" buttons={headerButtons} />
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
            {productOutwards.map((productOutward) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={productOutward.id}>
                  {columns.map((column) => {
                    const value = productOutward[column.id];
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
                        {column.format ? column.format(value, productOutward) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
                // productOutward.DispatchOrder.Inventories.map((inventory, idx) => {
                //   return (
                //     <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                //       {columns.map((column) => {
                //         const value = productOutward[column.id];
                //         return (
                //           <TableCell key={column.id} align={column.align}
                //             className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                //             {column.format ? column.format(value, productOutward, inventory) : value}
                //           </TableCell>
                //         );
                //       })}
                //     </TableRow>
                //   )
                // })
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
