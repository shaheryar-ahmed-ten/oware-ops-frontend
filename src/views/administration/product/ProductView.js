import { useEffect, useState, useCallback } from "react";
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
  Typography,

} from "@material-ui/core";
import TableHeader from "../../../components/TableHeader";
import axios from "axios";
import { getURL, digitize } from "../../../utils/common";
import { Alert, Pagination } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import ConfirmDelete from "../../../components/ConfirmDelete";
import AddProductView from "./AddProductView";
import { debounce } from "lodash";
import { DEBOUNCE_CONST } from "../../../Config";
import MessageSnackbar from "../../../components/MessageSnackbar";
import ProductsCsvReader from "../../../components/ProductsCsvReader";
import { useNavigate } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "20px",
  },
  container: {
    // maxHeight: 450,
    padding: 20,
  },
  active: {
    color: theme.palette.success.main,
  },
  searchInput: {
    border: "1px solid grey",
    borderRadius: 4,
    opacity: 0.6,
    padding: "0px 8px",
    marginRight: 7,
    height: 30,
  },
  tableCellStyle: {
    width: 200,
    maxWidth: 200,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

  },
}));

export default function ProductView() {
  const classes = useStyles();
  const columns = [
    {
      id: "id",
      label: "PRODUCT ID",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: (value) => {
        const productId = digitize(value, 6);
        return (
          <Tooltip title={`${productId}`}>
            <Typography>
              {productId.length > 20 ? `${productId.substring(0, 20)}...` : productId}
            </Typography>
          </Tooltip>
        )

      }
    },
    {
      id: "name",
      label: "Name",
      minWidth: "auto",
      className: classes.tableCellStyle,
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.name}`}>
            <Typography>
              {entity.name.length > 20 ? `${entity.name.substring(0, 20)}...` || '-' : entity.name || '-'}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      id: "description",
      label: "Description",
      className: classes.tableCellStyle,
      format: (value, entity) => {
        return (
          <Tooltip title={`${entity.description}`}>
            <Typography>
              {entity.description.length > 20 ? `${entity.description.substring(0, 20)}...` || '-' : entity.description || '-'}
            </Typography>
          </Tooltip>
        )

      }

    },
    {
      id: "dimensionsCBM",
      label: (
        <span>
          Volume cm<sup>3</sup>
        </span>
      ),
      minWidth: "auto",
      className: "",
    },
    {
      id: "weight",
      label: "Weight in KGs",
      minWidth: "auto",
      className: "",
    },
    {
      id: "Category.name",
      label: "Category",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.Category.name
    },
    {
      id: "Brand.name",
      label: "Brand",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.Brand.name,
    },
    {
      id: "UOM.name",
      label: "UoM",
      minWidth: "auto",
      className: "",
      format: (value, entity) => entity.UOM.name,
    },
    {
      id: "isActive",
      label: "Status",
      minWidth: "auto",
      className: (value) => (value ? classes.active : ""),
      format: (value) => (value ? "Active" : "In-Active"),
    },
    {
      id: "actions",
      label: "",
      minWidth: "auto",
      className: "",
      format: (value, entity) => [
        <EditIcon key="edit" onClick={() => openEditView(entity)} />,
        // <DeleteIcon color="error" key="delete" onClick={() => openDeleteView(entity)} />
      ],
    },
  ];
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formErrors, setFormErrors] = useState("");
  const [addProductViewOpen, setAddProductViewOpen] = useState(false);
  const [deleteProductViewOpen, setDeleteProductViewOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const navigate = useNavigate();

  const addProduct = (data) => {
    let apiPromise = null;
    if (!selectedProduct) apiPromise = axios.post(getURL("product"), data);
    else apiPromise = axios.put(getURL(`product/${selectedProduct.id}`), data);
    apiPromise.then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      setShowMessage({
        message: "New product has been created.",
      });
      closeAddProductView(false);
      getProducts();
    });
  };

  const bulkUpload = (data) => {
    let apiPromise = axios.post(getURL("product/bulk"), data);
    apiPromise
      .then((res) => {
        if (!res.data.success) {
          setFormErrors(
            <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
              {res.data.message}
            </Alert>
          );
          return;
        }
        setMessageType("green");
        setShowMessage({
          message: "New products has been created.",
        });
        closeAddProductView(false);
        getProducts();
      })
      .catch((err) => {
        setMessageType("#FFCC00");
        setShowMessage({
          message: `${err.response.data.message || "Invalid file data."}`,
        });
      });
  };

  const deleteProduct = (data) => {
    axios.delete(getURL(`product / ${selectedProduct.id}`)).then((res) => {
      if (!res.data.success) {
        setFormErrors(
          <Alert elevation={6} variant="filled" severity="error" onClose={() => setFormErrors("")}>
            {res.data.message}
          </Alert>
        );
        return;
      }
      closeDeleteProductView();
      getProducts();
    });
  };

  const openEditView = (product) => {
    setSelectedProduct(product);
    setAddProductViewOpen(true);
  };

  const openDeleteView = (product) => {
    setSelectedProduct(product);
    setDeleteProductViewOpen(true);
  };

  const closeAddProductView = () => {
    setSelectedProduct(null);
    setAddProductViewOpen(false);
  };

  const closeDeleteProductView = () => {
    setSelectedProduct(null);
    setDeleteProductViewOpen(false);
  };

  const _getProducts = (page, searchKeyword) => {
    axios.get(getURL("product"), { params: { page, search: searchKeyword } }).then((res) => {
      setPageCount(res.data.pages);
      setProducts(res.data.data);
    });
  };

  const getProducts = useCallback(
    debounce((page, searchKeyword) => {
      _getProducts(page, searchKeyword);
    }, DEBOUNCE_CONST),
    []
  );

  const getRelations = () => {
    axios.get(getURL("product/relations")).then((res) => {
      setBrands(res.data.brands);
      setUoms(res.data.uoms);
      setCategories(res.data.categories);
    });
  };

  useEffect(() => {
    getProducts(page, searchKeyword);
  }, [page, searchKeyword]);

  useEffect(() => {
    getRelations();
  }, []);

  const searchInput = (
    <InputBase
      placeholder="Search"
      className={classes.searchInput}
      id="search"
      label="Search"
      type="text"
      variant="outlined"
      value={searchKeyword}
      key={1}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  );

  // const addBulkProductsButton = <ProductsCsvReader bulkUpload={bulkUpload} />;
  const addBulkProductsButton = (
    <Button
      key={4}
      variant="contained"
      color="primary"
      size="small"
      style={{ width: 150, transform: "translateX(7px)" }}
      onClick={() => navigate("bulk-upload")}
    >
      Bulk Upload
    </Button>
  );

  const addProductButton = (
    <Button key={2} variant="contained" color="primary" size="small" onClick={() => setAddProductViewOpen(true)}>
      ADD PRODUCT
    </Button>
  );

  const addProductModal = (
    <AddProductView
      formErrors={formErrors}
      key={3}
      brands={brands}
      uoms={uoms}
      categories={categories}
      selectedProduct={selectedProduct}
      open={addProductViewOpen}
      addProduct={addProduct}
      handleClose={() => closeAddProductView()}
    />
  );

  const deleteProductModal = (
    <ConfirmDelete
      key={4}
      confirmDelete={deleteProduct}
      open={deleteProductViewOpen}
      handleClose={closeDeleteProductView}
      selectedEntity={selectedProduct && selectedProduct.name}
      title={"Product"}
    />
  );
  const headerButtons = [searchInput, addProductButton, addBulkProductsButton, addProductModal, deleteProductModal];
// retur
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <TableHeader title="Product" buttons={headerButtons} />
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    background: "transparent",
                    fontWeight: "bolder",
                    fontSize: "12px",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                  {columns.map((column) => {
                    const value = product[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={
                          column.className && typeof column.className === "function"
                            ? column.className(value)
                            : column.className
                        }
                      >
                        {column.format ? column.format(value, product) : value}
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
      <MessageSnackbar showMessage={showMessage} type={messageType} />
    </Paper>
  );
}
