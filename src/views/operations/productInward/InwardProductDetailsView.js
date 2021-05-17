import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat } from '../../../utils/common';

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
                            {selectedProductInward.Customer.companyName}
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
                            UoM
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Product.UOM.name}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Quantity
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.quantity}
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
                            Warehouse City :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {selectedProductInward.Warehouse.city}
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            Data & Time Process :
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display="block" displayPrint="block">
                            {dateFormat(selectedProductInward.updatedAt)}
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
                              value={selectedProductInward.Customer.companyName}
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
                              value={selectedProductInward.Product.name}
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
                              value={selectedProductInward.Warehouse.name}
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
                              variant="filled"
                              value={selectedProductInward.quantity}
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
        :
        null
    )
}

export default InwardProductDetailsView
