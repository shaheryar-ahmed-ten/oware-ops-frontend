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
import AddProductView from './AddProductView';

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


export default function ProductView() {
  const classes = useStyles();
  const columns = [{
    id: 'name',
    label: 'Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'description',
    label: 'Description',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'dimensionsCBM',
    label: 'Dimensions CBM',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'weight',
    label: 'Weight',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'Category.name',
    label: 'Category',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'Brand.name',
    label: 'Brand',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'UOM.name',
    label: 'Uom',
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
  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addProductViewOpen, setAddProductViewOpen] = useState(false);
  const [deleteProductViewOpen, setDeleteProductViewOpen] = useState(false);


  const addProduct = data => {
    let apiPromise = null;
    if (!selectedProduct) apiPromise = axios.post(getURL('/product'), data);
    else apiPromise = axios.put(getURL(`/product/${selectedProduct.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddProductView(false);
      getProducts();
    });
  };

  const deleteProduct = data => {
    axios.delete(getURL(`/product/${selectedProduct.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteProductView();
        getProducts();
      });
  };

  const openEditView = product => {
    setSelectedProduct(product);
    setAddProductViewOpen(true);
  }

  const openDeleteView = product => {
    setSelectedProduct(product);
    setDeleteProductViewOpen(true);
  }

  const closeAddProductView = () => {
    setSelectedProduct(null);
    setAddProductViewOpen(false);
  }

  const closeDeleteProductView = () => {
    setSelectedProduct(null);
    setDeleteProductViewOpen(false);
  }

  const getProducts = (page = 1) => {
    axios.get(getURL('/product'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setProducts(res.data.data)
      });
  }

  const getRelations = () => {
    axios.get(getURL('/product/relations'))
      .then(res => {
        setBrands(res.data.brands)
        setUoms(res.data.uoms)
        setCategories(res.data.categories)
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getProducts(newPage);
  };
  useEffect(() => {
    getProducts();
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
  const addProductButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddProductViewOpen(true)}>ADD PRODUCT</Button>;
  const addProductModal = <AddProductView
    key={3}
    brands={brands}
    uoms={uoms}
    categories={categories}
    selectedProduct={selectedProduct}
    open={addProductViewOpen}
    addProduct={addProduct}
    handleClose={() => closeAddProductView()} />
  const deleteProductModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteProduct}
    open={deleteProductViewOpen}
    handleClose={closeDeleteProductView}
    selectedEntity={selectedProduct && selectedProduct.name}
    title={"Product"}
  />
  const headerButtons = [searchInput, addProductButton, addProductModal, deleteProductModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Product" buttons={headerButtons} />
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
            {products.map((product) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                  {columns.map((column) => {
                    const value = product[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, product) : value}
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
