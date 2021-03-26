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
import AddUoMView from './AddUoMView';


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

export default function UoMView() {
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
  const [uoms, setUoMs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedUoM, setSelectedUoM] = useState(null);
  const [formErrors, setFormErrors] = useState('');
  const [addUoMViewOpen, setAddUoMViewOpen] = useState(false);
  const [deleteUoMViewOpen, setDeleteUoMViewOpen] = useState(false);


  const addUoM = data => {
    let apiPromise = null;
    if (!selectedUoM) apiPromise = axios.post(getURL('/uom'), data);
    else apiPromise = axios.put(getURL(`/uom/${selectedUoM.id}`), data);
    apiPromise.then(res => {
      if (!res.data.success) {
        setFormErrors(res.data.message);
        return
      }
      closeAddUoMView();
      getUoMs();
    });
  };

  const deleteUoM = data => {
    axios.delete(getURL(`/uom/${selectedUoM.id}`))
      .then(res => {
        if (!res.data.success) {
          setFormErrors(res.data.message);
          return
        }
        closeDeleteUoMView();
        getUoMs();
      });
  };

  const openEditView = uom => {
    setSelectedUoM(uom);
    setAddUoMViewOpen(true);
  }

  const openDeleteView = uom => {
    setSelectedUoM(uom);
    setDeleteUoMViewOpen(true);
  }

  const closeAddUoMView = () => {
    setSelectedUoM(null);
    setAddUoMViewOpen(false);
  }

  const closeDeleteUoMView = () => {
    setSelectedUoM(null);
    setDeleteUoMViewOpen(false);
  }

  const getUoMs = (page = 1) => {
    axios.get(getURL('/uom'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setUoMs(res.data.data)
      });
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    getUoMs(newPage);
  };
  useEffect(() => {
    getUoMs();
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
  const addUoMButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    onClick={() => setAddUoMViewOpen(true)}>ADD UoM</Button>;
  const addUoMModal = <AddUoMView
    key={3}
    selectedUoM={selectedUoM}
    open={addUoMViewOpen}
    addUoM={addUoM}
    handleClose={() => closeAddUoMView()} />
  const deleteUoMModal = <ConfirmDelete
    key={4}
    confirmDelete={deleteUoM}
    open={deleteUoMViewOpen}
    handleClose={closeDeleteUoMView}
    selectedEntity={selectedUoM && selectedUoM.name}
    title={"UoM"}
  />
  const headerButtons = [searchInput, addUoMButton, addUoMModal, deleteUoMModal];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Manage UoM" buttons={headerButtons} />
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
            {uoms.map((uom) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={uom.id}>
                  {columns.map((column) => {
                    const value = uom[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, uom) : value}
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
