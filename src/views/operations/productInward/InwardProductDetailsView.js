import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';

function InwardProductDetailsView({open, handleClose, selectedProductInward, formErrors}) {
    // var {Customer, User, Product, Warehouse} = selectedProductInward ? selectedProductInward : '' 
    const [customer, setcustomer] = useState('')
    const [warehouse, setwarehouse] = useState('')
    const [user, setuser] = useState('')
    const [product, setproduct] = useState('')
    const [quantity, setquantity] = useState('')
    const [UoM, setUoM] = useState('')
    const [updatedAt, setupdatedAt] = useState('')
    useEffect(() => {
        if(selectedProductInward)
        {
            setcustomer(selectedProductInward.Customer)
            setwarehouse(selectedProductInward.Warehouse)
            setuser(selectedProductInward.User)
            setproduct(selectedProductInward.Product)
            setquantity(selectedProductInward.quantity)
            setUoM(selectedProductInward.Product.UOM.name)
            setupdatedAt(selectedProductInward.updatedAt)
        }
        else {

        }
        return () => {
        
        }
    }, [selectedProductInward])
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
                     Product Inward
                </DialogTitle>                
            </Box>

            <Box display="block" displayPrint="none"> 
                <DialogTitle>
                    View Product Inward
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
                            {customer.companyName}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {product.name}
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
                            Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {quantity}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {warehouse.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {warehouse.city}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Data & Time Process :
                        </Box>
                    </Grid>
                    {console.log(dateFormat(updatedAt))}
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(updatedAt)}
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
                              id="customername"
                              label="Customer"
                              type="text"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              disabled
                              variant="filled"
                              value={customer.companyName}
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
                              value={product.name}
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
                              value={warehouse.name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                              id="filled-number"
                              label="UOM"
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
                    </Grid>
                </DialogContent>
            </Box>
            
            <Box displayPrint="none">
                <DialogActions>
                  <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
                  {
                    !selectedProductInward ? 
                    ''
                    :
                  <Button onClick={handlePrint} color="primary" variant="contained">
                    Print
                  </Button>
                  }
                </DialogActions>
            </Box>
            
            </Box>
          </Dialog>
        </form>
      </div >
    )
}

export default InwardProductDetailsView
