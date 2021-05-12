import { useEffect, useState, useCallback, useRef } from 'react';
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
} from '@material-ui/core';
import TableHeader from '../../TableHeader'
import axios from 'axios';
import { getURL, digitize, dateFormat } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddProductOutwardView from './AddProductOutwardView';
import { debounce } from 'lodash';

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
    padding: '0px 8px',
    marginRight: 7,
    height: 30,
  },
}));


export default function ProductOutwardView() {
  const classes = useStyles();
  const columns = [{
    id: 'id',
    label: 'OUTWARD ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => `PD-${entity.DispatchOrder.Inventory.Warehouse.businessWarehouseCode}-${digitize(value, 6)}`
  }, {
    id: 'Inventory.Customer.companyName',
    label: 'CUSTOMER',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventory.Customer.companyName
  }, {
    id: 'Inventory.Product.name',
    label: 'PRODUCT',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventory.Product.name
  }, {
    id: 'Inventory.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventory.Warehouse.name
  }, {
    id: 'Inventory.Product.UOM.name',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventory.Product.UOM.name
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
    label: 'Actual Quantity Dispatched',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'DispatchOrder.shipmentDate',
    label: 'EXPECTED SHIPMENT DATE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => dateFormat(entity.DispatchOrder.shipmentDate)
  }, {
    id: 'createdAt',
    label: 'ACTUAL DISPATCH DATE',
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
  const [productOutwards, setProductOutwards] = useState([]);

  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [vehicleTypes, setvehicleTypes] = useState([])

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
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
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
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteProductOutwardView();
        getProductOutwards();
      });
  };

  const openEditView = productOutward => {
    getRelations();
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
    getRelations();
  }

  const closeDeleteProductOutwardView = () => {
    setSelectedProductOutward(null);
    setDeleteProductOutwardViewOpen(false);
  }

  const _getProductOutwards = (page, searchKeyword) => {
    axios.get(getURL('/product-outward'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setProductOutwards(res.data.data)
      });
  }

  const getProductOutwards = useCallback(debounce((page, searchKeyword) => {
    _getProductOutwards(page, searchKeyword);
  }, 300), []);

  const getRelations = () => {
    axios.get(getURL('/product-outward/relations'))
      .then(res => {  
        // setting dispatchOrder details and vehicleTypes in local State
        setvehicleTypes((prevState)=>res.data.vehicleTypes)
        setDispatchOrders(res.data.dispatchOrders)
      });
  };

  useEffect(() => {
    getProductOutwards(page, searchKeyword);
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
  const addProductOutwardButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddProductOutwardViewOpen(true)}>ADD PRODUCT OUTWARD</Button>;
  const addProductOutwardModal = <AddProductOutwardView
    key={3}
    formErrors={formErrors}
    dispatchOrders={dispatchOrders}
    selectedProductOutward={selectedProductOutward}
    open={addProductOutwardViewOpen}
    addProductOutward={addProductOutward}
    handleClose={() => closeAddProductOutwardView()}
    vehicleTypes={vehicleTypes} />
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
        <TableHeader title="Manage Product Outward" buttons={headerButtons}/>
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
