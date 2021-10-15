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
  InputLabel,
  FormControl,
  Select,
  FormHelperText,
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader'
import axios from 'axios';
import { getURL, digitize, dateFormat } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddProductOutwardView from './AddProductOutwardView';
import { debounce } from 'lodash';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ViewProductOutwardDetails from './ViewProductOutwardDetails';
import { DEBOUNCE_CONST } from '../../../Config';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate } from 'react-router';
import { MenuItem } from '@material-ui/core';

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
  searchFilter: {
    marginRight: 7,
  }
}));


export default function ProductOutwardView() {
  const classes = useStyles();
  const navigate = useNavigate()
  const columns = [{
    id: 'id',
    label: 'OUTWARD ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.internalIdForBusiness
  },
  {
    id: 'DispatchOrder.internalIdForBusiness',
    label: 'DISPATCH ORDER ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.internalIdForBusiness
  },
  {
    id: 'Inventory.Company.name',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventory.Company.name
    // format: (value, entity, inventory) => inventory.Company.name
  },
  {
    id: 'Inventory.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventory.Warehouse.name
    // format: (value, entity, inventory) => inventory.Warehouse.name
  },
  //  {
  //   id: 'Inventory.Product.UOM.name',
  //   label: 'UOM',
  //   minWidth: 'auto',
  //   className: '',
  //   format: (value, entity) => entity.DispatchOrder.Inventory.Product.UOM.name
  //   // format: (value, entity, inventory) => inventory.Product.UOM.name
  // },
  // {
  //   id: 'DispatchOrder.receiverName',
  //   label: 'RECEIVER NAME',
  //   minWidth: 'auto',
  //   className: '',
  //   format: (value, entity) => entity.DispatchOrder.receiverName
  // },
  // {
  //   id: 'DispatchOrder.receiverPhone',
  //   label: 'RECEIVER PHONE',
  //   minWidth: 'auto',
  //   className: '',
  //   format: (value, entity) => entity.DispatchOrder.receiverPhone
  // },
  
  // {
  //   id: 'city',
  //   label: 'CITY',
  //   minWidth: 'auto',
  //   className: '',
  //   format: (value, entity) => entity.DispatchOrder.Inventory.Warehouse.city
  // },
  {
    id: 'products',
    label: 'NO. OF PRODUCTS',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.Inventories.length
  },
  {
    id: 'DispatchOrder.quantity',
    label: 'Requested Quantity to Dispatch',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.DispatchOrder.quantity
    // format: (value, entity, inventory) => inventory.OrderGroup.quantity
  }, {
    id: 'quantity',
    label: 'Actual Quantity Dispatched',
    minWidth: 'auto',
    className: '',
    // format: (value, entity, inventory) => inventory.dispatchedQuantity
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
        <VisibilityIcon key="view" onClick={() => navigate(`view/${entity.id}`, {
          state: {
            selectedProductOutward: entity
          }
        })} />,
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [productOutwards, setProductOutwards] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProductOutward, setSelectedProductOutward] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [deleteProductOutwardViewOpen, setDeleteProductOutwardViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null)

  const [searchFilter, setSearchFilter] = useState('Company.name')

  const deleteProductOutward = data => {
    axios.delete(getURL(`product-outward/${selectedProductOutward.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteProductOutwardView();
        getProductOutwards();
      });
  };


  const openDeleteView = productOutward => {
    setSelectedProductOutward(productOutward);
    setDeleteProductOutwardViewOpen(true);
  }


  const closeDeleteProductOutwardView = () => {
    setSelectedProductOutward(null);
    setDeleteProductOutwardViewOpen(false);
  }

  const _getProductOutwards = (page, searchKeyword, searchFilter) => {
    axios.get(getURL('product-outward'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setProductOutwards(res.data.data)
      });
  }

  const getProductOutwards = useCallback(debounce((page, searchKeyword, searchFilter) => {
    _getProductOutwards(page, searchKeyword, searchFilter);
  }, DEBOUNCE_CONST), []);

  useEffect(() => {
    getProductOutwards(page, searchKeyword, searchFilter);
  }, [page, searchKeyword]);

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
  const addProductOutwardButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    // onClick={() => setAddProductOutwardViewOpen(true)}
    onClick={() => { navigate('create') }}
  >ADD PRODUCT OUTWARD</Button>;

  const deleteProductOutwardModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteProductOutward}
    open={deleteProductOutwardViewOpen}
    handleClose={closeDeleteProductOutwardView}
    selectedEntity={selectedProductOutward && selectedProductOutward.name}
    title={"ProductOutward"}
  />


  const headerButtons = [searchInput, addProductOutwardButton, deleteProductOutwardModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Product Outward" buttons={headerButtons} />
        <Table aria-label="sticky table" >
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
                // productOutward.DispatchOrder.Inventories.map((inventory, idx) => {
                //   return (
                //     <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                //       {columns.map((column) => {
                //         const value = productOutward[column.id];
                //         return (
                //           <TableCell key={column.id} align={column.align}
                //             className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                //             {column.format ? column.format(value, productOutward, inventory) : value}
                //           </TableCell>
                //         );
                //       })}
                //     </TableRow>
                //   )
                // })
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
      <MessageSnackbar showMessage={showMessage} />
    </Paper>
  );
}
