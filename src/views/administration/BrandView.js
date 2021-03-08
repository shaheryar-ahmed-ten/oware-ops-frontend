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


export default function BrandView() {
    const classes = useStyles();
    const columns = [{
        id: 'name',
        label: 'Name',
        minWidth: 'auto',
        className: '',
    }, {
        id: 'manufacturerName',
        label: 'Manufacturer Name',
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
    const [brands, setBrands] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    useEffect(() => {

        axios.get(getURL('/brand'))
            .then((res) => res.data.data)
            .then((brands) => {
                setBrands(brands)
            });
    }, []);

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Manage Brand" addButtonTitle="ADD BRAND" />
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
            <TablePagination
                // rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={brands.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
