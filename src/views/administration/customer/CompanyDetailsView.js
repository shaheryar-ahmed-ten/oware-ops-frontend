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
                            View {relationType == 'CUSTOMER' ? ` Company` : ` Vendor`}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="cId"
                                            label={'Venodr ID'}
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
                                            multiline
                                            rows={3}
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
                                            multiline
                                            rows={3}
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
                                    {(selectedCompany && selectedCompany.logoId) ?
                                    <Grid item xs={12} style={{fontWeight:600 }}>
                                            Logo
                                    </Grid>
                                    : ''}
                                    <Grid item xs={12} style={{textAlign: 'center'}}>
                                        {(selectedCompany && selectedCompany.logoId) ?
                                            <a target="_blank" href={getURL('preview', selectedCompany.logoId)}><img src={getURL('preview', selectedCompany.logoId)} alt="Company Logo" /></a>
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
