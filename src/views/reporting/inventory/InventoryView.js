import { useEffect, useState } from 'react';
import {
    makeStyles,
    Paper,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    InputBase
} from '@material-ui/core';
import TableHeader from '../../administration/TableHeader'
import axios from 'axios';
import { getURL } from '../../../utils/common';
import Pagination from '@material-ui/lab/Pagination';
import { findByLabelText } from '@testing-library/dom';
import { Fragment } from 'react';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: 'transparent'
    },
    container: {
        maxHeight: 450,
        padding: 20,
    },
    pagination: {
        border: 'none',
    },
    active: {
        color: theme.palette.success.main
    },
    paginationContainer: {
        disply: 'flex',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    searchBar: {
        border: '1px solid grey',
        borderRadius: '6px',
    },
    searchContainer: {
        display: 'flex',
        justifyContent: 'spaceBetween',
    }
}));


export default function ProductInwardView() {
    const classes = useStyles();
    const columns = [{
        id: 'productName',
        label: 'PRODUCT NAME',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'customer',
        label: 'CUSTOMER NAME',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'warehouse',
        label: 'WAREHOUSE',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'uom',
        label: 'UOM',
        minWidth: 'auto',
        className: '',
    },
    {
        id: 'currentInventoryQty',
        label: 'CURRENT INVENTORY QUANTITY',
        minWidth: 'auto',
        className: '',
    }]

    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [brands, setBrands] = useState([]);
    const getBrands = (page = 1) => {
        axios.get(getURL('/brand'), { params: { page } })
            .then(res => {
                setPageCount(res.data.pages)
                setBrands(res.data.data)
            });
    }

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        getBrands(newPage);
    };
    useEffect(() => {
        getBrands();
    }, []);

    return (
        <>
            <Paper className={classes.root} elevation={0}>
                <TableContainer className={classes.container}>
                    <TableHeader title="Inventory" addButtonTitle="ADD INWARD" search={<SearchBar />} />
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
                            {brands.map((brand) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={brand.id}>
                                        {columns.map((column) => {
                                            const value = brand[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}
                                                    className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                    {column.format ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper >

            <Grid container className={classes.paginationContainer}>
                <Grid item>
                    <Pagination
                        component="div"
                        shape="rounded"
                        count={pageCount}
                        color="primary"
                        page={page}
                        className={classes.pagination}
                        onChange={handlePageChange}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </>
    );
}

const SearchBar = _ => {
    const classes = useStyles()
    return (
        <Fragment className={classes.searchContainer}>
            <Grid item>
                <InputBase className={classes.searchBar} placeholder="Product/Customer/Warehouse" />
            </Grid>
        </Fragment>
    )
}