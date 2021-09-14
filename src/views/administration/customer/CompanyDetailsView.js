import React from 'react'
import {
    Grid,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { getURL, digitize } from '../../../utils/common';

function CompanyDetailsView({ open, handleClose, selectedCompany, relationType }) {
    return (
        selectedCompany ?
            <div style={{ display: "inline" }}>
                <form>
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle>
                            View {relationType.toTitleCase()}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="cId"
                                            label={'Company ID'}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedCompany.internalIdForBusiness}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="company"
                                            label={'Vendor Name'}
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedCompany.name}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="contact"
                                            label="Contact Name"
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedCompany.Contact.firstName + ' ' + selectedCompany.Contact.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="email"
                                            label="Contact Email"
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedCompany.Contact.email}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="notes"
                                            label="Notes"
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedCompany.notes}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="status"
                                            label="Status"
                                            type="text"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            variant="filled"
                                            value={selectedCompany.isActive ? 'Active' : 'In-Active'}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        {(selectedCompany && selectedCompany.logoId) ?
                                            <a target="_blank" href={getURL('preview', selectedCompany.logoId)}>Logo Image</a>
                                        : ''}
                                     </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="default" variant="contained">Close</Button>
                        </DialogActions>

                    </Dialog>
                </form>
            </div>
            :
            null
    )
}

export default CompanyDetailsView
