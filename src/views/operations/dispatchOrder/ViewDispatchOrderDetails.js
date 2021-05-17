import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';

function ViewDispatchOrderDetails({formErrors, open, handleClose, customers, warehouses, products, selectedDispatchOrder}) {
    
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
        selectedDispatchOrder ? 
        <div style={{ display: "inline" }}>
          <form>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <Box display="block" displayPrint="block" ref={componentRef}>
                <Box display="none" displayPrint="block">
                    <DialogTitle>
                         Dispatch Order
                    </DialogTitle>                
                </Box>

                <Box display="block" displayPrint="none"> 
                    <DialogTitle>
                        View Dispatch Order
                    </DialogTitle>
                </Box>

                <Box display="none" displayPrint="block">
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
                            {selectedDispatchOrder.Inventory.Customer.companyName}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.Product.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            UoM
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.Product.UOM.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Requested Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.quantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Available Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.availableQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Committed Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.committedQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Total Inward Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.totalInwardQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Dispatched Quantity
                        </Box>
                    </Grid><Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.dispatchedQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.Warehouse.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedDispatchOrder.Inventory.Warehouse.city}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Shipment Date :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(selectedDispatchOrder.shipmentDate)}
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
                          value={selectedDispatchOrder.Inventory.Customer.companyName}
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
                          value={selectedDispatchOrder.Inventory.Warehouse.name}
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
                          value={selectedDispatchOrder.Inventory.Product.name}
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
                          value={selectedDispatchOrder.quantity}
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
                          value={selectedDispatchOrder.Inventory.availableQuantity}
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
                          value={selectedDispatchOrder.Inventory.committedQuantity}
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
                          value={selectedDispatchOrder.Inventory.Product.UOM.name}
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
                          value={selectedDispatchOrder.receiverName}
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
                          value={selectedDispatchOrder.receiverPhone}
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
                          value={dateFormat(selectedDispatchOrder.shipmentDate)}
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

export default ViewDispatchOrderDetails
