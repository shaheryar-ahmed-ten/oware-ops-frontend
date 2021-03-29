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
  Checkbox
} from '@material-ui/core'

export default function AddWarehouseView({ addWarehouse, open, handleClose, selectedWarehouse }) {
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

    addWarehouse(newWarehouse);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedWarehouse ? 'Add Warehouse' : 'Edit Warehouse'}
          </DialogTitle>
          <DialogContent>
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

                />
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

                />
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

                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="city"
                  label="City"
                  type="text"
                  variant="outlined"
                  value={city}
                  onChange={e => setCity(e.target.value)}

                />
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