import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';

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
                         Product Outwards
                    </DialogTitle>                
                </Box>

                <Box display="block" displayPrint="none"> 
                <DialogTitle>
                  View Product Outward
              </DialogTitle>
                </Box>


                <Box display="none" displayPrint="block" style={{margin:"0mm 25mm 0mm 25mm"}}>
                <DialogContent>
                {formErrors}
                    <Grid container spacing={2}>
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
                            UoM
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Product.UOM.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Requested Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.quantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Available Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.availableQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Committed Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.committedQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Total Inward Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.totalInwardQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Dispatched Quantity
                        </Box>
                    </Grid><Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.dispatchedQuantity}
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
                            Warehouse City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductOutward.DispatchOrder.Inventory.Warehouse.city}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Shipment Date :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(selectedProductOutward.shipmentDate)}
                        </Box>
                    </Grid>
                </Grid>
                </DialogContent>
                </Box>

                <Box display="block" displayPrint="none">
                  <DialogContent>
                    {formErrors}
                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Customer"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
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
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Warehouse.name}
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
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.Product.name}
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
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.availableQuantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Commited Qt"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.Inventory.committedQuantity}
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
                          variant="filled"
                          value={selectedProductOutward.DispatchOrder.receiverPhone}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="ShipmentDate"
                          type="text"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          variant="filled"
                          value={dateFormat(selectedProductOutward.shipmentDate)}
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
                          variant="filled"
                          value={selectedProductOutward.Vehicle.vehicleNumber}
                        />
                    </Grid>
                </Grid>
                  </DialogContent>
                </Box>

              <Box displayPrint="none">
              <DialogActions>
                <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
                <Button onClick={handlePrint} color="primary" variant="contained">
                            Print
                        </Button>
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
