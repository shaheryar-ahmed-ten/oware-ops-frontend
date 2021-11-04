import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Typography,
  makeStyles
} from '@material-ui/core'
import { isRequired } from '../../../utils/validators';

const useStyles = makeStyles((theme) => ({
  textBox: {
    height: 34
  },
  labelBox: {
    "& label": {
      paddingTop: 7
    }
  }
}));

export default function AddBrandView({ addBrand, open, handleClose, selectedBrand, formErrors }) {

  const classes = useStyles();

  const [validation, setValidation] = useState({});
  const [name, setName] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedBrand) {
      setName(selectedBrand.name || '');
      setManufacturerName(selectedBrand.manufacturerName || '');
      setActive(!!selectedBrand.isActive);
    } else {
      setName('');
      setManufacturerName('');
      setActive(true);
    }
  }, [selectedBrand])
  const handleSubmit = e => {

    const newBrand = {
      name,
      manufacturerName,
      isActive
    }
    setValidation({
      name: true
    });
    if (isRequired(name)) {
      addBrand(newBrand);
    }
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedBrand ? 'Add Brand' : 'Edit Brand'}
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
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
                  onChange={e => setName(e.target.value)}
                  onBlur={e => setValidation({ ...validation, name: true })}
                  
                />
                {validation.name && !isRequired(name) ? <Typography color="error">Name is required!</Typography> : ''}
              </Grid>
              <Grid item sm={12}>
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="manufacturerName"
                  label="Manufacturer Name"
                  type="text"
                  variant="outlined"
                  value={manufacturerName}
                  onChange={e => setManufacturerName(e.target.value)}
                  onBlur={e => setValidation({ ...validation, manufacturerName: true })}
                  inputProps={{ className: classes.textBox }}
                  className={classes.labelBox}
                />
                {validation.manufacturerName && !isRequired(manufacturerName) ? <Typography color="error">Manufacturer name is required!</Typography> : ''}
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