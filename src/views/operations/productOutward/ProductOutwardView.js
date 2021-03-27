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
import AddProductOutwardView from './AddProductOutwardView';

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


export default function ProductOutwardView() {
  const classes = useStyles();
  const columns = [{
    id: 'DispatchOrder.ProductInward.Customer.companyName',
    label: 'CUSTOMER',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.ProductInward.Customer.companyName
  }, {
    id: 'DispatchOrder.ProductInward.Product.name',
    label: 'PRODUCT',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.ProductInward.Product.name
  }, {
    id: 'DispatchOrder.ProductInward.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.ProductInward.Warehouse.name
  }, {
    id: 'DispatchOrder.ProductInward.Product.UOM.name',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.ProductInward.Product.UOM.name
  }, {
    id: 'DispatchOrder.receiverName',
    label: 'RECEIVER NAME',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.receiverName
  }, {
    id: 'DispatchOrder.receiverPhone',
    label: 'RECEIVER PHONE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.receiverPhone
  }, {
    id: 'DispatchOrder.quantity',
    label: 'Requested Quantity to Dispatch',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.quantity
  }, {
    id: 'quantity',
    label: 'Actual Quantity to Dispatch',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'DispatchOrder.shipmentDate',
    label: 'SHIPMENT DATE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => `${new Date(entity.DispatchOrder.shipmentDate).toLocaleDateString()} ${new Date(entity.DispatchOrder.shipmentDate).toLocaleTimeString()}`
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
  const [productOutwards, setProductOutwards] = useState([]);

  const [dispatchOrders, setDispatchOrders] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProductOutward, setSelectedProductOutward] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addProductOutwardViewOpen, setAddProductOutwardViewOpen] = useState(false);
  const [deleteProductOutwardViewOpen, setDeleteProductOutwardViewOpen] = useState(false);


  const addProductOutward = data => {
    let apiPromise = null;
    if (!selectedProductOutward) apiPromise = axios.post(getURL('/product-outward'), data);
    else apiPromise = axios.put(getURL(`/product-outward/${selectedProductOutward.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddProductOutwardView(false);
      getProductOutwards();
    });
  };

  const deleteProductOutward = data => {
    axios.delete(getURL(`/product-outward/${selectedProductOutward.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteProductOutwardView();
        getProductOutwards();
      });
  };

  const openEditView = productOutward => {
    setSelectedProductOutward(productOutward);
    setAddProductOutwardViewOpen(true);
  }

  const openDeleteView = productOutward => {
    setSelectedProductOutward(productOutward);
    setDeleteProductOutwardViewOpen(true);
  }

  const closeAddProductOutwardView = () => {
    setSelectedProductOutward(null);
    setAddProductOutwardViewOpen(false);
  }

  const closeDeleteProductOutwardView = () => {
    setSelectedProductOutward(null);
    setDeleteProductOutwardViewOpen(false);
  }

  const getProductOutwards = (page = 1) => {
    axios.get(getURL('/product-outward'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setProductOutwards(res.data.data)
      });
  }

  const getRelations = () => {
    axios.get(getURL('/product-outward/relations'))
      .then(res => {
        setDispatchOrders(res.data.dispatchOrders)
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getProductOutwards(newPage);
  };
  useEffect(() => {
    getProductOutwards();
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
  const addProductOutwardButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddProductOutwardViewOpen(true)}>ADD PRODUCT OUTWARD</Button>;
  const addProductOutwardModal = <AddProductOutwardView
    key={3}
    dispatchOrders={dispatchOrders}
    selectedProductOutward={selectedProductOutward}
    open={addProductOutwardViewOpen}
    addProductOutward={addProductOutward}
    handleClose={() => closeAddProductOutwardView()} />
  const deleteProductOutwardModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteProductOutward}
    open={deleteProductOutwardViewOpen}
    handleClose={closeDeleteProductOutwardView}
    selectedEntity={selectedProductOutward && selectedProductOutward.name}
    title={"ProductOutward"}
  />
  const headerButtons = [searchInput, addProductOutwardButton, addProductOutwardModal, deleteProductOutwardModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage ProductOutward" buttons={headerButtons} />
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
            {productOutwards.map((productOutward) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={productOutward.id}>
                  {columns.map((column) => {
                    const value = productOutward[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, productOutward) : value}
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
