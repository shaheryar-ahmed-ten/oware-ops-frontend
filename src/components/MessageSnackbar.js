import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    snackbarStyleViaNestedContent: {
        backgroundColor: 'green'
    }
}))

export default function MessageSnackbar({ showMessage }) {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };
    useEffect(() => {
        if (showMessage)
            handleClick()
    }, [showMessage])
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={10000}
                onClose={handleClose}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            >
                <SnackbarContent
                    aria-describedby="message-id2"
                    className={classes.snackbarStyleViaNestedContent}
                    message={
                        showMessage && showMessage.message
                    }
                />
            </Snackbar>
        </div>
    );
}
