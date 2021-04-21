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
  TableRow
} from '@material-ui/core';
import TableHeader from '../../TableHeader'
import axios from 'axios';
import { getURL } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddWarehouseView from './AddWarehouseView';
import { debounce } from 'lodash';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent'
  },
  container: {
    maxHeight: 450,
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
}));


export default function WarehouseView() {
  const classes = useStyles();
  const columns = [{
    id: 'name',
    label: 'Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'businessWarehouseCode',
    label: 'Business Warehouse Code',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'address',
    label: 'Address',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'city',
    label: 'City',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'isActive',
    label: 'Status',
    minWidth: 'auto',
    className: value => value ? classes.active : '',
    format: value => value ? 'Active' : 'In-Active',
  }, {
    id: 'actions',
    label: '',
    minWidth: 'auto',
    className: '',
    format: (value, entity) =>
      [
        <EditIcon key="edit" onClick={() => openEditView(entity)} />,
        // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addWarehouseViewOpen, setAddWarehouseViewOpen] = useState(false);
  const [deleteWarehouseViewOpen, setDeleteWarehouseViewOpen] = useState(false);


  const addWarehouse = data => {
    let apiPromise = null;
    if (!selectedWarehouse) apiPromise = axios.post(getURL('/warehouse'), data);
    else apiPromise = axios.put(getURL(`/warehouse/${selectedWarehouse.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      closeAddWarehouseView(false);
      getWarehouses();
    });
  };

  const deleteWarehouse = data => {
    axios.delete(getURL(`/warehouse/${selectedWarehouse.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteWarehouseView();
        getWarehouses();
      });
  };

  const openEditView = warehouse => {
    setSelectedWarehouse(warehouse);
    setAddWarehouseViewOpen(true);
  }

  const openDeleteView = warehouse => {
    setSelectedWarehouse(warehouse);
    setDeleteWarehouseViewOpen(true);
  }

  const closeAddWarehouseView = () => {
    setSelectedWarehouse(null);
    setAddWarehouseViewOpen(false);
  }

  const closeDeleteWarehouseView = () => {
    setSelectedWarehouse(null);
    setDeleteWarehouseViewOpen(false);
  }

  const _getWarehouses = (page, searchKeyword) => {
    axios.get(getURL('/warehouse'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setWarehouses(res.data.data)
      });
  }

  const getWarehouses = useCallback(debounce((page, searchKeyword) => {
    _getWarehouses(page, searchKeyword);
  }, 300), []);

  useEffect(() => {
    getWarehouses(page, searchKeyword);
  }, [page, searchKeyword]);

  const searchInput = <InputBase
    placeholder="Search"
    className={classes.searchInput}
    id="search"
    label="Search"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;
  const addWarehouseButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddWarehouseViewOpen(true)}>ADD WAREHOUSE</Button>;
  const addWarehouseModal = <AddWarehouseView
    key={3}
    formErrors={formErrors}
    selectedWarehouse={selectedWarehouse}
    open={addWarehouseViewOpen}
    addWarehouse={addWarehouse}
    handleClose={() => closeAddWarehouseView()} />
  const deleteWarehouseModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteWarehouse}
    open={deleteWarehouseViewOpen}
    handleClose={closeDeleteWarehouseView}
    selectedEntity={selectedWarehouse && selectedWarehouse.name}
    title={"Warehouse"}
  />
  const headerButtons = [searchInput, addWarehouseButton, addWarehouseModal, deleteWarehouseModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Warehouse" buttons={headerButtons} />
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
            {warehouses.map((warehouse) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={warehouse.id}>
                  {columns.map((column) => {
                    const value = warehouse[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, warehouse) : value}
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
