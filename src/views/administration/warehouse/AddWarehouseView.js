import { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControl,
  InputLabel,
  Typography,
} from "@material-ui/core";
import { isChar, isRequired } from "../../../utils/validators";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import { getURL } from "../../../utils/common";
import GoogleMap from "../../../components/GoogleMap";
import { GoogleApiWrapper } from "google-maps-react";

const useStyles = makeStyles((theme) => ({
  textBox: {
    height: 34,
  },
  labelBox: {
    "& label": {
      paddingTop: 7,
    },
  },
}));

function AddWarehouseView({ addWarehouse, open, handleClose, selectedWarehouse, formErrors }) {
  const classes = useStyles();
  const cities = ["Karachi", "Lahore", "Islamabad", "Sheikhpura", "Muridke", "Multan", "Faisalabad", "Khairpur"];
  const [validation, setValidation] = useState({});
  const [name, setName] = useState("");
  const [businessWarehouseCode, setBusinessWarehouseCode] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [managerId, setManagerId] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [managers, setManagers] = useState("");
  const [isActive, setActive] = useState(true);
  const [memo, setMemo] = useState("");
  const [singleLocationLatlng, setSingleLocationLatlng] = useState(null);
  const [singleLocationAddress, setSingleLocationAddress] = useState("");

  function getManagers() {
    axios
      .get(getURL("company/CUSTOMER/relations"))
      .then((res) => {
        setManagers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getManagers();
  }, []);

  useEffect(() => {
    setAddress(singleLocationAddress);
  }, [singleLocationAddress]);

  useEffect(() => {
    if (!!selectedWarehouse) {
      setName(selectedWarehouse.name || "");
      setBusinessWarehouseCode(selectedWarehouse.businessWarehouseCode || "");
      setAddress(selectedWarehouse.address || "");
      setCity(selectedWarehouse.city || "");
      setActive(!!selectedWarehouse.isActive);
      setManagerId(selectedWarehouse.managerId || null);
      setCapacity(selectedWarehouse.capacity);
      setMemo(selectedWarehouse.memo || "");
      setSingleLocationLatlng(selectedWarehouse.locationLatlng);
    } else {
      setName("");
      setBusinessWarehouseCode("");
      setAddress("");
      setCity("");
      setActive(true);
      setManagerId(null);
      setCapacity(null);
      setMemo("");
      setSingleLocationLatlng(null);
    }
  }, [selectedWarehouse]);
  const handleSubmit = (e) => {
    const newWarehouse = {
      name,
      businessWarehouseCode,
      address,
      city,
      isActive,
      managerId,
      memo,
      capacity,
      locationLatlng: singleLocationLatlng,
    };
    setValidation({
      businessWarehouseCode: true,
      name: true,
      address: true,
      city: true,
      managerId: true,
      capacity: true,
      singleLocationLatlng: true,
    });
    if (
      isRequired(name) &&
      isRequired(address) &&
      isRequired(city) &&
      isRequired(managerId) &&
      isRequired(capacity) &&
      isRequired(singleLocationLatlng) &&
      isRequired(businessWarehouseCode)
    ) {
      addWarehouse(newWarehouse);
    }
  };

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog
          open={open}
          onClose={handleClose}
          onBackdropClick={() => {
            setValidation("");
          }}
          aria-labelledby="form-dialog-title"
          maxWidth="sm"
          fullWidth
          // style={{ width: 800 }}
        >
          <DialogTitle>{!selectedWarehouse ? "Add Warehouse" : "Edit Warehouse"}</DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container spacing={2}>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={(e) => setValidation({ ...validation, name: true })}
                />
                {validation.name && !isRequired(name) ? <Typography color="error">Name is required!</Typography> : ""}
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
                  margin="dense"
                  id="businessWarehouseCode"
                  label="Business Warehouse Code"
                  type="text"
                  variant="outlined"
                  value={businessWarehouseCode}
                  onChange={(e) => setBusinessWarehouseCode(e.target.value)}
                  onBlur={(e) => setValidation({ ...validation, businessWarehouseCode: true })}
                />
                {validation.businessWarehouseCode && !isRequired(businessWarehouseCode) ? (
                  <Typography color="error">Business warehouse code is required!</Typography>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
                  margin="dense"
                  id="address"
                  label="Address"
                  type="text"
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={(e) => setValidation({ ...validation, address: true })}
                />
                {validation.address && !isRequired(address) ? (
                  <Typography color="error">Address is required!</Typography>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item sm={6}>
                <TextField
                  fullWidth={true}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
                  margin="dense"
                  id="capacity"
                  label="Capacity"
                  type="number"
                  variant="outlined"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value < 0 ? e.target.value == 0 : e.target.value)}
                  onBlur={(e) => setValidation({ ...validation, capacity: true })}
                />
                {validation.capacity && !isRequired(capacity) ? (
                  <Typography color="error">Capacity is required!</Typography>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item sm={6}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="cities"
                    key={cities}
                    options={cities}
                    defaultValue={city ? city : ""}
                    renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
                    getOptionLabel={(city) => city}
                    onBlur={(e) => setValidation({ ...validation, city: true })}
                    onChange={(event, newValue) => {
                      if (newValue) setCity(newValue);
                    }}
                  />
                  {validation.city && !isRequired(city) ? <Typography color="error">City is required!</Typography> : ""}
                </FormControl>
              </Grid>
              <Grid item sm={6}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <Autocomplete
                    id="managers"
                    key={managers}
                    options={managers}
                    defaultValue={selectedWarehouse && selectedWarehouse.Manager ? selectedWarehouse.Manager : ""}
                    renderInput={(params) => <TextField {...params} label="Manager" variant="outlined" />}
                    getOptionLabel={(manager) => manager.username}
                    onBlur={(e) => setValidation({ ...validation, manager: true })}
                    onChange={(event, newValue) => {
                      setManagerId(newValue ? newValue.id : null);
                    }}
                  />
                  {validation.managerId && !isRequired(managerId) ? (
                    <Typography color="error">Manager is required!</Typography>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  multiline
                  rows={6}
                  InputProps={{ inputProps: { maxLength: 1000 }, className: classes.memoBox }}
                  className={classes.labelBox}
                  margin="dense"
                  id="memo"
                  label="Memo"
                  type="text"
                  variant="outlined"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  onBlur={(e) => setValidation({ ...validation, memo: false })}
                />
                <Typography style={{ color: "#1d1d1d", fontSize: 12 }}>Max Length (1000 characters)</Typography>
              </Grid>
              <Grid item sm={12}>
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setActive(e.target.checked)}
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
                Active
              </Grid>
              <Grid item sm={12} style={{ position: "relative", minHeight: 300 }}>
                <GoogleMap
                  setSingleLocationLatlng={setSingleLocationLatlng}
                  singleLocationLatlng={singleLocationLatlng}
                  showSingleSearchField={true}
                  setSingleLocationAddress={setSingleLocationAddress}
                  editable={true}
                />
              </Grid>
              {validation.singleLocationLatlng && !isRequired(singleLocationLatlng) ? (
                <Typography color="error" style={{ marginTop: 20 }}>
                  map location is required!
                </Typography>
              ) : (
                ""
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                setValidation("");
              }}
              color="default"
              variant="contained"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedWarehouse ? "Add Warehouse" : "Update Warehouse"}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU",
})(AddWarehouseView);
