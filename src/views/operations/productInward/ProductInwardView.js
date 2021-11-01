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
  Tooltip,
  Typography
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader'
import axios from 'axios';
import { getURL, digitize, dateFormat } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddProductInwardView from './AddProductInwardView';
import { debounce } from 'lodash';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InwardProductDetailsView from './InwardProductDetailsView';
import { DEBOUNCE_CONST } from '../../../Config';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate } from 'react-router';

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


export default function ProductInwardView() {
  const classes = useStyles();
  const navigate = useNavigate();

  const columns = [
    {
      id: 'id',
      label: 'INWARD ID',
      minWidth: 'auto',
      className: '',
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.internalIdForBusiness}`} classes={{ tooltip: classes.customWidth }}>
          <Typography>
            {entity.internalIdForBusiness.length > 20 ? `${entity.internalIdForBusiness.substring(0, 20)}...` : entity.internalIdForBusiness}
          </Typography>
        </Tooltip>
        )
      },
    },
    {
      id: 'Customer.name',
      label: 'COMPANY',
      minWidth: 'auto',
      className: '',
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.Company.name}`}>
          <Typography>
            {entity.Company.name.length > 20 ? `${entity.Company.name.substring(0, 20)}...` : entity.Company.name}
          </Typography>
        </Tooltip>
        )
      },
      
    },
    {
      id: 'Warehouse.name',
      label: 'WAREHOUSE',
      minWidth: 'auto',
      className: '',
      format: (value, entity) => entity.Warehouse.name,
    },
    {
      id: 'product',
      label: 'NO. OF PRODUCTS',
      minWidth: 'auto',
      className: '',
      format: (value, entity) => entity.Products.length,
    },
    {
      id: 'referenceId',
      label: 'REFERENCE ID',
      minWidth: 'auto',
      className: '',
      format: (value, entity) => entity.referenceId,
    },
    {
      id: 'createdAt',
      label: 'INWARD DATE',
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
              selectedProductInward: entity,
              viewOnly: true
            }
          })} />,
        ]
    },
  ];

  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [productInwards, setProductInwards] = useState([]);


  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProductInward, setSelectedProductInward] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [deleteProductInwardViewOpen, setDeleteProductInwardViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null)

  const deleteProductInward = data => {
    axios.delete(getURL(`product-inward/${selectedProductInward.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteProductInwardView();
        getProductInwards();
      });
  };


  const openDeleteView = productInward => {
    setSelectedProductInward(productInward);
    setDeleteProductInwardViewOpen(true);
  }


  const closeDeleteProductInwardView = () => {
    setSelectedProductInward(null);
    setDeleteProductInwardViewOpen(false);
  }


  const _getProductInwards = (page, searchKeyword) => {
    axios.get(getURL('product-inward'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setProductInwards(res.data.data)
      });
  }

  const getProductInwards = useCallback(debounce((page, searchKeyword) => {
    _getProductInwards(page, searchKeyword);
  }, DEBOUNCE_CONST), []);


  useEffect(() => {
    getProductInwards(page, searchKeyword);
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
  const addProductInwardButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => navigate('/operations/product-inward/create', {
      state: {
        viewOnly: false
      }
    })}>ADD PRODUCT INWARD</Button>;

  const deleteProductInwardModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteProductInward}
    open={deleteProductInwardViewOpen}
    handleClose={closeDeleteProductInwardView}
    selectedEntity={selectedProductInward && selectedProductInward.name}
    title={"ProductInward"}
  />


  const headerButtons = [searchInput, addProductInwardButton, deleteProductInwardModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Product Inward" buttons={headerButtons} />
        <Table aria-label="sticky table">
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
