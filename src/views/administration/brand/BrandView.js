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
import TableHeader from '../TableHeader'
import axios from 'axios';
import { getURL } from '../../../utils/common';
import Pagination from '@material-ui/lab/Pagination';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ConfirmDelete from '../../../components/ConfirmDelete';
import AddBrandView from './AddBrandView';

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


export default function BrandView() {
  const classes = useStyles();
  const columns = [{
    id: 'name',
    label: 'Name',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'manufacturerName',
    label: 'Manufacturer Name',
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
      [<EditIcon key="edit" onClick={() => openEditView(entity)} />, <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />]
  }];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addBrandViewOpen, setAddBrandViewOpen] = useState(false);
  const [deleteBrandViewOpen, setDeleteBrandViewOpen] = useState(false);


  const addBrand = data => {
    let apiPromise = null;
    if (!selectedBrand) apiPromise = axios.post(getURL('/brand'), data);
    else apiPromise = axios.put(getURL(`/brand/${selectedBrand.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddBrandView(false);
      getBrands();
    });
  };

  const deleteBrand = data => {
    axios.delete(getURL(`/brand/${selectedBrand.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteBrandView();
        getBrands();
      });
  };

  const openEditView = brand => {
    setSelectedBrand(brand);
    setAddBrandViewOpen(true);
  }

  const openDeleteView = brand => {
    setSelectedBrand(brand);
    setDeleteBrandViewOpen(true);
  }

  const closeAddBrandView = () => {
    setSelectedBrand(null);
    setAddBrandViewOpen(false);
  }

  const closeDeleteBrandView = () => {
    setSelectedBrand(null);
    setDeleteBrandViewOpen(false);
  }

  const getBrands = (page = 1) => {
    axios.get(getURL('/brand'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setBrands(res.data.data)
      });
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getBrands(newPage);
  };
  useEffect(() => {
    getBrands();
  }, [page, searchKeyword]);

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
  const addBrandButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddBrandViewOpen(true)}>ADD BRAND</Button>;
  const addBrandModal = <AddBrandView
    key={3}
    selectedBrand={selectedBrand}
    open={addBrandViewOpen}
    addBrand={addBrand}
    handleClose={() => closeAddBrandView()} />
  const deleteBrandModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteBrand}
    open={deleteBrandViewOpen}
    handleClose={closeDeleteBrandView}
    selectedEntity={selectedBrand && selectedBrand.name}
    title={"Brand"}
  />
  const headerButtons = [searchInput, addBrandButton, addBrandModal, deleteBrandModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Brand" buttons={headerButtons} />
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
            {brands.map((brand) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={brand.id}>
                  {columns.map((column) => {
                    const value = brand[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, brand) : value}
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
