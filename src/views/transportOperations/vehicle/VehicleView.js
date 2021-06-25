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
import React, { useState } from 'react'
import TableHeader from '../../TableHeader';
import { Pagination } from '@material-ui/lab';
import MessageSnackbar from '../../../components/MessageSnackbar';
import AddVehicleView from './AddVehicleView';
import VehicleDetailsView from './VehicleDetailsView';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';

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
        id: 'Vehicle.registerNumber',
        label: 'Registration Number',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.registerNumber
    },
    {
        id: 'Vehicle.vendorName',
        label: 'Vendor Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.vendorName
    },
    {
        id: 'Vehicle.make',
        label: 'Make',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.make
    },
    {
        id: 'Vehicle.model',
        label: 'Model',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.model
    }, {
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
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showMessage, setShowMessage] = useState(null)
    const [addVehicleView, setAddVehicleView] = useState(false)
    const [vehicleDetailsView, setVehicleDetailsView] = useState(false)
    const [formErrors, setFormErrors] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
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
        setAddVehicleView(false)
    }
    const closeVehicleDetailsView = () => {
        setVehicleDetailsView(false)
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
        Vendors={[]}
        Drivers={[]}
        Makes={[]}
        Models={[]}
        Years={[]}
        formErrors={formErrors}
        open={addVehicleView}
        handleClose={closeAddVehicleViewModal} />;

    const vehicleDetailsViewModal = <VehicleDetailsView
        selectedVehicle={selectedVehicle}
        open={vehicleDetailsView}
        handleClose={closeVehicleDetailsView} />;

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
