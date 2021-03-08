import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, Box, Typography } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox';

export default function FormDialog() {
    const [open, setOpen] = React.useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isactive, setActive] = useState(false)
    const [user, setUser] = useState([]);
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,

        }
        setUser(users => {
            return [...users, newUser]
        })
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
    }

    return (
        <form>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Add User
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <Typography variant="h4">Add User</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid item sm="12">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="firstName"
                            label="First Name"
                            type="text"
                            variant="outlined"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="lastName"
                            label="Last Name"
                            type="text"
                            variant="outlined"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}

                        />
                    </Grid>
                    <Grid sm>
                        <TextField
                            fullWidth="true"
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={e => setEmail(e.target.value)}

                        />
                    </Grid>
                    <Grid sm>
                        <TextField
                            fullWidth="true"
                            autoFocus
                            margin="dense"
                            id="phone"
                            label="Phone Number"
                            type="phone"
                            variant="outlined"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}

                        />
                    </Grid>
                    <Checkbox
                        defaultChecked
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">Cancel</Button>
                    <Button onSubmit={handleSubmit} color="primary" variant="contained">Add User</Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}