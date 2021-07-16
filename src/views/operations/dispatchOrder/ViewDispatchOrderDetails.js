import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat, getURL } from '../../../utils/common';
import PrintIcon from '@material-ui/icons/Print';
import { useLocation, useParams } from 'react-router';
import { TableRow } from '@material-ui/core';
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

function ViewDispatchOrderDetails() {
  const classes = useStyles();
  const { state } = useLocation();
  const { uid } = useParams();
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(state ? state.selectedDispatchOrder : null);
  useEffect(() => {
    if (!selectedDispatchOrder) {
      fetchDispatchOrders()
    }
  }, [uid])
  const fetchDispatchOrders = () => {
    _getDispatchOrders()
  }
  const _getDispatchOrders = () => {
    axios.get(getURL('/dispatch-order'))
      .then(res => {
        setSelectedDispatchOrder(res.data.data.find((order) => order.id == uid))
      });
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    selectedDispatchOrder ? <>
      <Grid container className={classes.parentContainer} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.heading}>Dispatch Order Details</Typography>
        </Grid>
        <TableContainer className={classes.parentContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableHeadText}>DISPATCH ORDER ID
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>CUSTOMER
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>WAREHOUSE
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>CITY
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>PRODUCTS
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>REFERENCE ID
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>SHIPMENT DATE
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>RECEIVER NAME
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>RECEIVER PHONE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {selectedDispatchOrder.internalIdForBusiness}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.Inventory.Company.name}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.Inventory.Warehouse.name}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.Inventory.Warehouse.city}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.Inventories.length}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.referenceId}
                </TableCell>
                <TableCell>
                  {dateFormat(selectedDispatchOrder.shipmentDate)}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.receiverName}
                </TableCell>
                <TableCell>
                  {selectedDispatchOrder.receiverPhone}
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
                  PRODUCT WEIGHT
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  UOM
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  QUANTITY
                </TableCell>
                <TableCell
                  className={classes.tableHeadText}>
                  AVAILABLE QUANTITY
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                selectedDispatchOrder.Inventories.map((order) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {order.Product.name}
                      </TableCell>
                      <TableCell>
                        {order.Product.weight} KG
                      </TableCell>
                      <TableCell>
                        {order.Product.UOM.name} KG
                      </TableCell>
                      <TableCell>
                        {order.OrderGroup.quantity}
                      </TableCell>
                      <TableCell>
                        {order.availableQuantity}
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
      :
      null
  );
}

export default ViewDispatchOrderDetails

// selectedDispatchOrder ?
//   <div style={{ display: "inline" }}>
//     <form>
//       <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//         <Box display="block" displayPrint="block" ref={componentRef}>
//           <Box display="none" displayPrint="block" style={{ margin: "25mm 25mm 0mm 25mm" }}>
//             <DialogTitle>
//               <Typography variant="h3">
//                 Dispatch Order
//               </Typography>
//             </DialogTitle>
//           </Box>

//           <Box display="block" displayPrint="none">
//             <DialogTitle>
//               View Dispatch Order
//               <IconButton aria-label="print" onClick={handlePrint}>
//                 <PrintIcon />
//               </IconButton>
//             </DialogTitle>
//           </Box>

//           <Box display="none" displayPrint="block" style={{ margin: "0mm 25mm 0mm 25mm" }}>
//             <DialogContent>
//               {formErrors}
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Dispatch Order Id :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.internalIdForBusiness}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Customer Name :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.Inventory.Company.name}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Warehouse :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.Inventory.Warehouse.name}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     City :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.Inventory.Warehouse.city}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Product :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.Inventory.Product.name}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Product Weight :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.Inventory.Product.weight} Kg/unit
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Requested Quantity :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.quantity + ` ` + selectedDispatchOrder.Inventory.Product.UOM.name}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Available Quantity :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.Inventory.availableQuantity + ` ` + selectedDispatchOrder.Inventory.Product.UOM.name}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Receiver Name :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.receiverName}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Receiver Phone :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {selectedDispatchOrder.receiverPhone}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     Requested Shipment Date&Time :
//                   </Box>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <Box display="block" displayPrint="block">
//                     {dateFormat(selectedDispatchOrder.shipmentDate)}
//                   </Box>
//                 </Grid>
//               </Grid>
//             </DialogContent>
//           </Box>

//           <Box display="block" displayPrint="none">
//             <DialogContent>
//               {formErrors}
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Dispatch Order Id"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.internalIdForBusiness}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Customer"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.Company.name}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Warehouse"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.Warehouse.name}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="City"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.Warehouse.city}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Product"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.Product.name}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Product Weight"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.Product.weight}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Quantity"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.quantity}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Available Qt"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.availableQuantity}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="UoM"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.Inventory.Product.UOM.name}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Receiver Name"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.receiverName}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Receiver Ph"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={selectedDispatchOrder.receiverPhone}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     id="filled-number"
//                     label="Req Shipment Date&Time"
//                     type="text"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     disabled
//                     fullWidth
//                     variant="filled"
//                     value={dateFormat(selectedDispatchOrder.shipmentDate)}
//                   />
//                 </Grid>
//               </Grid>
//             </DialogContent>
//           </Box>

//           <Box displayPrint="none">
//             <DialogActions>
//               <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
//             </DialogActions>
//           </Box>
//         </Box>
//       </Dialog>
//     </form>
//   </div >
//   :
//   null