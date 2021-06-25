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
function RideDetailsView({ selectedRide, open, handleClose }) {
    return (
        <div style={{ display: "inline" }}>
            <form>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle>
                        View Ride
                    </DialogTitle>
                    <DialogContent>
                        {/* TODO: will add textfields once apis are ready */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default" variant="contained">Close</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </div>
    )
}

export default RideDetailsView
