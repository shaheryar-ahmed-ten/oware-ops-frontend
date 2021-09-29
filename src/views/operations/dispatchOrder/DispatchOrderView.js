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
  TableRow,
  IconButton,
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader'
import axios from 'axios';
import { getURL, dateFormat, digitize, dateToPickerFormat } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import ConfirmDelete from '../../../components/ConfirmDelete';
import { debounce } from 'lodash';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { DEBOUNCE_CONST } from '../../../Config';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import EditIcon from '@material-ui/icons/EditOutlined';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';

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
  pendingStatusButtonStyling: {
    backgroundColor: '#FFEEDB',
    color: '#F69148',
    borderRadius: "10px"
  },
  partialStatusButtonStyling: {
    backgroundColor: '#F0F0F0',
    color: '#7D7D7D',
    width: '100%',
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
    display: 'table-cell',
    // justifyContent: 'center',
    textAlign: 'center'
    // alignItems: 'center'
  },
}));


export default function DispatchOrderView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const columns = [{
    id: 'id',
    label: 'DISPATCH ORDER ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.internalIdForBusiness
  },
  {
    id: 'Inventory.Company.name',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Company.name
  },
  {
    id: 'Inventory.Warehouse.name',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventory.Warehouse.name
  },
  {
    id: 'Inventories.length',
    label: 'NO. OF PRODUCTS',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Inventories.length
  },
  {
    id: 'receiverName',
    label: 'RECEIVER NAME',
    minWidth: 'auto',
    className: '',
  },
  {
    id: 'receiverPhone',
    label: 'RECEIVER PHONE',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'shipmentDate',
    label: 'SHIPMENT DATE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => dateFormat(entity.shipmentDate)
  },
  {
    id: 'referenceid',
    label: 'REFERENCE ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.referenceId
  },
  {
    id: 'status',
    label: 'STATUS',
    maxWidth: 150,
    className: classes.tableCellStyle,
    format: (value, entity) => {
      let totalDispatched = 0
      entity.ProductOutwards.forEach(po => {
        po.OutwardGroups.forEach(outGroup => {
          totalDispatched += outGroup.quantity
        });
      });
      return (
        totalDispatched === 0 ? <Button color="primary" className={clsx(classes.statusButtons, classes.pendingStatusButtonStyling)}>
          Pending
        </Button> : totalDispatched > 0 && totalDispatched < entity.quantity ? <Button color="primary" className={clsx(classes.statusButtons, classes.partialStatusButtonStyling)}>
          Partially fulfilled
        </Button> : entity.quantity === totalDispatched ? <Button color="primary" className={clsx(classes.statusButtons, classes.fullfilledStatusButtonStyling)}>
          Fulfilled
        </Button> : ''
      )
    }
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 150,
    className: '',
    format: (value, entity) => {
      let totalDispatched = 0
      entity.ProductOutwards.forEach(po => {
        po.OutwardGroups.forEach(outGroup => {
          totalDispatched += outGroup.quantity
        });
      });
      return [
        <VisibilityIcon key="view"
          onClick={() => navigate(`view/${entity.id}`)}
          style={{ cursor: 'pointer' }} />,
        (totalDispatched === 0) || (totalDispatched > 0 && totalDispatched < entity.quantity) ?
          <EditIcon key="edit" onClick={() => navigate(`edit/${entity.id}`)}
            style={{ cursor: 'pointer' }}
          />
          :
          '',
          totalDispatched === 0 ?
          <CancelPresentationOutlinedIcon style={{ cursor: 'pointer' }} />
          :
          ''
      ]
    }
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [deleteDispatchOrderViewOpen, setDeleteDispatchOrderViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null)


  const cancelDispatchOrder = dispatchOrder => {
    // TODO: add an api to cancel the dispatch order.
  }

  const deleteDispatchOrder = data => {
    axios.delete(getURL(`dispatch-order/${selectedDispatchOrder.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteDispatchOrderView();
        getDispatchOrders();
      });
  };

  const openDeleteView = dispatchOrder => {
    setSelectedDispatchOrder(dispatchOrder);
    setDeleteDispatchOrderViewOpen(true);
  }

  const closeDeleteDispatchOrderView = () => {
    setSelectedDispatchOrder(null);
    setDeleteDispatchOrderViewOpen(false);
  }

  const _getDispatchOrders = (page, searchKeyword) => {
    axios.get(getURL('dispatch-order'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setDispatchOrders(res.data.data)
      });
  }

  const getDispatchOrders = useCallback(debounce((page, searchKeyword) => {
    _getDispatchOrders(page, searchKeyword);
  }, DEBOUNCE_CONST), []);


  useEffect(() => {
    getDispatchOrders(page, searchKeyword);
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

  const addDispatchOrderButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    // onClick={() => setAddDispatchOrderViewOpen(true)}
    onClick={() => navigate('create')}
  >ADD DISPATCH ORDER</Button>;

  const deleteDispatchOrderModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteDispatchOrder}
    open={deleteDispatchOrderViewOpen}
    handleClose={closeDeleteDispatchOrderView}
    selectedEntity={selectedDispatchOrder && selectedDispatchOrder.name}
    title={"DispatchOrder"}
  />


  const headerButtons = [searchInput, addDispatchOrderButton, deleteDispatchOrderModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Dispatch Order" buttons={headerButtons} />
        <Table aria-label="sticky table" >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: 'bolder', fontSize: '12px', textAlign: 'center' }}
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
          />
        </Grid>
      </Grid>
      <MessageSnackbar showMessage={showMessage} />
    </Paper>
  );
}
