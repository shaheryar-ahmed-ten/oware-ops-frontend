import {
    Grid,
    Button,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@material-ui/core'
import { isPhone, isRequired } from '../../../utils/validators';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useEffect, useState } from 'react'

function AddDriverView({ selectedDriver, companies, formErrors, addDriver, open, handleClose }) {
    const [driverName, setDriverName] = useState('')
    const [driverPhone, setDriverPhone] = useState('')
    const [validation, setValidation] = useState({});
    const [drivingLicenceNumber, setDrivingLicenceNumber] = useState('')
    const [vendorId, setVendorId] = useState(null)
    const [driverCNIC, setDriverCNIC] = useState('')
    const [drivingLicence, setDrivingLicence] = useState(null)
    const [CNIC, setCNIC] = useState(null)
    useEffect(() => {
        if (open)
            resetLocalStates()
    }, [open])
    const resetLocalStates = () => {
        setDriverName('');
        setDriverPhone('');
        setValidation({});
        setDrivingLicenceNumber('');
        setVendorId(null);
        setDriverCNIC(null);
        setDrivingLicence(null);
        setCNIC(null);
    }

    const handleSubmit = () => {

        const newDriver = {
            driverName,
            driverPhone,
            validation,
            drivingLicenceNumber,
            vendorId,
            driverCNIC,
            drivingLicence,
            CNIC
        }

        setValidation({
            driverName: true,
            driverPhone: true,
            validation: true,
            drivingLicenceNumber: true,
            vendorId: true,
            driverCNIC: true,
            drivingLicence: true,
            CNIC: true,
        });
        if (isRequired(driverName) &&
            isRequired(driverPhone) &&
            isRequired(validation) &&
            isRequired(drivingLicenceNumber) &&
            isRequired(vendorId) &&
            isRequired(driverCNIC) &&
            isRequired(drivingLicence) &&
            isRequired(CNIC)) {
            addDriver(newDriver);
        }

    }
    return (
        <div style={{ display: "inline" }}>
            <form>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle>
                        {!selectedDriver ? 'Add Driver' : 'Edit Driver'}
                    </DialogTitle>
                    <DialogContent>
                        {formErrors}
                        <Grid container>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="selectedDriver"
                                        label="Driver Name"
                                        type="text"
                                        variant="outlined"
                                        value={driverName}
                                        disabled={!!selectedDriver}
                                        onChange={e => setDriverName(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, driverName: true })}
                                    />
                                    {validation.driverName && !isRequired(driverName) ? <Typography color="error">Driver name is required!</Typography> : ''}
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="driverliceneNumber"
                                        label="Driving Licence Number"
                                        type="text"
                                        variant="outlined"
                                        value={drivingLicenceNumber}
                                        disabled={!!selectedDriver}
                                        onChange={e => setDrivingLicenceNumber(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, drivingLicenceNumber: true })}
                                    />
                                    {validation.drivingLicenceNumber && !isRequired(drivingLicenceNumber) ? <Typography color="error">Licence number is required!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel>Vendor</InputLabel>
                                        <Select
                                            fullWidth={true}
                                            id="vendorId"
                                            label="Vendor"
                                            variant="outlined"
                                            value={vendorId}
                                            disabled={!!selectedDriver}
                                            onChange={e => setVendorId(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, vendorId: true })}
                                        >
                                            <MenuItem value="" disabled>Select Vendor</MenuItem>
                                            {companies.map(vendor => <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>)}
                                        </Select>
                                        {validation.vendorId && !isRequired(vendorId) ? <Typography color="error">Vendor is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                                <Grid item sm={6}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="driverPhone"
                                        label="Driver Phone"
                                        type="text"
                                        variant="outlined"
                                        value={driverPhone}
                                        placeholder="0346xxxxxx8"
                                        onChange={e => setDriverPhone(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, driverPhone: true })}
                                    />
                                    {validation.driverPhone && !isRequired(driverPhone) ? <Typography color="error">Receiver phone is required!</Typography> : ''}
                                    {validation.driverPhone && !isPhone(driverPhone) ? <Typography color="error">Incorrect phone number!</Typography> : ''}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <TextField
                                        fullWidth={true}
                                        margin="dense"
                                        id="cnic"
                                        label="Driver CNIC"
                                        type="text"
                                        variant="outlined"
                                        value={driverCNIC}
                                        disabled={!!selectedDriver}
                                        placeholder="99999-9999999-3"
                                        onChange={e => setDriverCNIC(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, driverCNIC: true })}
                                    />
                                    {validation.driverCNIC && !isRequired(driverCNIC) ? <Typography color="error">Driver CNIC number is required!</Typography> : ''}
                                </Grid>

                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={drivingLicence ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Driving Licence {drivingLicence ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setDrivingLicence(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.drivingLicence && !isRequired(drivingLicence) ? <Typography color="error">Running paper is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={CNIC ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Driver CNIC {CNIC ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setCNIC(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.CNIC && !isRequired(CNIC) ? <Typography color="error">Route Permit is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>

                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default" variant="contained">Cancel</Button>
                        <Button onClick={handleSubmit} color="primary" variant="contained">
                            {!selectedDriver ? 'Add Driver' : 'Update Driver'}
                        </Button>
                    </DialogActions>

                </Dialog>
            </form>
        </div>
    )
}

export default AddDriverView
