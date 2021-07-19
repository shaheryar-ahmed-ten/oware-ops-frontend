import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles
} from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat, getURL } from '../../../utils/common';
import PrintIcon from '@material-ui/icons/Print';
import { useLocation, useParams } from 'react-router';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  parentContainer: {
    boxSizing: 'border-box',
    padding: "30px 30px",
  },
  pageHeading: {
    fontWeight: 600
  },
  pageSubHeading: {
    fontWeight: 300
  },
  heading: {
    fontWeight: 'bolder'
  },
  shadedTableHeader: {
    backgroundColor: 'rgba(202,201,201,0.3)'
  },
  tableHeadText: {
    background: 'transparent', fontWeight: 'bolder', fontSize: '12px'
  }
}));

function InwardProductDetailsView() {
  const classes = useStyles();
  const { state } = useLocation();
  const { uid } = useParams();
  const [selectedProductInward, setSelectedProductInward] = useState(state ? state.selectedProductInward : null);

  useEffect(() => {
    if (!selectedProductInward) {
      fetchInwardOrders();
    }
  }, [uid])

  const fetchInwardOrders = () => {
    _getProductInwards()
  }

  const _getProductInwards = () => {
    axios.get(getURL('product-inward'))
      .then(res => {
        setSelectedProductInward(res.data.data.find((product) => product.id == uid))
      });
  }


  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    selectedProductInward ? <>
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Product Inward Details</Typography>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableHeadText}>Inward Id
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Customer
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Warehouse
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Products
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Reference Id
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>Inward Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role="checkbox">
                <TableCell>
                  {selectedProductInward.internalIdForBusiness}
                </TableCell>
                <TableCell>
                  {selectedProductInward.Company.name}
                </TableCell>
                <TableCell>
                  {selectedProductInward.Warehouse.name}
                </TableCell>
                <TableCell>
                  {selectedProductInward.Products.length}
                </TableCell>
                <TableCell>
                  {selectedProductInward.referenceId}
                </TableCell>
                <TableCell>
                  {dateFormat(selectedProductInward.createdAt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.shadedTableHeader}>
                <TableCell
                  className={classes.tableHeadText}>
                  PRODUCT
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  QUANTITY
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  UOM
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProductInward.Products.map((product, index) => {
                return (
                  <TableRow hover role="checkbox" key={index}>
                    <TableCell>
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.InwardGroup.quantity}
                    </TableCell>
                    <TableCell>
                      {product.UOM.name}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
      :
      null
  )
}

export default InwardProductDetailsView

// selectedProductInward ?
// <div style={{ display: "inline" }}>
//   <form>
//     <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//       <Box display="block" displayPrint="block" ref={componentRef}>

//         <Box display="none" displayPrint="block" style={{ margin: "25mm 25mm 0mm 25mm" }}>
//           <DialogTitle>
//             <Typography variant="h3">
//               Product Inward
//               </Typography>
//           </DialogTitle>
//         </Box>

//         <Box display="block" displayPrint="none">
//           <DialogTitle>
//             View Product Inward
//                   <IconButton aria-label="print" onClick={handlePrint}>
//               <PrintIcon />
//             </IconButton>
//           </DialogTitle>
//         </Box>

//         <Box display="none" displayPrint="block" style={{ margin: "0mm 25mm 0mm 25mm" }}>
//           <DialogContent>
//             {formErrors}
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Customer Name :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.Company.name}
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Warehouse :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.Warehouse.name}
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   City :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.Warehouse.city}
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Product :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.Product.name}
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Product Weight :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.Product.weight} Kg/unit
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Quantity :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.quantity + ` ` + selectedProductInward.Product.UOM.name}
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Processed By :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {selectedProductInward.User.firstName + ` ` + selectedProductInward.User.lastName}
//                 </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   Created at :
//                   </Box>
//               </Grid>
//               <Grid item xs={6}>
//                 <Box display="block" displayPrint="block">
//                   {dateFormat(selectedProductInward.createdAt)}
//                 </Box>
//               </Grid>
//             </Grid>
//           </DialogContent>
//         </Box>

//         <Box display="block" displayPrint="none">
//           <DialogContent>
//             {formErrors}
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   id="customername"
//                   label="Customer"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.Company.name}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="Product"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.Product.name}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="Product Weight in KGs/unit"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.Product.weight}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="Warehouse"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.Warehouse.name}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="City"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.Warehouse.city}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="UOM"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.Product.UOM.name}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="Quantity"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.quantity}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="Processed By"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={selectedProductInward.User.firstName + ` ` + selectedProductInward.User.lastName}
//                 />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField
//                   id="filled-number"
//                   label="Created At"
//                   type="text"
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   disabled
//                   fullWidth
//                   variant="filled"
//                   value={dateFormat(selectedProductInward.createdAt)}
//                 />
//               </Grid>
//             </Grid>
//             <TableContainer>
//               <Table stickyHeader aria-label="sticky table">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
//                       Name
//                     </TableCell>
//                     <TableCell style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
//                       UoM
//                     </TableCell>
//                     <TableCell style={{ background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}>
//                       Quantity
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {selectedProductInward.Products.map((product, idx) => {
//                     return (
//                       <TableRow hover role="checkbox">
//                         <TableCell>
//                           {product.name}
//                         </TableCell>
//                         <TableCell>
//                           {product.UOM.name}
//                         </TableCell>
//                         <TableCell>
//                           {product.InwardGroup.quantity}
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>


//           </DialogContent>
//         </Box>

//         <Box displayPrint="none">
//           <DialogActions>
//             <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
//           </DialogActions>
//         </Box>

//       </Box>
//     </Dialog>
//   </form>
// </div >
// :
// null