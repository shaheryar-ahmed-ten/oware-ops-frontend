import { useEffect, useState, useCallback } from 'react';
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
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader'
import axios from 'axios';
import { getURL, dateFormat, digitize } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { Select } from '@material-ui/core';
import TableStatsHeader from '../../../components/TableStatsHeader';
import { useNavigate } from 'react-router';
import fileDownload from 'js-file-download';
import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SelectDropdown from '../../../components/SelectDropdown';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: '20px'
  },
  container: {
    // maxHeight: 450,
    padding: 20,
  },
  active: {
    color: theme.palette.success.main
  },
  searchInput: {
    border: '1px solid grey',
    borderRadius: 4,
    opacity: 0.6,
    padding: '0px 8px',
    marginRight: 7,
    height: 30,
  },
  formControl: {
    minWidth: 160,
    boxSizing: 'border-box',
    paddingLeft: '8px'
  },
  placeholderText: {
    color: "#CAC9C9",
    '& .MuiSelect-outlined': {
      paddingTop: '7px',
      paddingBottom: '6px',
    },
  },
  dropdownListItem: {
    fontSize: 12,
  },
}));


export default function RideView() {
  const classes = useStyles();
  const navigate = useNavigate();

  const columns = [{
    id: 'id',
    label: 'RIDE ID',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'status',
    label: 'STATUS',
    minWidth: 100,
    className: '',
    format: value => statuses[value]
  }, {
    id: 'customerId',
    label: 'COMPANY',
    minWidth: 100,
    className: '',
    format: (value, entity) => entity.Customer.name
  }, {
    id: 'driverId',
    label: 'DRIVER',
    minWidth: 100,
    className: '',
    format: (value, entity) => entity.Driver ? entity.Driver.name : ''
  },
  // {
  //   id: 'driverPhone',
  //   label: 'Driver Phone',
  //   minWidth: 150,
  //   className: '',
  //   format: (value, entity) => entity.Driver ? entity.Driver.phone : ''
  // },
  //  {
  //   id: 'vehicleId',
  //   label: 'Vehicle',
  //   minWidth: 'auto',
  //   className: '',
  //   format: (value, entity) => entity.Vehicle.registrationNumber
  // },
  {
    id: 'vendorName',
    label: 'VENDOR',
    minWidth: 100,
    className: '',
    format: (value, entity) => entity.Driver ? entity.Driver.Vendor.name : ''
  }, {
    id: 'PickupArea',
    label: 'PICKUP AREA',
    maxWidth: 200,
    className: '',
    format: (value, entity) => `${entity.PickupArea.name}, ${entity.PickupArea.Zone.name}, ${entity.PickupArea.Zone.City.name}`
  },
  //  {
  //     id: 'pickupAddress',
  //     label: 'Pickup Address',
  //     minWidth: 'auto',
  //     className: ''
  // },
  // {
  //   id: 'pickupDate',
  //   label: 'Pickup date',
  //   minWidth: 150,
  //   className: '',
  //   format: dateFormat
  // },
  {
    id: 'DropoffArea',
    label: 'DROPOFF AREA',
    maxWidth: 200,
    className: '',
    format: (value, entity) => `${entity.DropoffArea.name}, ${entity.DropoffArea.Zone.name}, ${entity.DropoffArea.Zone.City.name}`
  },
  //  {
  //     id: 'dropoffAddress',
  //     label: 'Dropoff Address',
  //     minWidth: 'auto',
  //     className: ''
  // },
  {
    // id: 'RideProducts',
    // label: 'Product Category',
    // minWidth: 'auto',
    // className: '',
    // format: (value, entity) => value.length
    // }, {
    //     id: 'product.Category',
    //     label: 'Product Category',
    //     minWidth: 'auto',
    //     className: '',
    //     format: (value, entity) => entity.ProductCategory.name
    // }, {
    //     id: 'productName',
    //     label: 'Product Name',
    //     minWidth: 'auto',
    //     className: ''
    // }, {
    //     id: 'productQuantity',
    //     label: 'Product Quantity',
    //     minWidth: 'auto',
    //     className: ''
  }, {
    id: 'actions',
    label: '',
    minWidth: 120,
    className: '',
    format: (value, entity) =>
      [
        <VisibilityIcon key="view"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`view/${entity.id}`)} />,
        <EditIcon key="edit" style={{ cursor: 'pointer' }} onClick={() => navigate('create', {
          state: {
            selectedRide: entity
          }
        })}
        />,
        // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [rides, setRides] = useState([]);

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [productCategories, setProductCategories] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addRideViewOpen, setAddRideViewOpen] = useState(false);
  const [deleteRideViewOpen, setDeleteRideViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [stats, setStats] = useState([]);
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

  const resetFilters = () => {
    setSelectedDay(null);
  }



  const addRide = data => {
    let apiPromise = null;
    if (!selectedRide) apiPromise = axios.post(getURL('ride'), data);
    else apiPromise = axios.put(getURL(`ride/${selectedRide.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New ride has been created."
      })
      closeAddRideView(false);
      getRides();
    });
  };

  const deleteRide = data => {
    axios.delete(getURL(`ride/${selectedRide.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteRideView();
        getRides();
      });
  };

  const openEditView = ride => {
    setSelectedRide(ride);
    setAddRideViewOpen(true);
  }

  const openDeleteView = ride => {
    setSelectedRide(ride);
    setDeleteRideViewOpen(true);
  }

  const closeAddRideView = () => {
    setSelectedRide(null);
    setAddRideViewOpen(false);
  }

  const closeDeleteRideView = () => {
    setSelectedRide(null);
    setDeleteRideViewOpen(false);
  }

  const _getRides = (page, searchKeyword, currentFilter,selectedDay) => {
    getStats();
    axios.get(getURL('ride'), { params: { page, search: searchKeyword, status: currentFilter, days: selectedDay} })
      .then(res => {
        console.log(res)
        setPageCount(res.data.pages)
        setRides(res.data.data)
      });
  }
  // console.log("selectedDay",selectedDay)

  const getRides = useCallback(debounce((page, searchKeyword, currentFilter, selectedDay) => {
    _getRides(page, searchKeyword, currentFilter, selectedDay);
  }, DEBOUNCE_CONST), []);

  const getRelations = () => {
    axios.get(getURL('ride/relations'))
      .then(res => {
        setVehicles(res.data.vehicles);
        setDrivers(res.data.drivers);
        setStatuses(res.data.statuses);
        setAreas(res.data.areas);
        setCities(res.data.cities);
        setCompanies(res.data.companies);
        setProductCategories(res.data.productCategories);
      });
  };

  const getStats = () => {
    axios.get(getURL('ride/stats'))
      .then(res => setStats(res.data.stats));
  };

  useEffect(() => {
    getRides(page, searchKeyword, currentFilter == 'ALL' ? '' : currentFilter, selectedDay);
  }, [page, searchKeyword, currentFilter, selectedDay]);

  useEffect(() => {
    _getRides(page, selectedDay, searchKeyword, currentFilter == 'ALL' ? '' : currentFilter);
  }, [currentFilter]);

  useEffect(() => {
    getRelations();
  }, []);

  const searchInput = <InputBase
    placeholder="Search"
    className={classes.searchInput}
    id="search"
    label="Search"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;

  const filters = { ALL: 'ALL', ...statuses };

  const filterDropdown = <FormControl className={classes.formControl}>
    <Select
      value={currentFilter}
      onChange={(e) => { setCurrentFilter(e.target.value) }}
      variant="outlined"
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      className={classes.placeholderText}
    >
      {Object.keys(filters).map(key => (
        <MenuItem value={key} key={key}>
          <ListItemText primary={filters[key]} classes={{ root: classes.dropdownListItem }} />
        </MenuItem>
      ))}
    </Select>
  </FormControl >

  const daysSelect = <SelectDropdown icon={<CalendarTodayOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Days" name="Select Days" list={[{ name: 'All' }, ...days]} selectedType={selectedDay} setSelectedType={setSelectedDay} setPage={setPage} />

  const exportToExcel = () => {
    axios.get(getURL('ride/export'), {
      responseType: 'blob',
      params: { page, search: searchKeyword ,days:selectedDay},
    }).then(response => {
      fileDownload(response.data, `Rides ${moment().format('DD-MM-yyyy')}.xlsx`);
    });
  }

  const addRideButton = <Button
    variant="contained"
    color="primary"
    size="small"
    // onClick={() => setAddRideViewOpen(true)}>ADD RIDE</Button>;
    onClick={() => navigate('/logistics/ride/create')}> ADD RIDE</Button >;

  const exportButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => exportToExcel()
    }> EXPORT TO EXCEL</Button >;

  const deleteRideModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteRide}
    open={deleteRideViewOpen}
    handleClose={closeDeleteRideView}
    selectedEntity={selectedRide && selectedRide.name}
    title={"Ride"}
  />

  const topHeaderButtons = [addRideButton, deleteRideModal];
  const headerButtons = [daysSelect,searchInput, exportButton];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Rides" buttons={topHeaderButtons} />
        <TableStatsHeader stats={stats} setCurrentFilter={setCurrentFilter} currentFilter={currentFilter} />
        <TableHeader title={currentFilter === 'ALL' ? filterDropdown : ''} buttons={headerButtons} />
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}
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
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
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
          // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
      <MessageSnackbar showMessage={showMessage} />
    </Paper>
  );
}
