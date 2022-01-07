import React from "react";
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import GoogleMap from "../../../components/GoogleMap";
import { GoogleApiWrapper } from "google-maps-react";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("pk");
Geocode.enableDebug();

const useStyles = makeStyles((theme) => ({}));
function WarehouseDetailsView({ open, handleClose, selectedWarehouse, cities }) {

  const classes = useStyles();

  return selectedWarehouse ? (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>View Warehouse</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="filled-number"
                    label="Warehouse Name"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    fullWidth
                    variant="filled"
                    value={selectedWarehouse.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="filled-number"
                    label="Business Warehouse Code"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    fullWidth
                    variant="filled"
                    value={selectedWarehouse.businessWarehouseCode ? selectedWarehouse.businessWarehouseCode : "-"}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="filled-number"
                    label="Address"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="text"
                    disabled
                    fullWidth
                    variant="filled"
                    value={selectedWarehouse.address}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="capacity"
                    label="Capacity"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    fullWidth
                    variant="filled"
                    value={selectedWarehouse.capacity || ''}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2}>
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
                    value={cities && cities.find((c) => c.id == selectedWarehouse.city) ? cities.find((c) => c.id == selectedWarehouse.city).name || '' : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="filled-number"
                    label="Status"
                    type="text"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled
                    fullWidth
                    variant="filled"
                    value={selectedWarehouse.isActive ? "Active" : "In-Active"}
                  />
                </Grid>
              </Grid>
              {selectedWarehouse && selectedWarehouse.locationLatlng ? (
                <Grid container item xs={12} spacing={3} style={{ minHeight: 400, marginBottom: 20 }}>
                  <Grid item sm={12} className={classes.locationMap} style={{ position: "relative", minHeight: 300 }}>
                    <GoogleMap singleLocationLatlng={selectedWarehouse.locationLatlng} showMapSearchFields={false} />
                  </Grid>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  ) : null;
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU",
})(WarehouseDetailsView);
