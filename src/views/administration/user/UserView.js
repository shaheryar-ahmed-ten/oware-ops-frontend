import { useEffect, useState } from 'react';
import {
  makeStyles,
  Grid,
  Paper,
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
import AddUserView from './AddUserView';
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
    border: 'none',
    display: 'block',
    alignItems: 'right'
  },
  active: {
    color: theme.palette.success.main
  }
}));

const buttonsInHead = [<AddUserView key={1} />];


export default function UserView() {
  const classes = useStyles();
  const columns = [{
    id: 'firstName',
    label: 'First Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'lastName',
    label: 'Last Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'email',
    label: 'Email',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'phone',
    label: 'Phone',
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
  const [users, setUsers] = useState([]);
  const getUsers = (page = 1) => {
    axios.get(getURL('/user'), { params: { page } })
      .then(res => {
        setPageCount(res.data.pages)
        setUsers(res.data.data)
      });
  };
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getUsers(newPage);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage User" buttons={buttonsInHead} />
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
            {users.map((user) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                  {columns.map((column) => {
                    const value = user[column.id];
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
