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

export default function AddBrandView({ addBrand, open, handleClose, selectedBrand }) {
  const [name, setName] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (!!selectedBrand) {
      setName(selectedBrand.name || '');
      setManufacturerName(selectedBrand.manufacturerName || '');
      console.log(!!selectedBrand.isActive)
      setActive(!!selectedBrand.isActive);
    } else {
      setName('');
      setManufacturerName('');
      setActive(false);
    }
  }, [selectedBrand])
  const handleSubmit = e => {

    const newBrand = {
      name,
      manufacturerName,
      isActive
    }

    addBrand(newBrand);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedBrand ? 'Add Brand' : 'Edit Brand'}
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
                  id="manufacturerName"
                  label="ManufacturerName Number"
                  type="text"
                  variant="outlined"
                  value={manufacturerName}
                  onChange={e => setManufacturerName(e.target.value)}

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
              {!selectedBrand ? 'Add Brand' : 'Update Brand'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}