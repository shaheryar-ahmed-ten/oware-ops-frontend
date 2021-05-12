import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';

function ViewDispatchOrderDetails({formErrors, open, handleClose, customers, warehouses, products, selectedDispatchOrder}) {
    
    const [customer, setcustomer] = useState('')
    const [warehouse, setwarehouse] = useState('')
    const [warehouseCity, setwarehouseCity] = useState('')
    const [product, setproduct] = useState('')
    const [quantity, setquantity] = useState('')
    const [UoM, setUoM] = useState('')
    const [updatedAt, setupdatedAt] = useState('')
    const [receiverName, setreceiverName] = useState('')
    const [receiverPhone, setreceiverPhone] = useState('')
    const [shipmentDate, setshipmentDate] = useState('')
    const [availableQuantity, setavailableQuantity] = useState('')
    const [committedQuantity, setcommittedQuantity] = useState('')
    const [dispatchedQuantity, setdispatchedQuantity] = useState('')
    const [inwardQuantity, setinwardQuantity] = useState('')

    useEffect(() => {
        if(selectedDispatchOrder)
        {
            setcustomer((prevState)=>selectedDispatchOrder.Inventory.Customer.companyName)
            setwarehouse((prevState)=>selectedDispatchOrder.Inventory.Warehouse.name)
            setwarehouseCity((prevState)=>selectedDispatchOrder.Inventory.Warehouse.city)
            setproduct((prevState)=>selectedDispatchOrder.Inventory.Product.name)
            setUoM((prevState)=>selectedDispatchOrder.Inventory.Product.UOM.name)
            setquantity(selectedDispatchOrder.quantity)
            setupdatedAt(selectedDispatchOrder.updatedAt)
            setreceiverName(selectedDispatchOrder.receiverName)
            setreceiverPhone(selectedDispatchOrder.receiverPhone)
            setshipmentDate(selectedDispatchOrder.shipmentDate)
            setavailableQuantity(selectedDispatchOrder.Inventory.availableQuantity)
            setcommittedQuantity(selectedDispatchOrder.Inventory.committedQuantity)
            setdispatchedQuantity(selectedDispatchOrder.Inventory.dispatchedQuantity)
            setinwardQuantity(selectedDispatchOrder.Inventory.totalInwardQuantity)
        }

        return () => {
        }
    }, [selectedDispatchOrder])

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
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
                            {customer}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {product}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            UoM
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {UoM}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Requested Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {quantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Available Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {availableQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Committed Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {committedQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Total Inward Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {inwardQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Dispatched Quantity
                        </Box>
                    </Grid><Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dispatchedQuantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {warehouse}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {warehouseCity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Shipment Date :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(shipmentDate)}
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
                          value={customer}
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
                          value={warehouse}
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
                          value={product}
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
                          value={quantity}
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
                          value={availableQuantity}
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
                          value={committedQuantity}
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
                          value={UoM}
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
                          value={receiverName}
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
                          value={receiverPhone}
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
                          value={dateFormat(shipmentDate)}
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
      );
}

export default ViewDispatchOrderDetails
