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
import AddCategoryView from './AddCategoryView';

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
  }
}));

export default function CategoryView() {
  const classes = useStyles();

  const columns = [{
    id: 'name',
    label: 'Name',
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
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addCategoryViewOpen, setAddCategoryViewOpen] = useState(false);
  const [deleteCategoryViewOpen, setDeleteCategoryViewOpen] = useState(false);


  const addCategory = data => {
    let apiPromise = null;
    if (!selectedCategory) apiPromise = axios.post(getURL('/category'), data);
    else apiPromise = axios.put(getURL(`/category/${selectedCategory.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddCategoryView();
      getCategories();
    });
  };

  const deleteCategory = data => {
    axios.delete(getURL(`/category/${selectedCategory.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteCategoryView();
        getCategories();
      });
  };

  const openEditView = category => {
    setSelectedCategory(category);
    setAddCategoryViewOpen(true);
  }

  const openDeleteView = category => {
    setSelectedCategory(category);
    setDeleteCategoryViewOpen(true);
  }

  const closeAddCategoryView = () => {
    setSelectedCategory(null);
    setAddCategoryViewOpen(false);
  }

  const closeDeleteCategoryView = () => {
    setSelectedCategory(null);
    setDeleteCategoryViewOpen(false);
  }



  const getCategories = (page = 1) => {
    axios.get(getURL('/category'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setCategories(res.data.data)
      });
  }
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getCategories(newPage);
  };

  useEffect(() => {
    getCategories();
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
  const addCategoryButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddCategoryViewOpen(true)}>ADD CATEGORY</Button>;
  const addCategoryModal = <AddCategoryView
    key={3}
    selectedCategory={selectedCategory}
    open={addCategoryViewOpen}
    addCategory={addCategory}
    handleClose={() => closeAddCategoryView()} />
  const deleteCategoryModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteCategory}
    open={deleteCategoryViewOpen}
    handleClose={closeDeleteCategoryView}
    selectedEntity={selectedCategory && selectedCategory.name}
    title={"Category"}
  />
  const headerButtons = [searchInput, addCategoryButton, addCategoryModal, deleteCategoryModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage Category" buttons={headerButtons} />
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
            {categories.map((category) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={category.id}>
                  {columns.map((column) => {
                    const value = category[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, category) : value}
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
