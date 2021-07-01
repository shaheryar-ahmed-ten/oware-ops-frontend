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
import { upload } from '../../../utils/upload';

function AddDriverView({ selectedDriver, companies, formErrors, open, handleClose, addDriver }) {
    const [driverName, setDriverName] = useState('')
    const [driverPhone, setDriverPhone] = useState('')
    const [validation, setValidation] = useState({});
    const [vendorName, setVendorName] = useState('')
    const [vendorId, setVendorId] = useState(null)
    const [cnicNumber, setCNICNumber] = useState('')
    const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('')
    const [drivingLicenseImage, setDrivingLicenseImage] = useState(null)
    const [CNICImage, setCNICImage] = useState(null)
    useEffect(() => {
        if (open)
            resetLocalStates()
        if (selectedDriver) {
            setDriverName(selectedDriver ? selectedDriver.name : '');
            setDriverPhone(selectedDriver ? selectedDriver.phone : '');
            setDrivingLicenseNumber(selectedDriver ? selectedDriver.drivingLicenseNumber : '');
            setVendorName(selectedDriver.Vendor ? selectedDriver.Vendor.name : '');
            setVendorId(selectedDriver.Vendor ? selectedDriver.Vendor.id : '');
            setCNICNumber(selectedDriver ? selectedDriver.cnicNumber : '');
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
        setCNICNumber(null);
        setDrivingLicenseImage(null);
        setCNICImage(null);
    }

    const handleSubmit = async () => {

        let newDriver = {
            name: driverName,
            phone: driverPhone,
            drivingLicenseNumber: drivingLicenseNumber,
            companyId: vendorId,
            cnicNumber: cnicNumber,
        }
        setValidation({
            driverName: true,
            driverPhone: true,
            validation: true,
            drivingLicenseNumber: true,
            vendorId: true,
            cnicNumber: true,
            drivingLicenseImage: true,
            CNICImage: true,
        });
        if (isRequired(driverName) &&
            isRequired(driverPhone) &&
            isRequired(validation) &&
            isRequired(drivingLicenseNumber) &&
            isRequired(vendorId) &&
            isRequired(cnicNumber) &&
            isRequired(drivingLicenseImage) &&
            isRequired(CNICImage)) {
            const [drivingLicenseId, cnicNumberId] = await upload([drivingLicenseImage, CNICImage], 'driver');
            newDriver = { ...newDriver, drivingLicenseId, cnicNumberId };
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
                                        label="Driver CNICImage"
                                        type="text"
                                        variant="outlined"
                                        value={cnicNumber}
                                        placeholder="99999-9999999-3"
                                        onChange={e => setCNICNumber(e.target.value)}
                                        onBlur={e => setValidation({ ...validation, cnicNumber: true })}
                                    />
                                    {validation.cnicNumber && !isRequired(cnicNumber) ? <Typography color="error">Driver CNICImage number is required!</Typography> : ''}
                                </Grid>

                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={drivingLicenseImage ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Driving License {drivingLicenseImage ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setDrivingLicenseImage(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.drivingLicenseImage && !isRequired(drivingLicenseImage) ? <Typography color="error">Running paper is required!</Typography> : ''}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <Button
                                            variant="contained"
                                            component="label"
                                            color={CNICImage ? 'primary' : 'default'}
                                            startIcon={<CloudUploadIcon />}
                                        >
                                            Driver CNICImage {CNICImage ? 'Uploaded' : ''}
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => { setCNICImage(e.target.files[0]) }}
                                            />
                                        </Button>
                                        {validation.CNICImage && !isRequired(CNICImage) ? <Typography color="error">Route Permit is required!</Typography> : ''}
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
