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


export default function DispatchOrderView() {
  const classes = useStyles();
  const columns = [{
    id: 'ProductInward.Customer.companyName',
    label: 'CUSTOMER',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.ProductInward.Customer.companyName
  }, {
    id: 'ProductInward.Product.name',
    label: 'PRODUCT',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.ProductInward.Product.name
  }, {
    id: 'ProductInward.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.ProductInward.Warehouse.name
  }, {
    id: 'ProductInward.Product.UOM.name',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.ProductInward.Product.UOM.name
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
    label: 'QUANTITY AVAILABLE',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'shipmentDate',
    label: 'SHIPMENT DATE',
    minWidth: 'auto',
    className: '',
    format: value => `${new Date(value).toLocaleDateString()} ${new Date(value).toLocaleTimeString()}`
  }, {
    id: 'isActive',
    label: 'STATUS',
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
  const [dispatchOrders, setDispatchOrders] = useState([]);

  const [productInwards, setProductInwards] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [customers, setCustomers] = useState([]);

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
        setFormErrors(res.data.message);
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
          setFormErrors(res.data.message);
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

  const getDispatchOrders = (page = 1) => {
    axios.get(getURL('/dispatch-order'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setDispatchOrders(res.data.data)
      });
  }

  const getRelations = () => {
    axios.get(getURL('/dispatch-order/relations'))
      .then(res => {
        setProductInwards(res.data.productInwards)
        setWarehouses(res.data.warehouses)
        setCustomers(res.data.customers)
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getDispatchOrders(newPage);
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
    margin="dense"
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
    onClick={() => setAddDispatchOrderViewOpen(true)}>ADD PRODUCT</Button>;
  const addDispatchOrderModal = <AddDispatchOrderView
    key={3}
    productInwards={productInwards}
    warehouses={warehouses}
    customers={customers}
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
        <TableHeader title="Manage DispatchOrder" buttons={headerButtons} />
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
