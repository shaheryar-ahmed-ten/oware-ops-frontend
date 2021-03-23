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
import AddCustomerView from './AddCustomerView';

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


export default function CustomerView() {
  const classes = useStyles();
  const columns = [{
    id: 'companyName',
    label: 'Company',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'firstName',
    label: 'Contact Name',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => `${entity['Contact.firstName']} ${entity['Contact.lastName']}`
  }, {
    id: 'Contact.email',
    label: 'Contact Email',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'Contact.phone',
    label: 'Contact Phone',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'isActive',
    label: 'Status',
    minWidth: 'auto',
    className: value => value ? classes.active : '',
    format: value => value ? 'Active' : 'In-Active',
  }, {
    id: 'notes',
    label: 'Notes',
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
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addCustomerViewOpen, setAddCustomerViewOpen] = useState(false);
  const [deleteCustomerViewOpen, setDeleteCustomerViewOpen] = useState(false);


  const addCustomer = data => {
    let apiPromise = null;
    if (!selectedCustomer) apiPromise = axios.post(getURL('/customer'), data);
    else apiPromise = axios.put(getURL(`/customer/${selectedCustomer.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddCustomerView();
      getCustomers();
    });
  };

  const deleteCustomer = data => {
    axios.delete(getURL(`/customer/${selectedCustomer.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteCustomerView();
        getCustomers();
      });
  };

  const openEditView = customer => {
    setSelectedCustomer(customer);
    setAddCustomerViewOpen(true);
  }

  const openDeleteView = customer => {
    setSelectedCustomer(customer);
    setDeleteCustomerViewOpen(true);
  }

  const closeAddCustomerView = () => {
    setSelectedCustomer(null);
    setAddCustomerViewOpen(false);
  }

  const closeDeleteCustomerView = () => {
    setSelectedCustomer(null);
    setDeleteCustomerViewOpen(false);
  }

  const getCustomers = (page = 1) => {
    axios.get(getURL('/customer'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setCustomers(res.data.data)
      });
  }

  const getRelations = () => {
    axios.get(getURL('/customer/relations'))
      .then(res => {
        setUsers(res.data.users)
      });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getCustomers(newPage);
  };

  useEffect(() => {
    getCustomers();
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
  const addCustomerButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddCustomerViewOpen(true)}>ADD CUSTOMER</Button>;
  const addCustomerModal = <AddCustomerView
    key={3}
    users={users}
    selectedCustomer={selectedCustomer}
    open={addCustomerViewOpen}
    addCustomer={addCustomer}
    handleClose={() => closeAddCustomerView()} />
  const deleteCustomerModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteCustomer}
    open={deleteCustomerViewOpen}
    handleClose={closeDeleteCustomerView}
    selectedEntity={selectedCustomer && selectedCustomer.name}
    title={"Customer"}
  />
  const headerButtons = [searchInput, addCustomerButton, addCustomerModal, deleteCustomerModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Customer" buttons={headerButtons} />
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
            {customers.map((customer) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={customer.id}>
                  {columns.map((column) => {
                    const value = customer[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, customer) : value}
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
