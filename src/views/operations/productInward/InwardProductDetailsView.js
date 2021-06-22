import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from '@material-ui/core'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';
import PrintIcon from '@material-ui/icons/Print';

function InwardProductDetailsView({open, handleClose, selectedProductInward, formErrors}) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    return (
        selectedProductInward ? 
        <div style={{ display: "inline" }}>
        <form>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <Box display="block" displayPrint="block" ref={componentRef}>

            <Box display="none" displayPrint="block" style={{margin:"25mm 25mm 0mm 25mm"}}>
                <DialogTitle>
                    <Typography variant="h3">
                        Product Inward
                    </Typography>
                </DialogTitle>                
            </Box>

            <Box display="block" displayPrint="none">  
                    <DialogTitle>
                        View Product Inward
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
                          Customer Name : 
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Company.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Warehouse :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Warehouse.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Warehouse.city}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Product.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Product Weight :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Product.weight} Kg/unit
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Quantity : 
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.quantity + ` ` + selectedProductInward.Product.UOM.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Processed By :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.User.firstName + ` ` + selectedProductInward.User.lastName} 
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Created at :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(selectedProductInward.createdAt)}
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
                              id="customername"
                              label="Customer"
                              type="text"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              disabled
                              fullWidth
                              variant="filled"
                              value={selectedProductInward.Company.name}
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
                              value={selectedProductInward.Product.name}
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
                              value={selectedProductInward.Product.weight}
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
                              value={selectedProductInward.Warehouse.name}
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
                              value={selectedProductInward.Warehouse.city}
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
                              fullWidth
                              variant="filled"
                              value={selectedProductInward.Product.UOM.name}
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
                              value={selectedProductInward.quantity}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                              id="filled-number"
                              label="Processed By"
                              type="text"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              disabled
                              fullWidth
                              variant="filled"
                              value={selectedProductInward.User.firstName + ` ` + selectedProductInward.User.lastName}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                              id="filled-number"
                              label="Created At"
                              type="text"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              disabled
                              fullWidth
                              variant="filled"
                              value={dateFormat(selectedProductInward.createdAt)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Box>
            
            <Box displayPrint="none">
                <DialogActions>
                  <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
                </DialogActions>
            </Box>
            
            </Box>
          </Dialog>
        </form>
      </div >
        :
        null
    )
}

export default InwardProductDetailsView
