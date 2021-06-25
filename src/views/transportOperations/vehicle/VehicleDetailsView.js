import React from 'react'
import {
    Grid,
    Button,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@material-ui/core'
function VehicleDetailsView({ selectedVehicle, open, handleClose }) {
    console.log(selectedVehicle)
    return (
        selectedVehicle ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle>
                            View Vehicle
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="filled-number"
                                            label="Vendor Name"
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedVehicle.Vendor ? selectedVehicle.Vendor.name : ''}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="filled-number"
                                            label="Default Driver"
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedVehicle.Driver ? selectedVehicle.Driver.name : ''}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="filled-number"
                                            label="Car"
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedVehicle.Car && selectedVehicle.Car.CarMake && selectedVehicle.Car.CarModel ? selectedVehicle.Car.CarMake.name + " " + selectedVehicle.Car.CarModel.name : ''}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="filled-number"
                                            label="Registration Number"
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedVehicle ? selectedVehicle.registrationNumber : ''}
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
            :
            null
    )
}

export default VehicleDetailsView
