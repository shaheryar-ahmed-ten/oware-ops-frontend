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
  Typography
} from '@material-ui/core'
import { isRequired } from '../../../utils/validators';

export default function AddUoMView({ addUoM, open, handleClose, selectedUoM, formErrors }) {
  const [validation, setValidation] = useState({});
  const [name, setName] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedUoM) {
      setName(selectedUoM.name || '');
      setActive(!!selectedUoM.isActive);
    } else {
      setName('');
      setActive(true);
    }
  }, [selectedUoM])
  const handleSubmit = e => {

    const newUoM = {
      name,
      isActive
    }
    setValidation({
      name: true
    });
    if (isRequired(name)) {
      addUoM(newUoM);
    }
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedUoM ? 'Add UoM' : 'Edit UoM'}
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
              {!selectedUoM ? 'Add UoM' : 'Update UoM'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}