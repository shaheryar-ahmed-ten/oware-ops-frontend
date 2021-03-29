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
import AddProductInwardView from './AddProductInwardView';

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


export default function ProductInwardView() {
  const classes = useStyles();
  const columns = [{
    id: 'id',
    label: 'INWARD ID',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'Customer.companyName',
    label: 'CUSTOMER',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Customer.companyName,
  }, {
    id: 'Product.name',
    label: 'PRODUCT',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Product.name,
  }, {
    id: 'Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Warehouse.name,
  }, {
    id: 'Product.UOM.name',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Product.UOM.name,
  }, {
    id: 'quantity',
    label: 'QUANTITY IN-PRODUCT',
    minWidth: 'auto',
    className: '',
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
  const [productInwards, setProductInwards] = useState([]);

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProductInward, setSelectedProductInward] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addProductInwardViewOpen, setAddProductInwardViewOpen] = useState(false);
  const [deleteProductInwardViewOpen, setDeleteProductInwardViewOpen] = useState(false);


  const addProductInward = data => {
    let apiPromise = null;
    if (!selectedProductInward) apiPromise = axios.post(getURL('/product-inward'), data);
    else apiPromise = axios.put(getURL(`/product-inward/${selectedProductInward.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddProductInwardView(false);
      getProductInwards();
    });
  };

  const deleteProductInward = data => {
    axios.delete(getURL(`/product-inward/${selectedProductInward.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteProductInwardView();
        getProductInwards();
      });
  };

  const openEditView = productInward => {
    setSelectedProductInward(productInward);
    setAddProductInwardViewOpen(true);
  }

  const openDeleteView = productInward => {
    setSelectedProductInward(productInward);
    setDeleteProductInwardViewOpen(true);
  }

  const closeAddProductInwardView = () => {
    setSelectedProductInward(null);
    setAddProductInwardViewOpen(false);
  }

  const closeDeleteProductInwardView = () => {
    setSelectedProductInward(null);
    setDeleteProductInwardViewOpen(false);
  }

  const getProductInwards = (page = 1) => {
    axios.get(getURL('/product-inward'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setProductInwards(res.data.data)
      });
  }

  const getRelations = () => {
    axios.get(getURL('/product-inward/relations'))
      .then(res => {
        setProducts(res.data.products)
        setWarehouses(res.data.warehouses)
        setCustomers(res.data.customers)
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getProductInwards(newPage);
  };
  useEffect(() => {
    getProductInwards();
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
  const addProductInwardButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddProductInwardViewOpen(true)}>ADD PRODUCT INWARD</Button>;
  const addProductInwardModal = <AddProductInwardView
    key={3}
    products={products}
    warehouses={warehouses}
    customers={customers}
    selectedProductInward={selectedProductInward}
    open={addProductInwardViewOpen}
    addProductInward={addProductInward}
    handleClose={() => closeAddProductInwardView()} />
  const deleteProductInwardModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteProductInward}
    open={deleteProductInwardViewOpen}
    handleClose={closeDeleteProductInwardView}
    selectedEntity={selectedProductInward && selectedProductInward.name}
    title={"ProductInward"}
  />
  const headerButtons = [searchInput, addProductInwardButton, addProductInwardModal, deleteProductInwardModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Product Inward" buttons={headerButtons} />
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
            {productInwards.map((productInward) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={productInward.id}>
                  {columns.map((column) => {
                    const value = productInward[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, productInward) : value}
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
