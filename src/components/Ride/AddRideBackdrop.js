import { Backdrop, Button, Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import React from "react";
import { isRequired } from "../../utils/validators";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    // color: '#fff',
    boxSizing: "border-box",
    padding: "1rem 24rem",
  },
  actionButtonGrid: {
    boxSizing: "border-box",
    padding: "1rem 4rem",
  },
  textFieldGrid: {
    margin: 10,
  },
}));

function AddRideBackdrop({ setOpenReplaceRideBackdrop, minDropoff, maxDropoff }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  console.log("minDropoff, maxDropoff", minDropoff, maxDropoff);
  const handleClose = () => {
    // setOpen(false);
    setOpenReplaceRideBackdrop(false);
  };

  const [formValue, setFormValue] = React.useState({
    valOne: "",
  });

  const checkForError = (valueToBeChecked) => {
    if (
      formValue.valOne === formValue.valTwo ||
      !isRequired(valueToBeChecked) ||
      valueToBeChecked > maxDropoff ||
      valueToBeChecked < minDropoff
    ) {
      return true;
    }
    return false;
  };

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <Grid container justifyContent="center" alignItems="center" style={{ backgroundColor: "#ffffff" }}>
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <Typography variant="h1">Replace</Typography>
        </Grid>
        {/* <Grid item xs={12} container justifyContent="center" alignItems="center"
                    className={classes.textFieldGrid}>
                    <TextField
                        type="Number"
                        required id="rep1" placeholder="3"
                        error={checkForError(formValue.valOne)}
                        InputProps={{ inputProps: { min: minDropoff, max: maxDropoff } }}
                        value={formValue.valOne}
                        onChange={(e) => { setFormValue({ ...formValue, valOne: e.target.value }) }}
                        helperText="Dropoff Number(*)" />
                </Grid> */}
        <Grid item xs={12} container justifyContent="center" alignItems="center" className={classes.textFieldGrid}>
          <TextField
            type="Number"
            required
            id="rep2"
            placeholder="1"
            InputProps={{ inputProps: { min: minDropoff, max: maxDropoff } }}
            value={formValue.valTwo}
            error={checkForError(formValue.valTwo)}
            onChange={(e) => {
              setFormValue({ ...formValue, valTwo: e.target.value });
            }}
            helperText="Dropoff Number(*)"
          />
        </Grid>
        <Grid item xs={6} container justifyContent="flex-end" alignItems="center" className={classes.actionButtonGrid}>
          <Button variant="contained" fullWidth color="error" onClick={handleClose}>
            Cancel
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          container
          justifyContent="flex-start"
          alignItems="center"
          className={classes.actionButtonGrid}
        >
          <Button variant="contained" fullWidth color="primary">
            Replace
          </Button>
        </Grid>
      </Grid>
    </Backdrop>
  );
}

export default AddRideBackdrop;
