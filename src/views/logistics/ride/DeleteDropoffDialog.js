// DeleteDropoffDialog.jsx
// material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  Grid,
  FormControl,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useState, useEffect } from "react";
import MessageSnackbar from "../../../components/MessageSnackbar";
import axios from "axios";
import { getURL } from "../../../utils/common";
import { Autocomplete } from "@material-ui/lab";

const DeleteDropoffDialog = (props) => {
  const [newDropoffPosition, setNewDropoffPosition] = useState(null);
  const [rides, setRides] = useState([]);
  const [rideId, setRideId] = useState(null);
  const {
    removeDropoffDialogState,
    setRemoveDropoffDialogState,
    idx,
    dropoffs,
    setDropoffs,
    setSelectedDropoffNumber,
    handleChangeDropoffClick,
    handleCancelDropoff,
  } = props;

  return (
    <Dialog open={removeDropoffDialogState} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Grid container>
          <Typography variant="h5" component="div">
            Are you sure you want to delete this Dropoff?
          </Typography>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setRemoveDropoffDialogState(!removeDropoffDialogState);
          }}
          color="default"
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleCancelDropoff(idx);
            setRemoveDropoffDialogState(!removeDropoffDialogState);
          }}
          color="primary"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDropoffDialog;
