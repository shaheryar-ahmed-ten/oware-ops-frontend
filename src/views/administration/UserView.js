import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
    {
        id: 'dispatch_id',
        label: 'DISPATCH ID',
        minWidth: 'auto',
    },
    {
        id: 'product_name',
        label: 'PRODUCT NAME',
        minWidth: 'auto'
    },
    {
        id: 'customer_name',
        label: 'CUSTOMER',
        minWidth: 'auto',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'warehouse',
        label: 'WAREHOUSE',
        minWidth: 'auto',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'uom',
        label: 'UOM',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'qty',
        label: 'QTY DISPATCH',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'receiver_phone',
        label: 'RECEIVER PHONE',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'receiver_name',
        label: 'RECEIVER NAME',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'shipment_date',
        label: 'SHIPMENT DATE',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'date_receiving',
        label: 'DATE/TIME RECEIVING',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
    root: {
        width: '100%',
        backgroundColor: 'transparent'
    },
    container: {
        maxHeight: 440,
        padding: 20,

    },
});

export default function UserView() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
