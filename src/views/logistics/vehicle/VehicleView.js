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
    TableRow
} from '@material-ui/core';
import React, { useState, useCallback, useEffect } from 'react'
import TableHeader from '../../../components/TableHeader';
import { Alert, Pagination } from '@material-ui/lab';
import MessageSnackbar from '../../../components/MessageSnackbar';
import AddVehicleView from './AddVehicleView';
import VehicleDetailsView from './VehicleDetailsView';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';


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
}))
function VehicleView() {
    const classes = useStyles();
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const columns = [{
        id: 'registrationNumber',
        label: 'Registration Number',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'Vehicle.vendorName',
        label: 'Vendor Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Vendor ? entity.Vendor.name : ''
    },
    {
        id: 'Vehicle.cars',
        label: 'Vehicle Type',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Car ? entity.Car.CarMake.name + " " + entity.Car.CarModel.name : ''
    },
    // {
    //     id: 'RoutePermit',
    //     label: 'Route Permit',
    //     minWidth: 'auto',
    //     className: '',
    //     format: (value, entity) => value ?
    //         <a target="_blank" href={getURL('preview/' + `${value.id}`)}>{value.originalName}</a>
    //         : ''
    // },
    // {
    //     id: 'RunningPaper',
    //     label: 'Running Paper',
    //     minWidth: 'auto',
    //     className: '',
    //     format: (value, entity) => value ?
    //         <a target="_blank" href={getURL('preview/' + `${value.id}`)}>{value.originalName}</a>
    //         : ''
    // },
    {
        id: 'actions',
        label: 'Actions',
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

    const [vehicles, setVehicles] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState('');
    const [showMessage, setShowMessage] = useState(null)
    const [addVehicleView, setAddVehicleView] = useState(false)
    const [vehicleDetailsView, setVehicleDetailsView] = useState(false)
    const [formErrors, setFormErrors] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [drivers, setDrivers] = useState([])
    const [vendors, setVendors] = useState([])
    const [cars, setCars] = useState([])

    const addVehicle = (data) => {
        let apiPromise = null;
        if (!selectedVehicle) apiPromise = axios.post(getURL('vehicle'), data);
        else apiPromise = axios.put(getURL(`vehicle/${selectedVehicle.id}`), data);
        apiPromise.then(res => {
            if (!res.data.success) {
                setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
                return
            }
            setShowMessage({
                message: `Vehicle has been ${!selectedVehicle ? 'created' : 'updated'}.`
            })
            closeAddVehicleViewModal(false);
            getVehicles();
        });
    }

    // handle view open functions
    const openEditView = (vehicle) => {
        setSelectedVehicle(vehicle)
        setAddVehicleView(true)
    }
    const openViewDetails = (vehicle) => {
        setSelectedVehicle(vehicle)
        setVehicleDetailsView(true)
    }
    // close functions
    const closeAddVehicleViewModal = () => {
        setSelectedVehicle(null)
        setAddVehicleView(false)
    }
    const closeVehicleDetailsView = () => {
        setVehicleDetailsView(false)
        setSelectedVehicle(null)
    }
    // constants views
    const addVehicleButton = <Button
        key={2}
        variant="contained"
        color="primary"
        size="small"
        onClick={() => { setAddVehicleView(true) }}
    >ADD VEHICLE</Button>;

    const addVehicleViewModal = <AddVehicleView
        key={3}
        selectedVehicle={selectedVehicle}
        companies={vendors}
        drivers={drivers}
        cars={cars}
        formErrors={formErrors}
        addVehicle={addVehicle}
        open={addVehicleView}
        handleClose={closeAddVehicleViewModal} />;

    const vehicleDetailsViewModal = <VehicleDetailsView
        selectedVehicle={selectedVehicle}
        open={vehicleDetailsView}
        handleClose={closeVehicleDetailsView} />;

    const _getVehicles = (page, searchKeyword) => {
        axios.get(getURL('vehicle'), { params: { page, search: searchKeyword } })
            .then(res => {
                setPageCount(res.data.pages)
                setVehicles(res.data.data)
            });
    }

    const getVehicles = useCallback(debounce((page, searchKeyword) => {
        _getVehicles(page, searchKeyword);
    }, DEBOUNCE_CONST), []);

    const getRelations = () => {
        axios.get(getURL('vehicle/relations'))
            .then(res => {
                setVendors(res.data.vendors)
                setDrivers(res.data.drivers)
                setCars(res.data.cars)
            });
    };

    useEffect(() => {
        getVehicles(page, searchKeyword);
    }, [page, searchKeyword]);

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
    const headerButtons = [searchInput, addVehicleButton, addVehicleViewModal, vehicleDetailsViewModal]
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Vehicles" buttons={headerButtons} />
                <Table aria-label="sticky table">
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
                        {vehicles.map((vehicle) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={vehicle.id}>
                                    {columns.map((column) => {
                                        const value = vehicle[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}
                                                className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                {column.format ? column.format(value, vehicle) : value}
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
    )
}

export default VehicleView
