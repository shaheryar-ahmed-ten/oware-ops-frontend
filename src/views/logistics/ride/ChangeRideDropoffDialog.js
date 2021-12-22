// ChangeRideDropoffDialog.jsx
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

const ChangeRideDropoffDialog = (props) => {
  const [newDropoffPosition, setNewDropoffPosition] = useState(null);
  const [rides, setRides] = useState([]);
  const [rideId, setRideId] = useState(null);
  const {
    changeDropoffDialogState,
    setChangeDropoffDialogState,
    idx,
    dropoffs,
    setDropoffs,
    setSelectedDropoffNumber,
    handleChangeDropoffClick,
    setShowChangeConfirmMessage,
  } = props;

  const handleConfirm = async () => {
    callChangeRideApi();
    setShowChangeConfirmMessage(true);
    const drop = dropoffs.splice(idx, 1)[0];
    dropoffs.splice(newDropoffPosition - 1, 0, drop);
    setDropoffs(dropoffs);
    setSelectedDropoffNumber(newDropoffPosition);
    handleChangeDropoffClick(newDropoffPosition - 1);
    setChangeDropoffDialogState(!changeDropoffDialogState);
  };

  const callChangeRideApi = async (id) => {
    axios
      .put(getURL(`ride/changeRide/${id}`))
      .then((res) => {
        setRides(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRides = () => {
    axios
      .get(getURL("ride/all"))
      .then((res) => {
        setRides(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRides();
  }, []);

  return (
    <Dialog open={changeDropoffDialogState} maxWidth="sm" fullWidth>
      <DialogTitle>{`Assign Dropoff To ride`}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton
          onClick={() => {
            setChangeDropoffDialogState(!changeDropoffDialogState);
          }}
        >
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Grid container item xs={12} spacing={1} justifyContent="center" alignItems="center">
          <FormControl margin="dense" fullWidth={true} variant="outlined">
            <Autocomplete
              id="rides"
              key={rides}
              options={Object.values(rides)}
              renderInput={(params) => <TextField {...params} label="Loads" variant="outlined" />}
              getOptionLabel={(rides) => rides.internalIdForBusiness || ""}
              onChange={(event, newValue) => {
                if (newValue.id) {
                  setRideId(newValue.id);
                }
              }}
            />
          </FormControl>
          {/* {validation.outwardId && !isRequired(outwardId) ? (
            <Typography color="error">Outward is required!</Typography>
          ) : (
            ""
          )} */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setChangeDropoffDialogState(!changeDropoffDialogState);
          }}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            handleConfirm();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeRideDropoffDialog;
