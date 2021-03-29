import { useEffect, useState } from 'react';
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
import TableHeader from '../../TableHeader'
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


export default function InventoryView() {
  const classes = useStyles();
  const columns = [{
    id: 'product',
    label: 'PRODUCT NAME',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'customer',
    label: 'CUSTOMER',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'warehouse',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'uom',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'quantity',
    label: 'CURRENT AVAILABLE QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'committedQuantity',
    label: 'CURRENT COMMITTED QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'dispatchedQuantity',
    label: 'DISPATCHED QUANTITY',
    minWidth: 'auto',
    className: '',
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [inventories, setInventories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formErrors, setFormErrors] = useState('');

  const getInventorys = (page = 1) => {
    axios.get(getURL('/inventory'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        console.log(res)
        setInventories(res.data.data)
      });
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getInventorys(newPage);
  };
  useEffect(() => {
    getInventorys();
  }, [page, searchKeyword]);

  const searchInput = <InputBase
    placeholder="Product / Customer /Warehouse"
    className={classes.searchInput}
    margin="dense"
    id="search"
    label="Product / Customer /Warehouse"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;
  const headerButtons = [searchInput];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Inventory" buttons={headerButtons} />
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
            {inventories.map((inventory) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={inventory.id}>
                  {columns.map((column) => {
                    const value = inventory[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, inventory) : value}
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
