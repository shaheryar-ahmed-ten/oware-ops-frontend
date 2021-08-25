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
import SelectDropdown from '../../../components/SelectDropdown';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined';

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
  },
  {
    id: 'Inventory.Company.name',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    // format: (value, entity) => entity.Inventory.Company.name
    format: (value, entity) => ''
  },
  {
    id: 'Inventory.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    // format: (value, entity) => entity.Inventory.Warehouse.name
    format: (value, entity) => ''
  },
  {
    id: 'availableQuantity',
    label: 'AVAILABLE QUANTITY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.availableQuantity
  },
  {
    id: 'adjustmentQuantity',
    label: 'ADJUSTMENT QUANTITY',
    minWidth: 'auto',
    className: '',
  },
  {
    id: 'reasonType',
    label: 'REASON',
    minWidth: 'auto',
    className: '',
  },
  {
    id: 'comment',
    label: 'COMMENT',
    minWidth: 'auto',
    className: '',
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

  // Filters
  const [customerWarehouses, setCustomerWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  const [customerProducts, setCustomerProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    // TODO: call stock mang API
    _getinventoryWastages(page, searchKeyword)
  }, [page, searchKeyword])

  const _getinventoryWastages = (page, searchKeyword) => {
    axios.get(getURL('inventory-wastages'), { params: { page, search: searchKeyword } })
      .then(res => {
        console.log(res)
        setPageCount(res.data.pages)
        setInventoryWastages(res.data.data.records ? res.data.data.records : [])
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

  const resetFilters = () => {
    setSelectedWarehouse(null);
    // setSelectedProduct(null);
    // setSelectedDay(null);
    // setSelectedStatus(null);
  }

  const warehouseSelect = <SelectDropdown icon={<HomeOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Warehouses" name="Select Warehouse" list={[{ name: 'All' }, ...customerWarehouses]} selectedType={selectedWarehouse} setSelectedType={setSelectedWarehouse} setPage={setPage} />
  const productSelect = <SelectDropdown icon={<ClassOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Products" name="Select Product" list={[{ name: 'All' }, ...customerProducts]} selectedType={selectedProduct} setSelectedType={setSelectedProduct} setPage={setPage} />
  const companySelect = <SelectDropdown icon={<HomeOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Company" name="Select Company" list={[{ name: 'All' }, ...companies]} selectedType={selectedCompany} setSelectedType={setSelectedCompany} setPage={setPage} />


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

  const headerButtons = [companySelect, warehouseSelect, productSelect, searchInput, addStockMangementButton];

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
            {console.log(inventoryWastages)}
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
