import { useEffect, useState, useCallback } from 'react';
import {
  makeStyles,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader'
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { Pagination } from '@material-ui/lab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate } from 'react-router';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: '20px'
  },
  container: {
    padding: 20,
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
  pendingStatusButtonStyling: {
    backgroundColor: '#FFEEDB',
    color: '#F69148',
    borderRadius: "10px"
  },
  partialStatusButtonStyling: {
    backgroundColor: '#F0F0F0',
    color: '#7D7D7D',
    width: 150,
    borderRadius: "10px"
  },
  fullfilledStatusButtonStyling: {
    backgroundColor: '#EAF7D5',
    color: '#69A022',
    borderRadius: "10px"
  },
  tableCellStyle: {
    color: '#383838',
    fontSize: 14,
    display: 'flex',
    justifyContent: 'center'
  },
}));


export default function StockManagementView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const columns = [{
    id: 'id',
    label: 'Stock Management ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.internalIdForBusiness
  },
  {
    id: 'Inventory.Company.name',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Company.name
  },
  {
    id: 'Inventory.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Warehouse.name
  },
  {
    id: 'actions',
    label: '',
    minWidth: 'auto',
    className: '',
    format: (value, entity) =>
      [
        <VisibilityIcon key="view"
          onClick={() => navigate(`view/${entity.id}`, {
            state: {
              selectedDispatchOrder: entity,
              viewOnly: true
            }
          })} />,
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [inventoryWastages, setInventoryWastages] = useState([]);
  const [formErrors, setFormErrors] = useState('');
  const [showMessage, setShowMessage] = useState(null)

  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    // TODO: call stock mang API
  }, [])

  const _getinventoryWastages = (page, searchKeyword) => {
    axios.get(getURL('inventory-wastages'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setInventoryWastages(res.data.data ? res.data.data : [])
      });
  }

  const addStockMangementButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => navigate('create')}
  >ADD STOCK MANAGEMENT</Button>;

  const handleSearch = (e) => {
    setPage(1)
    setSearchKeyword(e.target.value)
  }

  const searchInput = <>
    <InputBase
      placeholder="Search"
      className={classes.searchInput}
      id="search"
      label="Search"
      type="text"
      variant="outlined"
      value={searchKeyword}
      key={1}
      onChange={e => handleSearch(e)}
    />
  </>

  const headerButtons = [searchInput, addStockMangementButton];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Stock Management" buttons={headerButtons} />
        <Table stickyHeader aria-label="sticky table" >
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
            {inventoryWastages.map((inventoryWastage) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={inventoryWastage.id}>
                  {columns.map((column) => {
                    const value = inventoryWastage[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, inventoryWastage) : value}
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
          />
        </Grid>
      </Grid>
      <MessageSnackbar showMessage={showMessage} />
    </Paper>
  );
}
