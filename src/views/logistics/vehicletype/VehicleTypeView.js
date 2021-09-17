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
    Typography,
    Select,
    FormControl,
    InputLabel,
    MenuItem
} from '@material-ui/core';
import React, { useState, useCallback, useEffect } from 'react'
import TableHeader from '../../../components/TableHeader';
import { Alert, Pagination } from '@material-ui/lab';
import MessageSnackbar from '../../../components/MessageSnackbar';
import AddVehicleTypeView from './AddVehicleTypeView';
import VehicleTypeDetailsView from './VehicleTypeDetailsView';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import { isRequired } from '../../../utils/validators';
import { useNavigate } from 'react-router';
import { AirlineSeatLegroomReducedOutlined, SettingsBackupRestoreSharp } from '@material-ui/icons';


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
function VehicleTypeView() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [carName, setCarName] = useState('')
    const [pageCount, setPageCount] = useState(1);
    const [validation, setValidation] = useState({});
    const [carId, setCarId] = useState('')
    const [page, setPage] = useState(1);
    const [vehicles, setVehicles] = useState([]);
    const [showMessage, setShowMessage] = useState(null)
    const [addVehicleTypeView, setAddVehicleTypeView] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState('');
    const [makeid, setMakeId] = useState([])
    const [modelid, setModelId] = useState([])
    const [vehiclename, setVehicleName] = useState([])
    const [vehicletypes, setVehicleTypes] = useState()
    // const [car, setCarss] = useState([])
    const columns = [{
        id: 'Vehicle.carmodel',
        label: 'Car Model',
        minWidth: 'auto',
        className: '',
        // format: (value, entity) => entity.Car.CarModel.name? entity.Car.CarModel.name : ''
    },
    {
        id: 'Vehicle.carmake',
        label: 'Car Make',
        minWidth: 'auto',
        className: '',
        // format: (value, entity) => entity.Car.CarMake.name? entity.Car.CarMake.name : ''
    },
    {
        id: 'Vehicle.cars',
        label: 'Vehicle Type',
        minWidth: 'auto',
        className: '',
        // format: (value, entity) => entity.Car ? entity.Car.CarMake.name + " " + entity.Car.CarModel.name : ''
    },
    {
        id: 'Vehicle.name',
        label: 'Vehicle Name',
        minWidth: 'auto',
        className: '',
        // format: (value, entity) => entity.Car ? entity.Car.CarMake.name + " " + entity.Car.CarModel.name : ''
    },
    ]

    // const [vehicles, setVehicles] = useState([]);

    // const [searchKeyword, setSearchKeyword] = useState('');
    // const [showMessage, setShowMessage] = useState(null)
    // const [addVehicleTypeView, setAddVehicleTypeView] = useState(false)
    const [vehicleTypeDetailsView, setVehicleTypeDetailsView] = useState(false)
    const [formErrors, setFormErrors] = useState('');
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);

    // const [drivers, setDrivers] = useState([])
    // const [vendors, setVendors] = useState([])
    const [cars, setCars] = useState([])

    const addVehicleType = (data) => {
        let apiPromise = null;
        if (!selectedVehicleType) apiPromise = axios.post(getURL('vehicle-types'), data);
        else apiPromise = axios.put(getURL(`vehicle-types/${selectedVehicleType.id}`), data);
        apiPromise.then(res => {
            if (!res.data.success) {
                setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
                return
            }
            setShowMessage({
                message: `Vehicle Type has been ${!selectedVehicleType ? 'created' : 'updated'}.`
            })
            closeAddVehicleTypeViewModal(false);
            getVehicleTypes();
        });
    }

    // handle view open functions
    const openEditView = (vehicletype) => {
        setSelectedVehicleType(vehicletype)
        setAddVehicleTypeView(true)
    }
    const openViewDetails = (vehicletype) => {
        setSelectedVehicleType(vehicletype)
        setVehicleTypeDetailsView(true)
    }
    // close functions
    const closeAddVehicleTypeViewModal = () => {
        setSelectedVehicleType(null)
        setAddVehicleTypeView(false)
    }
    const closeVehicleTypeDetailsView = () => {
        setVehicleTypeDetailsView(false)
        setSelectedVehicleType(null)
    }

    const addVehicleTypeButton = <Button
        key={2}
        variant="contained"
        color="primary"
        size="small"
        onClick={() => { setAddVehicleTypeView(true) }}
    >ADD VEHICLE TYPE</Button>;

    const addVehicleTypeViewModal = <AddVehicleTypeView
        key={3}
        selectedVehicleType={selectedVehicleType}
        // companies={vendors}
        // drivers={drivers}
        cars={cars}
        formErrors={formErrors}
        addVehicleType={addVehicleType}
        open={addVehicleTypeView}
        handleClose={closeAddVehicleTypeViewModal} />;

    const vehicleTypeDetailsViewModal = <VehicleTypeDetailsView
        selectedVehicleType={selectedVehicleType}
        open={vehicleTypeDetailsView}
        handleClose={closeVehicleTypeDetailsView} />;

    const _getVehicleTypes = (page, searchKeyword) => {
        axios.get(getURL('vehicle-types'), { params: { page, search: searchKeyword } })
            .then(res => {
                setPageCount(res.data.pages)
                setVehicleTypes(res.data.data[0])
            });
    }
    const getVehicleTypes = useCallback(debounce((page, searchKeyword) => {
        _getVehicleTypes(page, searchKeyword);
    }, DEBOUNCE_CONST), []);

    const getRelations = () => {
        axios.get(getURL('vehicle-types'))
            .then(res => {
                console.log(res.data.data[0])
                console.log(vehicletypes)
                setCars(res.data.data[0].CarMake.name)
            });
    };

    useEffect(() => {
        getVehicleTypes(page, searchKeyword);
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

    const headerButtons = [searchInput, addVehicleTypeButton, addVehicleTypeViewModal, vehicleTypeDetailsViewModal]
    return(
        <Paper className={classes.root}>
        <TableContainer className={classes.container}>
            <TableHeader title="Vehicle Types" buttons={headerButtons} />
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
                    {vehicletypes?.map((vehicletype) => {
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={vehicletype.id}>
                                {columns.map((column) => {
                                    const value = vehicletype[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}
                                            className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                            {column.format ? column.format(value, vehicletype) : value}
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

export default VehicleTypeView