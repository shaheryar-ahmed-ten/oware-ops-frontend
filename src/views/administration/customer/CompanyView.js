import { useCallback, useEffect, useState } from 'react';
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
import { getURL, digitize } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddCompanyView from './AddCompanyView';
import { debounce } from 'lodash';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { DEBOUNCE_CONST } from '../../../Config';

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


export default function CompanyView() {
  const classes = useStyles();
  const columns = [{
    id: 'id',
    label: 'ID',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => `${entity.name[0]}${(entity.type && entity.type[0]) || ""}${entity.relationType[0]}-${digitize(value, 3)}`
  }, {
    id: 'name',
    label: 'Company',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'relationType',
    label: 'Type',
    minWidth: 'auto',
    className: '',
    format: value => relationTypes[value]
  }, {
    id: 'type',
    label: 'Company Type',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'firstName',
    label: 'Contact Name',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => `${entity.Contact.firstName} ${entity.Contact.lastName}`
  }, {
    id: 'Contact.email',
    label: 'Contact Email',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Contact.email
  }, {
    id: 'Contact.phone',
    label: 'Contact Phone',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Contact.phone
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
  const [customers, setCompanys] = useState([]);
  const [users, setUsers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [relationTypes, setRelationTypes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addCompanyViewOpen, setAddCompanyViewOpen] = useState(false);
  const [deleteCompanyViewOpen, setDeleteCompanyViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null)

  const addCompany = data => {
    let apiPromise = null;
    if (!selectedCompany) apiPromise = axios.post(getURL('/customer'), data);
    else apiPromise = axios.put(getURL(`/customer/${selectedCompany.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: "New customer has been created."
      })
      closeAddCompanyView();
      getCompanys();
    });
  };

  const deleteCompany = data => {
    axios.delete(getURL(`/customer/${selectedCompany.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteCompanyView();
        getCompanys();
      });
  };

  const openEditView = customer => {
    setSelectedCompany(customer);
    setAddCompanyViewOpen(true);
  }

  const openDeleteView = customer => {
    setSelectedCompany(customer);
    setDeleteCompanyViewOpen(true);
  }

  const closeAddCompanyView = () => {
    setSelectedCompany(null);
    setAddCompanyViewOpen(false);
  }

  const closeDeleteCompanyView = () => {
    setSelectedCompany(null);
    setDeleteCompanyViewOpen(false);
  }

  const _getCompanys = (page, searchKeyword) => {
    axios.get(getURL('/customer'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setCompanys(res.data.data)
      });
  }

  const getCompanys = useCallback(debounce((page, searchKeyword) => {
    _getCompanys(page, searchKeyword);
  }, DEBOUNCE_CONST), []);

  const getRelations = () => {
    axios.get(getURL('/customer/relations'))
      .then(res => {
        setUsers(res.data.users);
        setCustomerTypes(res.data.customerTypes);
        setRelationTypes(res.data.relationTypes);
      });
  };


  useEffect(() => {
    getCompanys(page, searchKeyword);
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
  const addCompanyButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddCompanyViewOpen(true)}>ADD CUSTOMER</Button>;
  const addCompanyModal = <AddCompanyView
    key={3}
    formErrors={formErrors}
    users={users}
    customerTypes={customerTypes}
    relationTypes={relationTypes}
    selectedCompany={selectedCompany}
    open={addCompanyViewOpen}
    addCompany={addCompany}
    handleClose={() => closeAddCompanyView()} />
  const deleteCompanyModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteCompany}
    open={deleteCompanyViewOpen}
    handleClose={closeDeleteCompanyView}
    selectedEntity={selectedCompany && selectedCompany.name}
    title={"Company"}
  />
  const headerButtons = [searchInput, addCompanyButton, addCompanyModal, deleteCompanyModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Companies" buttons={headerButtons} />
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
