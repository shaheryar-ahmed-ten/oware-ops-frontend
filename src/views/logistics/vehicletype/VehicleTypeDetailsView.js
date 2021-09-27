import React from 'react'
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

function VehicleTypeDetailsView({ selectedVehicleType, open, handleClose }) {
    return (
        selectedVehicleType ?
          <div style={{ display: "inline" }}>
            <form>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>
                  View Vehicle Type
                            </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Car Model"
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedVehicleType.CarModel ? selectedVehicleType.CarModel.name : ''}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id="filled-number"
                          label="Car Make"
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedVehicleType.CarMake ? selectedVehicleType.CarMake.name : ''}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          id="filled-number"
                          label="Vehicle Type"
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedVehicleType.CarMake && selectedVehicleType.CarModel ? selectedVehicleType.VehicleType.name: ''}
                        />
                      </Grid>
                    </Grid>
                    {/* <Grid item container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          id="filled-number"
                          label="Registration Number"
                          disabled
                          fullWidth
                          variant="filled"
                          value={selectedVehicleType ? selectedVehicleType.registrationNumber : ''}
                        />
                      </Grid>
                    </Grid> */}
                    {/* <Grid item container spacing={2}>
                      <Grid item xs={12}>
                        {(selectedVehicle && selectedVehicle.RunningPaper) ?
                          <a target="_blank" href={getURL('preview', selectedVehicleType.RunningPaper.id)}>Running Paper Image</a>
                          : ''}
                      </Grid>
    
                      <Grid item xs={12}>
                        {(selectedVehicle && selectedVehicle.RoutePermit) ?
                          <a target="_blank" href={getURL('preview', selectedVehicle.RoutePermit.id)}>Route Permit Image</a>
                          : ''}
                      </Grid>
                    </Grid> */}
    
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
    
    export default VehicleTypeDetailsView