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
  FormControl,
  TextField,
  Select,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  ListItem,
} from '@material-ui/core';
import TableHeader from '../../../components/TableHeader';
import axios from 'axios';
import { dividerDateFormatForFilter, getURL } from '../../../utils/common';
import { Alert, Pagination } from '@material-ui/lab';
import FileDownload from 'js-file-download';
import { debounce } from 'lodash';
import moment from 'moment-timezone';
import { DEBOUNCE_CONST } from '../../../Config';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import MessageSnackbar from '../../../components/MessageSnackbar';
import { useNavigate } from 'react-router';
import VisibilityIcon from '@material-ui/icons/Visibility';


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
    padding: '12px 10px',
    marginRight: 7,
    height: 30,
  },
  textFieldRange: {
    padding: 0,
    marginRight: 5,
    // transform: 'translateY(-9px)'
  },
  exportBtn: {
    // padding: '9px 10px'
  },
  formControl: {
    minWidth: 160,
    boxSizing: 'border-box',
    marginRight: 10
  },
  placeholderText: {
    color: "#CAC9C9",
    '& .MuiSelect-outlined': {
      paddingTop: '7px',
      paddingBottom: '6px',
    },
  },
  dropdownListItem: {
    fontSize: 14,
  },
  inputAdronmentStyle: {
    '& .MuiInputAdornment-positionStart': {
      margin: '0',
      padding: '0',
      backgroundColor: 'green'
    },
    '& .MuiInputAdornment-root': {
      margin: '0',
      padding: '0',
      backgroundColor: 'green'
    }
  }
}));


