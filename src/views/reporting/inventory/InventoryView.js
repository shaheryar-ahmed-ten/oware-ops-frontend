import { useEffect, useState, useCallback } from 'react';
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
  TableRow,
  FormControl,
  TextField
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader';
import axios from 'axios';
import { dividerDateFormatForFilter, getURL } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import FileDownload from 'js-file-download';
import { debounce } from 'lodash';
import moment from 'moment';
import { DEBOUNCE_CONST } from '../../../Config';

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
    padding: '18px 10px',
    marginRight: 7,
    height: 30,
  },
  textFieldRange: {
    padding: 0,
    marginRight: 5,
    transform: 'translateY(-9px)'
  },
  exportBtn: {
    padding: '9px 10px'
  }
}));


export default function InventoryView() {
  const classes = useStyles();
  const columns = [{
    id: 'product',
    label: 'PRODUCT NAME',
    minWidth: 'auto',
    format: (value, entity) => entity.Product.name
  }, {
    id: 'customer',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Company.name
  }, {
    id: 'warehouse',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Warehouse.name
  }, {
    id: 'uom',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Product.UOM.name
  }, {
    id: 'availableQuantity',
    label: 'AVAILABLE QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'committedQuantity',
    label: 'COMMITTED QUANTITY',
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

  const [startDate, setStartDate] = useState(dividerDateFormatForFilter(Date.now()))
  const [endDate, setEndDate] = useState(dividerDateFormatForFilter(Date.now()))

  const _getInventories = (page, searchKeyword) => {
    axios.get(getURL('inventory'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setInventories(res.data.data)
      });
  }

  const getInventories = useCallback(debounce((page, searchKeyword) => {
    _getInventories(page, searchKeyword);
  }, DEBOUNCE_CONST), []);

  const exportToExcel = () => {
    axios.get(getURL('inventory/export'), {
      responseType: 'blob',
      params: { page, search: searchKeyword, startDate, endDate },
    }).then(response => {
      FileDownload(response.data, `Inventory ${moment().format('DD-MM-yyyy')}.xlsx`);
    });
  }

  useEffect(() => {
    getInventories(page, searchKeyword);
  }, [page, searchKeyword]);

  const searchInput = <InputBase
    placeholder="Product / Company /Warehouse"
    className={classes.searchInput}
    id="search"
    label="Product / Company /Warehouse"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;
  const exportButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    className={classes.exportBtn}
    onClick={() => exportToExcel()}> EXPORT TO EXCEL</Button >;

  const startDateRange = <TextField
    id="date"
    label="From"
    type="date"
    variant="outlined"
    className={classes.textFieldRange}
    InputLabelProps={{
      shrink: true,
    }}
    defaultValue={startDate}
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    margin="dense"
  />
  const endDateRange = <TextField
    id="date"
    label="To"
    type="date"
    variant="outlined"
    className={classes.textFieldRange}
    InputLabelProps={{
      shrink: true,
    }}
    defaultValue={endDate}
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    margin="dense"
  />

  const headerButtons = [searchInput, startDateRange, endDateRange, exportButton];

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
            {inventories.map((inventory, rId) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={rId}>
                  {columns.map((column, cId) => {
                    const value = inventory[column.id];
                    return (
                      <TableCell key={cId} align={column.align}
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
          // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
