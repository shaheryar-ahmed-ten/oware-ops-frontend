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
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import AddDriverView from './AddDriverView';
import DriverDetailsView from './DriverDetailsView';


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
function DriverView() {
    const classes = useStyles();
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const columns = [{
        id: 'Driver.name',
        label: 'Driver Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.name
    },
    {
        id: 'Driver.Vendor.name',
        label: 'Vendor Name',
        minWidth: 'auto',
        className: '',
        format: (value, entity) => entity.Vendor.name
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
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [addDriverView, setAddDriverView] = useState(false)
    const [driverDetailsView, setDriverDetailsView] = useState(false)

    // handle view open functions
    const openEditView = (driver) => {
        setSelectedDriver(driver)
        setAddDriverView(true)
    }
    const openViewDetails = (driver) => {
        setSelectedDriver(driver)
        setDriverDetailsView(true)
    }
    // close functions
    const closeaddDriverViewModal = () => {
        setAddDriverView(false)
    }
    const closeDriverDetailsView = () => {
        setDriverDetailsView(false)
    }
    // constants views
    const addDriverButton = <Button
        key={2}
        variant="contained"
        color="primary"
        size="small"
        onClick={() => { setAddDriverView(true) }}
    >ADD DRIVER</Button>;

    const addDriverViewModal = <AddDriverView
        key={3}
        selectedDriver={selectedDriver}
        Vendors={[]}
        formErrors={formErrors}
        open={addDriverView}
        handleClose={closeaddDriverViewModal} />;

    const driverDetailsViewModal = <DriverDetailsView
        selectedDriver={selectedDriver}
        open={driverDetailsView}
        handleClose={closeDriverDetailsView} />;


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
    const headerButtons = [searchInput, addDriverButton, addDriverViewModal, driverDetailsViewModal]
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Drivers" buttons={headerButtons} />
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

export default DriverView
