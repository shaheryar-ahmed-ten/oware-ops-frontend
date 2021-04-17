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
  Checkbox,
  Typography
} from '@material-ui/core'
import { isRequired } from '../../../utils/validators';

export default function AddProductView({ addProduct, open, handleClose, selectedProduct, brands, uoms, categories, formErrors }) {
  const [validation, setValidation] = useState({});
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

    setValidation({
      name: true,
      description: true,
      dimensionsCBM: true,
      weight: true,
      categoryId: true,
      brandId: true,
      uomId: true,
    });
    if (isRequired(name) &&
      isRequired(description) &&
      isRequired(dimensionsCBM) &&
      isRequired(weight) &&
      isRequired(categoryId) &&
      isRequired(brandId) &&
      isRequired(uomId)
    ) {
      addProduct(newProduct);
    }
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
                  onBlur={e => setValidation({ ...validation, name: true })}
                />
                {validation.name && !isRequired(name) ? <Typography color="error">Name is required!</Typography> : ''}
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
                  onBlur={e => setValidation({ ...validation, description: true })}
                />
                {validation.description && !isRequired(description) ? <Typography color="error">Description is required!</Typography> : ''}
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="dimensionsCBM"
                    label="Volume cm3"
                    type="number"
                    variant="outlined"
                    value={dimensionsCBM}
                    onChange={e => setDimensionsCBM(e.target.value)}
                    onBlur={e => setValidation({ ...validation, dimensionsCBM: true })}
                  />
                  {validation.dimensionsCBM && !isRequired(dimensionsCBM) ? <Typography color="error">Volume is required!</Typography> : ''}
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    fullWidth={true}
                    margin="dense"
                    id="weight"
                    label="Weight in KGs"
                    type="number"
                    variant="outlined"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    onBlur={e => setValidation({ ...validation, weight: true })}
                  />
                  {validation.weight && !isRequired(weight) ? <Typography color="error">Weight is required!</Typography> : ''}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      fullWidth={true}
                      id="categoryId"
                      label="Category"
                      variant="outlined"
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, categoryId: true })}
                    >
                      {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                    </Select>
                    {validation.categoryId && !isRequired(categoryId) ? <Typography color="error">Category is required!</Typography> : ''}
                  </FormControl>
                </Grid>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>Brand</InputLabel>
                    <Select
                      fullWidth={true}
                      id="brandId"
                      label="Brand"
                      variant="outlined"
                      value={brandId}
                      onChange={e => setBrandId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, brandId: true })}
                    >
                      {brands.map(brand => <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>)}
                    </Select>
                    {validation.brandId && !isRequired(brandId) ? <Typography color="error">Brand is required!</Typography> : ''}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <FormControl margin="dense" fullWidth={true} variant="outlined">
                    <InputLabel>UoM</InputLabel>
                    <Select
                      fullWidth={true}
                      id="uomId"
                      label="UoM"
                      variant="outlined"
                      value={uomId}
                      onChange={e => setUomId(e.target.value)}
                      onBlur={e => setValidation({ ...validation, uomId: true })}
                    >
                      {uoms.map(uom => <MenuItem key={uom.id} value={uom.id}>{uom.name}</MenuItem>)}
                    </Select>
                    {validation.uomId && !isRequired(uomId) ? <Typography color="error">UoM is required!</Typography> : ''}
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