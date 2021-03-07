import React from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import TableHeader from './TableHeader'

const columns = [
    {
        id: 'firstName',
        label: 'First Name',
        minWidth: 'auto',
    },
    {
        id: 'lastName',
        label: 'Last Name',
        minWidth: 'auto'
    },
    {
        id: 'email',
        label: 'Email',
        minWidth: 'auto',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'phone',
        label: 'Phone',
        minWidth: 'auto',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 'auto',
        format: (value) => value.toFixed(2),
    },

];

function createData(firstName, lastName, email, phone, status) {
    // const density = population / size;
    return { firstName, lastName, email, phone, status };
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
        maxHeight: 450,
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
                <TableHeader title="Dispatch User" />
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
                // rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                // rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
