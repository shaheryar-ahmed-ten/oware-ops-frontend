import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox
} from '@material-ui/core'

export default function AddProductView({ addProduct, open, handleClose, selectedProduct, brands, uoms, categories, formErrors }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dimensionsCBM, setDimensionsCBM] = useState('');
  const [weight, setWeight] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [uomId, setUomId] = useState('');
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (!!selectedProduct) {
      setName(selectedProduct.name || '');
      setDescription(selectedProduct.description || '');
      setDimensionsCBM(selectedProduct.dimensionsCBM || '');
      setWeight(selectedProduct.weight || '');
      setCategoryId(selectedProduct.categoryId || '');
      setBrandId(selectedProduct.brandId || '');
      setUomId(selectedProduct.uomId || '');
      setActive(!!selectedProduct.isActive);
    } else {
      setName('');
      setDescription('');
      setDimensionsCBM('');
      setWeight('');
      setCategoryId('');
      setBrandId('');
      setUomId('');
      setActive(true);
    }
  }, [selectedProduct])
  const handleSubmit = e => {

    const newProduct = {
      name,
      description,
      dimensionsCBM,
      weight,
      categoryId,
      brandId,
      uomId,
      isActive
    }

    addProduct(newProduct);
  }

  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            {!selectedProduct ? 'Add Product' : 'Edit Product'}
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
                <TextField
                  fullWidth={true}
                  margin="dense"
                  id="description"
                  label="Description"
                  type="text"
                  variant="outlined"
                  value={description}
                  onChange={e => setDescription(e.target.value)}

                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="dimensionsCBM"
                    label="Dimensions CBM"
                    type="text"
                    variant="outlined"
                    value={dimensionsCBM}
                    onChange={e => setDimensionsCBM(e.target.value)}

                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="weight"
                    label="Weight"
                    type="text"
                    variant="outlined"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="categoryId"
                      label="Category"
                      variant="outlined"
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                    >
                      {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>Brand</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="brandId"
                      label="Brand"
                      variant="outlined"
                      value={brandId}
                      onChange={e => setBrandId(e.target.value)}
                    >
                      {brands.map(brand => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl fullWidth={true} variant="outlined">
                    <InputLabel>UoM</InputLabel>
                    <Select
                      fullWidth={true}
                      margin="dense"
                      id="uomId"
                      label="UoM"
                      variant="outlined"
                      value={uomId}
                      onChange={e => setUomId(e.target.value)}
                    >
                      {uoms.map(uom => <MenuItem key={uom.id} value={uom.id}>{uom.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item sm={6}>
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setActive(e.target.checked)}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                  Active
              </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              {!selectedProduct ? 'Add Product' : 'Update Product'}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}