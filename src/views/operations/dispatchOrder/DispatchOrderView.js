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
import { getURL, dateFormat } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddDispatchOrderView from './AddDispatchOrderView';

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


export default function DispatchOrderView() {
  const classes = useStyles();
  const columns = [{
    id: 'Inventory.Customer.companyName',
    label: 'CUSTOMER',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Customer.companyName
  }, {
    id: 'Inventory.Product.name',
    label: 'PRODUCT',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Product.name
  }, {
    id: 'Inventory.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Warehouse.name
  }, {
    id: 'Inventory.Product.UOM.name',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Product.UOM.name
  }, {
    id: 'receiverName',
    label: 'RECEIVER NAME',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'receiverPhone',
    label: 'RECEIVER PHONE',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'quantity',
    label: 'REQUESTED QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'dispatchedQuantity',
    label: 'DISPATCH STATUS',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => {
      const quantity = entity.quantity;
      const available = quantity - entity.ProductOutwards.reduce((acc, po) => acc + po.quantity, 0)
      if (available == quantity) return 'Pending';
      else if (available == 0) return 'Fulfilled';
      else return 'Partially Fulfilled';
    }
  }, {
    id: 'shipmentDate',
    label: 'FULFILMENT DATE',
    minWidth: 'auto',
    className: '',
    format: dateFormat
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
  const [dispatchOrders, setDispatchOrders] = useState([]);

  const [inventories, setInventories] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addDispatchOrderViewOpen, setAddDispatchOrderViewOpen] = useState(false);
  const [deleteDispatchOrderViewOpen, setDeleteDispatchOrderViewOpen] = useState(false);


  const addDispatchOrder = data => {
    let apiPromise = null;
    if (!selectedDispatchOrder) apiPromise = axios.post(getURL('/dispatch-order'), data);
    else apiPromise = axios.put(getURL(`/dispatch-order/${selectedDispatchOrder.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      closeAddDispatchOrderView(false);
      getDispatchOrders();
    });
  };

  const deleteDispatchOrder = data => {
    axios.delete(getURL(`/dispatch-order/${selectedDispatchOrder.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteDispatchOrderView();
        getDispatchOrders();
      });
  };

  const openEditView = dispatchOrder => {
    setSelectedDispatchOrder(dispatchOrder);
    setAddDispatchOrderViewOpen(true);
  }

  const openDeleteView = dispatchOrder => {
    setSelectedDispatchOrder(dispatchOrder);
    setDeleteDispatchOrderViewOpen(true);
  }

  const closeAddDispatchOrderView = () => {
    setSelectedDispatchOrder(null);
    setAddDispatchOrderViewOpen(false);
  }

  const closeDeleteDispatchOrderView = () => {
    setSelectedDispatchOrder(null);
    setDeleteDispatchOrderViewOpen(false);
  }

  const getDispatchOrders = () => {
    axios.get(getURL('/dispatch-order'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setDispatchOrders(res.data.data)
      });
  }

  const getRelations = () => {
    axios.get(getURL('/dispatch-order/relations'))
      .then(res => {
        setInventories(res.data.inventories)
      });
  };

  useEffect(() => {
    getDispatchOrders();
  }, [page, searchKeyword]);

  useEffect(() => {
    getRelations();
  }, []);

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
  const addDispatchOrderButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddDispatchOrderViewOpen(true)}>ADD DISPATCH</Button>;
  const addDispatchOrderModal = <AddDispatchOrderView
    key={3}
    formErrors={formErrors}
    inventories={inventories}
    selectedDispatchOrder={selectedDispatchOrder}
    open={addDispatchOrderViewOpen}
    addDispatchOrder={addDispatchOrder}
    handleClose={() => closeAddDispatchOrderView()} />
  const deleteDispatchOrderModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteDispatchOrder}
    open={deleteDispatchOrderViewOpen}
    handleClose={closeDeleteDispatchOrderView}
    selectedEntity={selectedDispatchOrder && selectedDispatchOrder.name}
    title={"DispatchOrder"}
  />
  const headerButtons = [searchInput, addDispatchOrderButton, addDispatchOrderModal, deleteDispatchOrderModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Dispatch" buttons={headerButtons} />
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
            {dispatchOrders.map((dispatchOrder) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={dispatchOrder.id}>
                  {columns.map((column) => {
                    const value = dispatchOrder[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, dispatchOrder) : value}
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
