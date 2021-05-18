import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';
import PrintIcon from '@material-ui/icons/Print';

function ViewProductOutwardDetails({formErrors, selectedProductOutward, open, handleClose}) {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
      selectedProductOutward ? 
        <div style={{ display: "inline" }}>
          <form>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <Box display="block" displayPrint="block" ref={componentRef}>
                <Box display="none" displayPrint="block" style={{margin:"25mm 25mm 0mm 25mm"}}>
                    <DialogTitle>
                      <Typography variant="h3">
                      Product Outwards
                      </Typography>
                    </DialogTitle>                
                </Box>

                <Box display="block" displayPrint="none"> 
                <DialogTitle>
                  View Product Outward
                  <IconButton aria-label="print" onClick={handlePrint}>
                    <PrintIcon/>
                  </IconButton>
              </DialogTitle>
                </Box>


                <Box display="none" displayPrint="block" style={{margin:"0mm 25mm 0mm 25mm"}}>
                <DialogContent>
                {formErrors}
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                          Dispatch Order Id : 
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.dispatchorderIdForBusiness}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                          Customer Name : 
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Customer.companyName}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Warehouse.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Warehouse.city}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Product.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product Weight :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Product.weight} Kg/unit
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Requested Quantity :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.quantity + ` ` + selectedProductOutward.DispatchOrder.Inventory.Product.UOM.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Available Quantity :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.availableQuantity + ` ` + selectedProductOutward.DispatchOrder.Inventory.Product.UOM.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Receiver Name :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.receiverName}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Receiver Phone :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.receiverPhone}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Vehicle Type :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.Vehicle.vehicleType}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Vehicle Number : 
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.Vehicle.vehicleNumber}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Requested Shipment Date&Time :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(selectedProductOutward.shipmentDate)}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Shipment Date&Time :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(selectedProductOutward.createdAt)}
                        </Box>
                    </Grid>
                </Grid>
                </DialogContent>
                </Box>

                <Box display="block" displayPrint="none">
                  <DialogContent>
                    {formErrors}
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                          id="filled-number"
                          label="Dispatch Order Id"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.dispatchorderIdForBusiness}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Customer"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Customer.companyName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Warehouse"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Warehouse.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="City"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Warehouse.city}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Product"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Product.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Product Weight in KGs/unit"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Product.weight}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Quantity"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Available Qt"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.availableQuantity}
                        />
                    </Grid>
                    
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="UoM"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Product.UOM.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Receiver Name"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.receiverName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Receiver Ph"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.receiverPhone}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="vehicle"
                          label="Vehicle Type"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.Vehicle.vehicleType}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="vehicle"
                          label="Vehicle Number"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedProductOutward.Vehicle.vehicleNumber}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Req Shipment Date&Time"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={dateFormat(selectedProductOutward.shipmentDate)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Created at"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          fullWidth
                          variant="filled"
                          value={dateFormat(selectedProductOutward.createdAt)}
                        />
                    </Grid>
                </Grid>
                  </DialogContent>
                </Box>

              <Box displayPrint="none">
              <DialogActions>
                <Button onClick={handleClose} color="default" variant="contained">Close</Button>
              </DialogActions>
              </Box>
            </Box>
            </Dialog>
          </form>
        </div >
      :
      null
      );
}

export default ViewProductOutwardDetails
