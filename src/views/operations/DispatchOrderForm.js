import { Box, Typography, Grid, makeStyles, Button, Paper, TextField, ButtonGroup } from '@material-ui/core';
import React, { useEffect, useState } from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            // width: '80%',
            margin: theme.spacing(1),
        }
    },
}))

const initialValue = {
    id: 0,
    productName: "",
    customer: "",
    warehouse: '',
    uom: '',
    quantity: 0,
    recievePhone: '',
    shipmentDate: new Date(),
    reveivingDate: new Date(),
}

const DispatchOrderForm = () => {
    const classes = useStyles()
    const [dispatch, setDispatch] = useState(initialValue);

    useEffect(_ => {
    }, [])

    const handleInputChange = e => {

    }
    return (
        <form className={classes.root}>
            <Box mt={3}>
                <Typography>Add Dispatch Order</Typography>
            </Box>
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        fullWidth="true"
                        variant="outlined"
                        name="customerName"
                        label="Customer Name"
                        value={dispatch.customer}
                        onChange={handleInputChange()} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Warehouse" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Product Name" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="UoM" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Available Qty" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Quantity of product to dispatch" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Shipment Date" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Receiver Name" fullWidth="true" value={dispatch.warehouse} />
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" label="Reciever Phone Number" fullWidth="true" value={dispatch.warehouse} />
                </Grid>

                <Grid item sm={12} align="right">
                    <ButtonGroup>
                        <Button variant="contained">Cancel</Button>
                        <Button variant="contained">Add Dispatch Order</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </form >
    )
}

export default DispatchOrderForm
