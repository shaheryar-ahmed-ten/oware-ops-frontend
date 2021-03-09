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
    TableRow
} from '@material-ui/core';
import TableHeader from '../TableHeader'
import axios from 'axios';
import { getURL } from '../../../utils/common';
import Pagination from '@material-ui/lab/Pagination';


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

export default function UoMView() {
    const classes = useStyles();
    const columns = [{
        id: 'name',
        label: 'Name',
        minWidth: 'auto',
        className: '',
    }, {
        id: 'isActive',
        label: 'Status',
        minWidth: 'auto',
        className: value => value ? classes.active : '',
        format: value => value ? 'Active' : 'In-Active',
    }];
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [uoms, setUoMs] = useState([]);
    const getUoMs = (page = 1) => {
      axios.get(getURL('/uom'), { params: { page } })
        .then((res) => res.data.data)
        .then((uoms) => setUoMs(uoms));
    };
    const handlePageChange = (event, newPage) => {
      setPage(newPage);
      getUoMs(newPage);
    };
  
    useEffect(() => {
      getUoMs();
    }, []);
  
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <TableHeader title="Manage UoM" addButtonTitle="ADD UoM" />
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
                        {uoms.map((uom) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={uom.id}>
                                    {columns.map((column) => {
                                        const value = uom[column.id];
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
            <Grid container>
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
        </Paper>
    );
}
