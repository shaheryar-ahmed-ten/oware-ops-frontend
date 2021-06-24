import React from 'react'
import {
    Grid,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core'
function DriverDetailsView({ open, handleClose, selectedDriver }) {
    return (
        <div style={{ display: "inline" }}>
            <form>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle>
                        View Driver
                    </DialogTitle>
                    <DialogContent>
                        {/* TODO: will add textfields once apis are ready */}
                        <Grid container spacing={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="filled-number"
                                        label="Driver Name"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
                                        fullWidth
                                        variant="filled"
                                        value={selectedDriver.name}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="filled-number"
                                        label="Vendor Name"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
                                        fullWidth
                                        variant="filled"
                                        value={selectedDriver.Company.name}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        id="filled-number"
                                        label="Phone Number"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        type="number"
                                        disabled
                                        fullWidth
                                        variant="filled"
                                        value={selectedDriver.phone}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="filled-number"
                                        label="CNIC Number"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
                                        fullWidth
                                        variant="filled"
                                        value={selectedDriver.cnicNumber}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="filled-number"
                                        label="Driving License Number"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        type="number"
                                        disabled
                                        fullWidth
                                        variant="filled"
                                        value={selectedDriver.drivingLicenseNumber}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default" variant="contained">Close</Button>
                    </DialogActions>

                </Dialog>
            </form>
        </div>
    )
}

export default DriverDetailsView