export default function InventoryView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const columns = [{
    id: 'product',
    label: 'PRODUCT NAME',
    minWidth: 'auto',
    format: (value, entity) => entity.Product ? entity.Product.name : ""
  }, {
    id: 'customer',
    label: 'COMPANY',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Company ? entity.Company.name : ""
  }, {
    id: 'warehouse',
    label: 'WAREHOUSE',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Warehouse ? entity.Warehouse.name : ""
  }, {
    id: 'uom',
    label: 'UOM',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => entity.Product && entity.Product.UOM ? entity.Product.UOM.name : ""
  }, {
    id: 'availableQuantity',
    label: 'AVAILABLE QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'committedQuantity',
    label: 'COMMITTED QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'dispatchedQuantity',
    label: 'DISPATCHED QUANTITY',
    minWidth: 'auto',
    className: '',
  }, {
    id: 'actions',
    label: 'ACTIONS',
    minWidth: 'auto',
    className: '',
    format: (value, entity) => {
      return entity.Product && entity.Product.batchEnabled ?
        [
          <VisibilityIcon
            onClick={() => navigate(`view/${entity.id}`)}
          />,
        ]
        :
        ''
    }
  },
  ];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [inventories, setInventories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [days] = useState([{
    id: 7,
    name: '7 days'
  }, {
    id: 14,
    name: '14 days'
  }, {
    id: 30,
    name: '30 days'
  }, {
    id: 60,
    name: '60 days'
  }])
  const [selectedDay, setSelectedDay] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState(false) // bool
  const [reRender, setReRender] = useState(false)
  const [trackDateFilterOpen, setTrackDateFilterOpen] = useState(false)

  const _getInventories = (page, searchKeyword) => {
    axios.get(getURL('inventory'), { params: { page, search: searchKeyword } })
      .then(res => {
        setPageCount(res.data.pages)
        setInventories(res.data.data)
      });
  }

  const getInventories = useCallback(debounce((page, searchKeyword) => {
    _getInventories(page, searchKeyword);
  }, DEBOUNCE_CONST), []);

  const exportToExcel = () => {
    let startingDate = new Date(startDate);
    let endingDate = new Date(endDate);

    axios.get(getURL('inventory/export'), {
      responseType: 'blob',
      params: {
        page, search: searchKeyword, days: !selectedDateRange ? selectedDay : null, startingDate: selectedDateRange ? startingDate : null, endingDate: selectedDateRange ? endingDate : null
        ,
        client_Tz: moment.tz.guess()
      },
    }).then(response => {
      FileDownload(response.data, `Inventory ${moment().format('DD-MM-yyyy')}.xlsx`);
    });
  }

  useEffect(() => {
    if ((selectedDay !== 'custom' && !selectedDateRange) || selectedDay === 'custom' && !!selectedDateRange)
      getInventories(page, searchKeyword);
  }, [page, searchKeyword]);


  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleChange = (event) => {
    // reset the local state to remove the helper text
    if (event.target.value !== 'custom' && selectedDateRange) {
      setSelectedDateRange(false)
    }
    setPage(1)
    setSelectedDay(event.target.value);
  };

  const daysSelect = <FormControl className={classes.formControl}>
    <Select
      value={selectedDay}
      variant="outlined"
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Without label' }}
      className={classes.placeholderText}
      startAdornment={
        <InputAdornment position="start" classes={{ positionStart: classes.inputAdronmentStyle, root: classes.inputAdronmentStyle }}>
          <CalendarTodayOutlinedIcon fontSize="small" />
        </InputAdornment>
      }
      onOpen={() => setTrackDateFilterOpen(true)}
      onClose={() => setTrackDateFilterOpen(false)}
    >
      <MenuItem value={null} disabled>
        <span className={classes.dropdownListItem}>Select Days</span>
      </MenuItem>
      {
        [{ name: 'All' }, ...days].map((item, idx) => {
          return (
            <MenuItem key={idx} value={item.id}>
              <span className={classes.dropdownListItem}>{item.name || ''}</span>
            </MenuItem>
          )
        })
      }
      <MenuItem key={'custom'} value={'custom'} onClick={() => { setOpenDialog(true) }}>
        <span className={classes.dropdownListItem}>{startDate !== "-" && startDate !== null && endDate !== null && !trackDateFilterOpen ? moment(startDate).format("DD/MM/YYYY") + " - " + moment(endDate).format("DD/MM/YYYY") : "Custom"}</span>
      </MenuItem>
    </Select>
  </FormControl>

  const searchInput = <InputBase
    placeholder="Product / Company /Warehouse"
    className={classes.searchInput}
    id="search"
    label="Product / Company /Warehouse"
    type="text"
    variant="outlined"
    value={searchKeyword}
    key={1}
    onChange={e => setSearchKeyword(e.target.value)}
  />;

  const exportButton = <Button
    key={2}
    variant="contained"
    color="primary"
    size="small"
    className={classes.exportBtn}
    onClick={() => exportToExcel()}> EXPORT TO EXCEL</Button >;

  const startDateRange = <TextField
    id="date"
    label="From"
    type="date"
    variant="outlined"
    className={classes.textFieldRange}
    InputLabelProps={{
      shrink: true,
    }}
    fullWidth
    inputProps={{ max: endDate ? endDate : dividerDateFormatForFilter(Date.now()) }}
    defaultValue={startDate}
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    margin="dense"
  />
  const endDateRange = <TextField
    id="date"
    label="To"
    type="date"
    variant="outlined"
    className={classes.textFieldRange}
    InputLabelProps={{
      shrink: true,
    }}
    fullWidth
    inputProps={{ min: startDate, max: dividerDateFormatForFilter(Date.now()) }}
    defaultValue={endDate}
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    margin="dense"
  />

  const headerButtons = [searchInput, daysSelect, exportButton];

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Inventory" buttons={headerButtons} />
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
            {inventories.map((inventory, rId) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={rId}>
                  {columns.map((column, cId) => {
                    const value = inventory[column.id];
                    return (
                      <TableCell key={cId} align={column.align}
                        className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                        {column.format ? column.format(value, inventory) : value}
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

      <Dialog onClose={handleCloseDialog} open={openDialog}>
        <DialogTitle>Choose Date</DialogTitle>
        <ListItem button key={'startDate'}>
          {startDateRange}
        </ListItem>
        <ListItem button key={'startDate'}>
          {endDateRange}
        </ListItem>
        <ListItem autoFocus button style={{ justifyContent: 'flex-end' }} >
          <Button variant="contained" color="primary"
            disabled={!startDate || !endDate}
            onClick={() => {
              setSelectedDateRange(true)
              setOpenDialog(false)
              setReRender(!reRender)
            }}>
            OK
          </Button>
        </ListItem>
      </Dialog>
    </Paper>
  );
}
