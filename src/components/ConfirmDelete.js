import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'

export default function ConfirmDelete({ confirmDelete, open, handleClose, selectedEntity, title }) {
  return (
    <div style={{ display: "inline" }}>
      <form>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Typography variant="h5" component="div">Are you sure you want to delete {selectedEntity}?</Typography>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
            <Button onClick={confirmDelete} color="primary" variant="contained">
              Delete {title}
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}