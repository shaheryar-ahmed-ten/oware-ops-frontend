import { useState, useEffect } from 'react';
import {
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
  Typography
} from '@material-ui/core'
import { isChar, isRequired } from '../../../utils/validators';

export default function AddWarehouseView({ addWarehouse, open, handleClose, selectedWarehouse, formErrors }) {
  const cities = ['Karachi', 'Lahore'];
  const [validation, setValidation] = useState({});
  const [name, setName] = useState('');
  const [businessWarehouseCode, setBusinessWarehouseCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedWarehouse) {
      setName(selectedWarehouse.name || '');
      setBusinessWarehouseCode(selectedWarehouse.businessWarehouseCode || '');
      setAddress(selectedWarehouse.address || '');
      setCity(selectedWarehouse.city || '');
      setActive(!!selectedWarehouse.isActive);
    } else {
      setName('');
      setBusinessWarehouseCode('');
      setAddress('');
      setCity('');
      setActive(true);
    }
  }, [selectedWarehouse])
  const handleSubmit = e => {

    const newWarehouse = {
      name,
      businessWarehouseCode,
      address,
      city,
      isActive
    }
    setValidation({
      name: true,
      address: true,
      city: true
    });
    if (isRequired(name) && isRequired(address) && isRequired(city)) {
      addWarehouse(newWarehouse);
    }
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedWarehouse ? 'Add Warehouse' : 'Edit Warehouse'}
          </DialogTitle>
          <DialogContent>
            {formErrors}
            <Grid container>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  variant="outlined"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={e => setValidation({ ...validation, name: true })}
                />
                {validation.name && !isRequired(name) ? <Typography color="error">Name is required!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="businessWarehouseCode"
                  label="Business Warehouse Code"
                  type="text"
                  variant="outlined"
                  value={businessWarehouseCode}
                  onChange={e => setBusinessWarehouseCode(e.target.value)}
                  onBlur={e => setValidation({ ...validation, businessWarehouseCode: true })}
                />
                {validation.businessWarehouseCode && !isRequired(businessWarehouseCode) ? <Typography color="error">Business warehouse code is required!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="address"
                  label="Address"
                  type="text"
                  variant="outlined"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onBlur={e => setValidation({ ...validation, address: true })}
                />
                {validation.address && !isRequired(address) ? <Typography color="error">Address is required!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <FormControl margin="dense" fullWidth={true} variant="outlined">
                  <InputLabel>City</InputLabel>
                  <Select
                    fullWidth={true}
                    id="city"
                    label="Category"
                    variant="outlined"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    onBlur={e => setValidation({ ...validation, city: true })}
                  >
                    <MenuItem value="" disabled>Select a city</MenuItem>
                    {cities.map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                  </Select>
                  {validation.city && !isRequired(city) ? <Typography color="error">City is required!</Typography> : ''}
                </FormControl>
              </Grid>
              <Grid item sm={12}>
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setActive(e.target.checked)}
                  color="primary"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                  Active
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedWarehouse ? 'Add Warehouse' : 'Update Warehouse'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}