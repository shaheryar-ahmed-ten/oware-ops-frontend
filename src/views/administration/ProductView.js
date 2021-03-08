import { useEffect, useState } from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import TableHeader from './TableHeader'
import axios from 'axios';
import { getURL } from '../../utils/common';

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
        border: 'none'
    },
    active: {
        color: theme.palette.success.main
    }
}));


export default function ProductView() {
    const classes = useStyles();
    const columns = [{
        id: 'name',
        label: 'Name',
        minWidth: 'auto',
        className: '',
    }, {
        id: 'description',
        label: 'Description',
        minWidth: 'auto',
        className: '',
    }, {
        id: 'dimensionsCBM',
        label: 'Dimensions CBM',
        minWidth: 'auto',
        className: '',
    }, {
        id: 'weight',
        label: 'Weight',
        minWidth: 'auto',
        className: '',
    }, {
        id: 'isActive',
        label: 'Status',
        minWidth: 'auto',
        className: value => value ? classes.active : '',
        format: value => value ? 'Active' : 'In-Active',
    }];
    const [page, setPage] = useState(0);
    const [products, setProducts] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    useEffect(() => {

        axios.get(getURL('/product'))
            .then((res) => res.data.data)
            .then((products) => {
                setProducts(products)
            });
    }, []);

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Manage Product" addButtonTitle="ADD PRODUCT" />
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
                        {products.map((product) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                                    {columns.map((column) => {
                                        const value = product[column.id];
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
            <TablePagination
                // rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
