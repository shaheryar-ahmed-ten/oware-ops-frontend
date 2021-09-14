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
import TableHeader from '../../../components/TableHeader'
import axios from 'axios';
import { getURL, digitize } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddCompanyView from './AddCompanyView';
import CompanyDetailsView from './CompanyDetailsView';
import { capitalize, debounce } from 'lodash';
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
  }
}));


export default function CompanyView({ relationType }) {
  const pageHeadTitle = capitalize(`${relationType}s`);
  const classes = useStyles();
  const columns = [{
    id: 'internalIdForBusiness',
    label: 'ID',
    minWidth: 'auto',
    className: ''
  }, {
    id: 'name',
    label: 'Company',
    minWidth: 'auto',
    className: '',
  }, ...(relationType == 'CUSTOMER' ? [{
    id: 'type',
    label: 'Company Type',
    minWidth: 'auto',
    className: ''
  }] : []), {
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
    // }, {
    //   id: 'Contact.phone',
    //   label: 'Contact Phone',
    //   minWidth: 'auto',
    //   className: '',
    //   format: (value, entity) => entity.Contact.phone
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
        <VisibilityIcon key="view" onClick={() => openViewDetails(entity)} />,
        <EditIcon key="edit" onClick={() => openEditView(entity)} />,
        // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
      ]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addCompanyViewOpen, setAddCompanyViewOpen] = useState(false);
  const [deleteCompanyViewOpen, setDeleteCompanyViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null)
  const [companyDetailsView, setCompanyDetailsView] = useState(false)

  const addCompany = data => {
    let apiPromise = null;
    if (!selectedCompany) apiPromise = axios.post(getURL(`company/${relationType}`), data);
    else apiPromise = axios.put(getURL(`company/${relationType}/${selectedCompany.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
        return
      }
      setShowMessage({
        message: `${relationType.toLowerCase()} has been ${!!selectedCompany ? 'updated' : 'created'}.`
      });
      closeAddCompanyView();
      getCompanies();
    });
  };

  const deleteCompany = data => {
    axios.delete(getURL(`company/${relationType}/${selectedCompany.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(<Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors('')}>{res.data.message}</Alert>);
          return
        }
        closeDeleteCompanyView();
        getCompanies();
      });
  };
  const openViewDetails = (driver) => {
    setSelectedCompany(driver)
    setCompanyDetailsView(true)
  }

  const closeCompanyDetailsView = () => {
    setCompanyDetailsView(false)
    setSelectedCompany(null)
  }

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

  const _getCompanies = (page, searchKeyword) => {
    axios.get(getURL(`company/${relationType}`), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setCompanies(res.data.data)
      });
  }

  const getCompanies = useCallback(debounce((page, searchKeyword) => {
    _getCompanies(page, searchKeyword);
  }, DEBOUNCE_CONST), []);

  const getRelations = () => {
    axios.get(getURL(`company/${relationType}/relations`))
      .then(res => {
        setUsers(res.data.users);
        setCustomerTypes(res.data.customerTypes);
      });
  };


  useEffect(() => {
    getCompanies(page, searchKeyword);
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
    onClick={() => setAddCompanyViewOpen(true)}>ADD COMPANY</Button>;
  const addCompanyModal = <AddCompanyView
    key={3}
    formErrors={formErrors}
    users={users}
    relationType={relationType}
    customerTypes={customerTypes}
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
  const companyDetailsViewModal = <CompanyDetailsView
    relationType={relationType}
    selectedCompany={selectedCompany}
    open={companyDetailsView}
    handleClose={closeCompanyDetailsView} />;
  const headerButtons = [searchInput, addCompanyButton, addCompanyModal, deleteCompanyModal, companyDetailsViewModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title= "Company" buttons={headerButtons} />
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
            {companies.map((customer) => {
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
