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

export default function AddCategoryView({ addCategory, open, handleClose, selectedCategory, formErrors }) {
  const [name, setName] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedCategory) {
      setName(selectedCategory.name || '');
      setActive(!!selectedCategory.isActive);
    } else {
      setName('');
      setActive(true);
    }
  }, [selectedCategory])
  const handleSubmit = e => {

    const newCategory = {
      name,
      isActive
    }

    addCategory(newCategory);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedCategory ? 'Add Category' : 'Edit Category'}
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
              {!selectedCategory ? 'Add Category' : 'Update Category'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}