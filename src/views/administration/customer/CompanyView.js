import { useCallback, useEffect, useState } from "react";
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
  Tooltip,
  Typography
} from "@material-ui/core";
import TableHeader from "../../../components/TableHeader";
import axios from "axios";
import { getURL, dateFormat, dividerDateFormatForFilter, digitize } from '../../../utils/common';
import { Alert, Pagination } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/EditOutlined";
import ConfirmDelete from "../../../components/ConfirmDelete";
import AddCompanyView from "./AddCompanyView";
import CompanyDetailsView from "./CompanyDetailsView";
import { capitalize, debounce } from "lodash";
import MessageSnackbar from "../../../components/MessageSnackbar";
import { DEBOUNCE_CONST } from "../../../Config";
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
  },
}));

export default function CompanyView({ relationType }) {
  const pageHeadTitle = capitalize(`${relationType}s`);
  const classes = useStyles();
  const columns = [
    {
      id: "internalIdForBusiness",
      label: "ID",
      minWidth: "auto",
      className: "",
    },
    ...(relationType == "VENDOR"
      ? [
          {
            id: "name",
            label: "Vendor",
            minWidth: "auto",
            className: "",
            format: (value, entity) => {
              return (
                <Tooltip title={`${entity.name}`}>
                  <Typography>
                    {entity.name.length > 15
                      ? `${entity.name.substring(0, 15)}...`
                      : entity.name}
                  </Typography>
                </Tooltip>
              );
            },
          },
        ]
      : [
          {
            id: "name",
            label: "Company",
            minWidth: "auto",
            className: "",
            format: (value, entity) => {
              return (
                <Tooltip title={`${entity.name}`}>
                  <Typography>
                    {entity.name.length > 15
                      ? `${entity.name.substring(0, 15)}...`
                      : entity.name}
                  </Typography>
                </Tooltip>
              );
            },
          },
        ]),
    //  {
    //   id: 'name',
    //   label: 'Company',
    //   minWidth: 'auto',
    //   className: '',
    // },
    ...(relationType == "CUSTOMER"
      ? [
          {
            id: "type",
            label: "Company Type",
            minWidth: "auto",
            className: "",
          },
        ]
      : []),
    {
      id: "firstName",
      label: "Contact Name",
      minWidth: "auto",
      className: "",
      format: (value, entity) => `${entity.Contact.firstName} ${entity.Contact.lastName}`,
    },
    {
      id: "Contact.email",
      label: "Contact Email",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.Contact.email,
      // }, {
      //   id: 'Contact.phone',
      //   label: 'Contact Phone',
      //   minWidth: 'auto',
      //   className: '',
      //   format: (value, entity) => entity.Contact.phone
    },
    {
      id: "isActive",
      label: "Status",
      minWidth: "auto",
      className: (value) => (value ? classes.active : ""),
      format: (value) => (value ? "Active" : "In-Active"),
    },
    // {
    //   id: 'notes',
    //   label: 'Notes',
    //   minWidth: 'auto',
    //   className: '',
    // },
    {
      id: "actions",
      label: "Actions",
      minWidth: "auto",
      className: "",
      format: (value, entity) => [
        <VisibilityIcon key="view" onClick={() => openViewDetails(entity)} />,
        <EditIcon
          key="edit"
          onClick={() => {
            openEditView(entity);
            setIsEdit(true);
          }}
        />,
        // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
      ],
    },
  ];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formErrors, setFormErrors] = useState("");
  const [addCompanyViewOpen, setAddCompanyViewOpen] = useState(false);
  const [deleteCompanyViewOpen, setDeleteCompanyViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [companyDetailsView, setCompanyDetailsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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


  const removeCurrentLogoId = () => {
    const _selectedCompany = { ...selectedCompany };
    _selectedCompany.logoId = null;
    setSelectedCompany(_selectedCompany);
    // return false;

    // Call UPDATE API HERE
  };

  const addCompany = (data) => {
    let apiPromise = null;
    if (!selectedCompany) apiPromise = axios.post(getURL(`company/${relationType}`), data);
    else apiPromise = axios.put(getURL(`company/${relationType}/${selectedCompany.id}`), data);
    apiPromise
      .then((res) => {
        if (!res.data.success) {
          setFormErrors(
            <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
              {res.data.message}
            </Alert>
          );
          return;
        }
        setShowMessage({
          message: `${relationType == "CUSTOMER" ? ` Company` : ` Vendor`} has been ${
            !!selectedCompany ? "updated" : "created"
          }.`,
        });
        closeAddCompanyView();
        getCompanies();
      })
      .catch((error) => {
        console.info("error", error);
      });
  };

  const deleteCompany = (data) => {
    axios.delete(getURL(`company/${relationType}/${selectedCompany.id}`)).then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      closeDeleteCompanyView();
      getCompanies();
    });
  };
  const openViewDetails = (driver) => {
    setSelectedCompany(driver);
    setCompanyDetailsView(true);
  };

  const closeCompanyDetailsView = () => {
    setCompanyDetailsView(false);
    setSelectedCompany(null);
  };

  const openEditView = (customer) => {
    setSelectedCompany(customer);
    setAddCompanyViewOpen(true);
  };

  const openDeleteView = (customer) => {
    setSelectedCompany(customer);
    setDeleteCompanyViewOpen(true);
  };

  const closeAddCompanyView = () => {
    setSelectedCompany(null);
    setAddCompanyViewOpen(false);
  };

  const closeDeleteCompanyView = () => {
    setSelectedCompany(null);
    setDeleteCompanyViewOpen(false);
  };

  const _getCompanies = (page, searchKeyword, selectedDay, selectedDateRange, startDate, endDate) => {

    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios.get(getURL(`company/${relationType}`), { params: { 
      page, search: searchKeyword, days: !selectedDateRange ? selectedDay : null, startingDate: selectedDateRange ? startingDate : null, endingDate: selectedDateRange ? endingDate : null 
    } }).then((res) => {
      setPageCount(res.data.pages);
      setCompanies(res.data.data);
    });
  };

  const getCompanies = useCallback(
    debounce((page, searchKeyword,selectedDay, selectedDateRange, startDate, endDate) => {
      _getCompanies(page, searchKeyword,selectedDay, selectedDateRange, startDate, endDate);
    }, DEBOUNCE_CONST),
    []
  );

  const getRelations = () => {
    axios.get(getURL(`company/${relationType}/relations`)).then((res) => {
      setUsers(res.data.users);
      setCustomerTypes(res.data.customerTypes);
    });
  };

  useEffect(() => {
    if ((selectedDay === 'custom' && !!selectedDateRange) || selectedDay !== 'custom') {
      getCompanies(page, searchKeyword, selectedDay, selectedDateRange, startDate, endDate);
    }
  }, [page, searchKeyword, selectedDay, reRender]);

  useEffect(() => {
    getRelations();
  }, []);

  const exportToExcel = () => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios.get(getURL(`company/${relationType}/export`), {
      responseType: 'blob',
      params: {
        page, search: searchKeyword, days: !selectedDateRange ? selectedDay : null, startingDate: selectedDateRange ? startingDate : null, endingDate: selectedDateRange ? endingDate : null
        ,
        client_Tz: moment.tz.guess()
      },
    }).then(response => {
      FileDownload(response.data, relationType == "CUSTOMER" ? `Company ${moment().format('DD-MM-yyyy')}.xlsx`: `Vendor ${moment().format('DD-MM-yyyy')}.xlsx`);
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
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  );
  const addCompanyButton = (
    <Button
      key={2}
      variant="contained"
      color="primary"
      size="small"
      onClick={() => {
        setAddCompanyViewOpen(true);
        setIsEdit(false);
      }}
    >
      {relationType == "CUSTOMER" ? "ADD COMPANY" : "ADD VENDOR"}
    </Button>
  );
  const addCompanyModal = (
    <AddCompanyView
      key={3}
      formErrors={formErrors}
      users={users}
      relationType={relationType}
      customerTypes={customerTypes}
      selectedCompany={selectedCompany}
      open={addCompanyViewOpen}
      addCompany={addCompany}
      handleClose={() => closeAddCompanyView()}
      removeLogoId={() => removeCurrentLogoId()}
      isEdit={isEdit}
    />
  );
  const deleteCompanyModal = (
    <ConfirmDelete
      key={4}
      confirmDelete={deleteCompany}
      open={deleteCompanyViewOpen}
      handleClose={closeDeleteCompanyView}
      selectedEntity={selectedCompany && selectedCompany.name}
      title={"Company"}
    />
  );
  const companyDetailsViewModal = (
    <CompanyDetailsView
      relationType={relationType}
      selectedCompany={selectedCompany}
      open={companyDetailsView}
      handleClose={closeCompanyDetailsView}
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

  const headerButtons = [addCompanyButton, exportButton,addCompanyModal, deleteCompanyModal, companyDetailsViewModal];
  const headerButtonsTwo = [searchInput, daysSelect]

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title={relationType == "CUSTOMER" ? ` Company` : ` Vendor`} buttons={headerButtons} />
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
            {companies.map((customer) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={customer.id}>
                  {columns.map((column) => {
                    const value = customer[column.id];
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
                        {column.format ? column.format(value, customer) : value}
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
