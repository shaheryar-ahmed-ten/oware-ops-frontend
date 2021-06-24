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
    const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('')
    const [vendorName, setVendorName] = useState('')
    const [vendorId, setVendorId] = useState(null)
    const [driverCNIC, setDriverCNIC] = useState('')
    const [drivingLicense, setDrivingLicense] = useState(null)
    const [CNIC, setCNIC] = useState(null)
    useEffect(() => {
        if (open)
            resetLocalStates()
        if (selectedDriver) {
            setDriverName(selectedDriver.name);
            setDriverPhone(selectedDriver.phone)
            setDrivingLicenseNumber(selectedDriver.drivingLicenseNumber)
            setVendorName(selectedDriver.Vendor.name)
            setVendorId(selectedDriver.Vendor.id)
            setDriverCNIC(selectedDriver.cnicNumber)
        }
        else {
            resetLocalStates()
        }
    }, [open])
    const resetLocalStates = () => {
        setDriverName('');
        setDriverPhone('');
        setValidation({});
        setDrivingLicenseNumber('');
        setVendorName('');
        setVendorId(null);
        setDriverCNIC(null);
        setDrivingLicense(null);
        setCNIC(null);
    }

    const handleSubmit = () => {

        const newDriver = {
            name: driverName,
            phone: driverPhone,
            drivingLicenseNumber: drivingLicenseNumber,
            companyId: vendorId,
            cnicNumber: driverCNIC,
            // drivingLicenseId: drivingLicense,
            // cnicId: CNIC
        }

        setValidation({
            driverName: true,
            driverPhone: true,
            validation: true,
            drivingLicenseNumber: true,
            vendorId: true,
            driverCNIC: true,
            drivingLicense: true,
            CNIC: true,
        });
        if (isRequired(driverName) &&
            isRequired(driverPhone) &&
            isRequired(validation) &&
            isRequired(drivingLicenseNumber) &&
            isRequired(vendorId) &&
            isRequired(driverCNIC) &&
            isRequired(drivingLicense) &&
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
                                        label="Driving License Number"
                                        type="text"
                                        variant="outlined"
                                        value={drivingLicenseNumber}
                                        onChange={e => setDrivingLicenseNumber(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, drivingLicenseNumber: true })}
                                    />
                                    {validation.drivingLicenseNumber && !isRequired(drivingLicenseNumber) ? <Typography color="error">License number is required!</Typography> : ''}
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
                                            onChange={e => setVendorId(e.target.value)}
                                            onBlur={e => setValidation({ ...validation, vendorId: true })}
                                        >
                                            {
                                                vendorId && vendorId !== "" ?
                                                    <MenuItem value={vendorId} disabled>{vendorName}</MenuItem>
                                                    :
                                                    <MenuItem value={""} disabled>Select Vendor</MenuItem>
                                            }
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
                                            color={drivingLicense ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Driving License {drivingLicense ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setDrivingLicense(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.drivingLicense && !isRequired(drivingLicense) ? <Typography color="error">Running paper is required!</Typography> : ''}
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
