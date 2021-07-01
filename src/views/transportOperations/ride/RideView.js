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
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddRideView from './AddRideView';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { Select } from '@material-ui/core';
import TableStatsHeader from '../../../components/TableStatsHeader';

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
    const columns = [{
        id: 'id',
        label: 'RIDE ID',
        minWidth: 'auto',
        className: '',
        format: value => digitize(value, 6)
    }, {
        id: 'status',
        label: 'STATUS',
        minWidth: 'auto',
        className: '',
        format: value => statuses[value]
    }, {
        id: 'customerId',
        label: 'Customer',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Customer.name
    }, {
        id: 'driverId',
        label: 'Driver',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Driver.name
    }, {
        id: 'vehicleId',
        label: 'Vehicle',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Vehicle.registrationNumber
    }, {
        id: 'vendorName',
        label: 'Vendor',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Driver.Vendor.name
    }, {
        id: 'PickupArea',
        label: 'Pickup Area',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => `${entity.PickupArea.name}, ${entity.PickupArea.Zone.name}, ${entity.PickupArea.Zone.City.name}`
    }, {
        id: 'pickupAddress',
        label: 'Pickup Address',
        minWidth: 'auto',
        className: ''
    }, {
        id: 'pickupDate',
        label: 'Pickup date',
        minWidth: 'auto',
        className: '',
        format: dateFormat
    }, {
        id: 'DropoffArea',
        label: 'Dropoff Area',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => `${entity.DropoffArea.name}, ${entity.DropoffArea.Zone.name}, ${entity.DropoffArea.Zone.City.name}`
    }, {
        id: 'dropoffAddress',
        label: 'Dropoff Address',
        minWidth: 'auto',
        className: ''
    }, {
        id: 'dropoffDate',
        label: 'Dropoff date',
        minWidth: 'auto',
        className: '',
        format: dateFormat
    }, {
        id: 'RideProducts',
        label: 'Product Category',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => value.length
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
        minWidth: 'auto',
        className: '',
        format: (value, entity) =>
            [
                <EditIcon key="edit" onClick={() => openEditView(entity)} />,
                // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
            ]
    }];
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [rides, setRides] = useState([]);

    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [statuses, setStatuses] = useState([]);
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

    const addRide = data => {
        let apiPromise = null;
        if (!selectedRide) apiPromise = axios.post(getURL('/ride'), data);
        else apiPromise = axios.put(getURL(`/ride/${selectedRide.id}`), data);
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
        axios.delete(getURL(`/ride/${selectedRide.id}`))
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

    const _getRides = (page, searchKeyword, currentFilter) => {
        getStats();
        axios.get(getURL('/ride'), { params: { page, search: searchKeyword, status: currentFilter } })
            .then(res => {
                setPageCount(res.data.pages)
                setRides(res.data.data)
            });
    }

    const getRides = useCallback(debounce((page, searchKeyword, currentFilter) => {
        _getRides(page, searchKeyword, currentFilter);
    }, DEBOUNCE_CONST), []);

    const getRelations = () => {
        axios.get(getURL('/ride/relations'))
            .then(res => {
                setVehicles(res.data.vehicles);
                setDrivers(res.data.drivers);
                setStatuses(res.data.statuses);
                setAreas(res.data.areas);
                setCompanies(res.data.companies);
                setProductCategories(res.data.productCategories);
            });
    };

    const getStats = () => {
        axios.get(getURL('/ride/stats'))
            .then(res => setStats(res.data.stats));
    };

    useEffect(() => {
        getRides(page, searchKeyword, currentFilter == 'ALL' ? '' : currentFilter);
    }, [page, searchKeyword, currentFilter]);

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
    const addRideButton = <Button
        key={2}
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setAddRideViewOpen(true)}>ADD RIDE</Button>;
    const addRideModal = <AddRideView
        formErrors={formErrors}
        key={3}
        vehicles={vehicles}
        drivers={drivers}
        statuses={statuses}
        areas={areas}
        companies={companies}
        productCategories={productCategories}
        selectedRide={selectedRide}
        open={addRideViewOpen}
        addRide={addRide}
        handleClose={() => closeAddRideView()} />
    const deleteRideModal = <ConfirmDelete
        key={4}
        confirmDelete={deleteRide}
        open={deleteRideViewOpen}
        handleClose={closeDeleteRideView}
        selectedEntity={selectedRide && selectedRide.name}
        title={"Ride"}
    />

    const filterButtons = Object.keys(filters).map(key =>
        <Button key={key} variant="contained" onClick={(e) => { setCurrentFilter(key) }}
            color={key === currentFilter ? 'primary' : 'defualt'} >
            {filters[key]}
        </Button >
    );
    const topHeaderButtons = [addRideButton, addRideModal, deleteRideModal];
    const headerButtons = [searchInput];

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Rides" buttons={topHeaderButtons} />
                <TableStatsHeader stats={stats} filterButtons={filterButtons} />
                <TableHeader title={filterDropdown} buttons={headerButtons} />
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
