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
    Select,
    MenuItem,
    InputLabel
} from '@material-ui/core';
import React, { useState } from 'react'
import TableHeader from '../../TableHeader';
import { Pagination } from '@material-ui/lab';
import MessageSnackbar from '../../../components/MessageSnackbar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import AddRideView from './AddRideView';
import RideDetailsView from './RideDetailsView';
import { dateFormat } from '../../../utils/common';

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
        minWidth: 120
    }
}))
function RideView() {
    const classes = useStyles();
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const columns = [{
        id: 'Ride.Customer.name',
        label: 'Customer Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Customer.name
    },
    {
        id: 'Ride.Driver.name',
        label: 'Driver Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Driver.name
    },
    {
        id: 'Ride.Driver.phone',
        label: 'Driver Phone',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Driver.phone
    },
    {
        id: 'Ride.Vehicle.number',
        label: 'Vehicle Number',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Vehicle.number
    },
    {
        id: 'Ride.Vendor.name',
        label: 'Vendor Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Vendor.name
    },
    {
        id: 'pickupDate',
        label: 'Pickup Date',
        minWidth: 'auto',
        className: '',
        format: dateFormat
    },
    {
        id: 'pickupTime',
        label: 'Pickup Time',
        minWidth: 'auto',
        className: '',
        format: dateFormat
    },
    {
        id: 'pickupArea',
        label: 'Pickup Area',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'dropoffArea',
        label: 'Dropoff Area',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'actions',
        label: '',
        minWidth: 'auto',
        className: '',
        format: (value, entity) =>
            [
                <VisibilityIcon key="view" onClick={() => openViewDetails(entity)} />,
                <EditIcon key="edit" onClick={() => openEditView(entity)} />,
                // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
            ]
    },
    ]
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showMessage, setShowMessage] = useState(null);
    const [formErrors, setFormErrors] = useState('');
    const [selectedRide, setSelectedRide] = useState(null);
    const [addRideView, setAddRideView] = useState(false)
    const [rideDetailsView, setRideDetailsView] = useState(false)
    const [status, setStatus] = useState('All')
    // handle view open functions
    const openEditView = (driver) => {
        setSelectedRide(driver)
        setAddRideView(true)
    }
    const openViewDetails = (driver) => {
        setSelectedRide(driver)
        setRideDetailsView(true)
    }
    // close functions
    const closeaddRideViewModal = () => {
        setAddRideView(false)
    }
    const closeRideDetailsView = () => {
        setRideDetailsView(false)
    }
    // constants views
    const addDriverButton = <Button
        key={2}
        variant="contained"
        color="primary"
        size="small"
        onClick={() => { setAddRideView(true) }}
    >ADD RIDE</Button>;

    const addRideViewModal = <AddRideView
        key={3}
        selectedRide={selectedRide}
        Vehicles={[]}
        PickupZones={[]}
        PickupAreas={[]}
        PickupCities={[]}
        DropoffZones={[]}
        DropoffAreas={[]}
        DropoffCities={[]}
        ProductCategories={[]}
        formErrors={formErrors}
        open={addRideView}
        handleClose={closeaddRideViewModal} />;

    const rideDetailsViewModal = <RideDetailsView
        selectedRide={selectedRide}
        open={rideDetailsView}
        handleClose={closeRideDetailsView} />;

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

    const statusFilter = <FormControl className={classes.formControl}>
        <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            onChange={(e) => { setStatus(e.target.value) }}
        >
            <MenuItem value='All'>Filter</MenuItem>
        </Select>
    </FormControl>
    const headerButtons = [searchInput, addDriverButton, addRideViewModal, rideDetailsViewModal]
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Rides" buttons={headerButtons} />
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
        </Paper>
    )
}

export default RideView
