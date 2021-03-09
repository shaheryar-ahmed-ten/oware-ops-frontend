import { useEffect, useState } from 'react';
import {
  makeStyles,
  Grid,
  Paper,
  InputBase,
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
  },
  searchInput: {
    border: '1px solid grey',
    borderRadius: 4,
    opacity: 0.6,
    padding: '0px 8px',
    marginRight: 7,
    height: 30,
  },
}));


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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const getUsers = () => {
    axios.get(getURL('/user'), { params: { page, search: searchKeyword } })
    .then(res => {
      setPageCount(res.data.pages)
      setUsers(res.data.data)
    });
  };
  const getRoles = () => {
    axios.get(getURL('/user/roles'))
      .then(res => setRoles(res.data.data));
  };
  useEffect(() => {
    getUsers();
  }, [page, searchKeyword]);

  const searchInput = <InputBase
    placeholder="Search"
    className={classes.searchInput}
    margin="dense"
    id="search"
    label="Search"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;
  const buttonsInHead = [searchInput, <AddUserView key={2} />];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage User" buttons={buttonsInHead} searchInput={searchInput} />
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
            onChange={(e, newPage) => setPage(newPage)}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
