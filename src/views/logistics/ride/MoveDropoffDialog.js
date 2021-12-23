// MoveDropoffDialog.jsx
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
  makeStyles,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useState, useEffect } from "react";
import MessageSnackbar from "../../../components/MessageSnackbar";
import { arraymove } from "../../../utils/common";

const useStyles = makeStyles((theme) => ({
  positionBlock: {
    width: 110,
  },
}));

const MoveDropoffDialog = (props) => {
  const classes = useStyles();
  const [newDropoffPosition, setNewDropoffPosition] = useState(null);
  const {
    dropoffDialogState,
    setDropoffDialogState,
    idx,
    dropoffs,
    setDropoffs,
    setSelectedDropoffNumber,
    handleDropoffClick,
    setShowConfirmMessage,
    resetDropoffState,
  } = props;

  const [positionError, setPositionError] = useState(false);

  // useEffect(() => {
  //   const newDropoffs = removeDuplicateDropoff(dropoffs);
  //   setDropoffs(newDropoffs);
  // }, [dropoffs]);

  const removeDuplicateDropoff = (data) => {
    const prevAdded = [];
    const newArray = [];
    if (data.length > 0) {
      data.forEach((item) => {
        if (!prevAdded.includes(item.outwardId)) {
          newArray.push(item);
          prevAdded.push(item.outwardId);
        }
      });
    }

    return newArray;
  };

  const handleConfirm = async () => {
    if (dropoffs[newDropoffPosition - 1]) {
      setShowConfirmMessage(true);
      arraymove(dropoffs, idx, newDropoffPosition - 1);
      setDropoffs(dropoffs);
      resetDropoffState(dropoffs[idx]);
      setDropoffDialogState(!dropoffDialogState);
      // setPositionError(false);
      // setNewDropoffPosition(null)
    } else {
      setPositionError(true);
    }
  };

  return (
    <Dialog open={dropoffDialogState} maxWidth="sm" fullWidth>
      <DialogTitle>{`Re-Position Dropoff ${idx + 1}`}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        {/* <IconButton
          onClick={() => {
            setDropoffDialogState(!dropoffDialogState);
          }}
        >
          <Close />
        </IconButton> */}
      </Box>
      <DialogContent style={{ overflow: "hidden" }}>
        <Grid container item xs={12} spacing={1} justifyContent="center" alignItems="center">
          {/* {newDropoffPosition ? (
            <Typography variant="p" className={{ fontWeight: 500 }} style={{ marginRight: 20 }}>
              &nbsp; After Dropoff &nbsp;{" "}
              {Number(newDropoffPosition) > idx + 1 ? Number(newDropoffPosition) : Number(newDropoffPosition) - 1 + " "}{" "}
              {"  "}
              {"  "}
            </Typography>
          ) : (
            ""
          )} */}
          <Grid container item xs={6}>
            <Typography>Bring it to new Position</Typography>
          </Grid>

          <Grid container item xs={6}>
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1, max: dropoffs.length }, className: classes.positionBlock }}
              id="outlined-basic"
              label="Position"
              variant="outlined"
              value={newDropoffPosition}
              style={{ maxWidth: "50%", marginLeft: "-80px" }}
              // onChange={(e) => {
              //   const regex = /[0-9]/;
              //   if (regex.test(e.target.value))
              //     setNewDropoffPosition(e.target.value < 0 ? e.target.value == 0 : e.target.value);
              // }}
              onChange={
                (e) => {
                  // if (e.target.value < 1) {
                  //   setNewDropoffPosition(1);
                  // } else if (e.target.value > dropoffs.length) {
                  //   setNewDropoffPosition(dropoffs.length);
                  // } else {
                  //   setNewDropoffPosition(e.target.value);
                  // }
                  setNewDropoffPosition(e.target.value < 1 ? e.target.value == 1 : e.target.value);
                }
                // e.target.value < 1
                //   ? setNewDropoffPosition(1)
                //   : e.target.value > dropoffs.length
                //   ? setNewDropoffPosition(dropoffs.length)
                //   : setNewDropoffPosition(e.target.value)
              }
            />
            {/* {newDropoffPosition ? (
            <Typography variant="p" className={{ fontWeight: 500, marginLeft: 10 }} style={{ marginLeft: 20 }}>
              {" "}
              Before Dropoff{" "}
              {Number(newDropoffPosition) < idx + 1 ? Number(newDropoffPosition) : Number(newDropoffPosition) + 1}
            </Typography>
          ) : (
            ""
          )} */}
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1} justifyContent="center" alignItems="center">
          {positionError ? <Typography color="error">Incorrect Dropoff Position!</Typography> : ""}
        </Grid>
      </DialogContent>
      <DialogActions style={{ marginBottom: 12, marginTop: 12 }}>
        <Button
          // color="primary"
          variant="contained"
          onClick={() => {
            setDropoffDialogState(!dropoffDialogState);
            setPositionError(false);
            setNewDropoffPosition(null);
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

export default MoveDropoffDialog;
