import { Button, Grid, makeStyles, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useState } from 'react'
import ProductsCsvReader from '../../../components/ProductsCsvReader'
import { getURL } from '../../../utils/common'
import CheckIcon from '@material-ui/icons/Check';
import { useNavigate } from 'react-router'
import fileDownload from 'js-file-download'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20,
    },
    headerBtns: {
        display: 'flex',
        justifyContent: 'flex-end',
        boxSizing: 'border-box',
        // padding: 20
    },
    heading: {
        fontWeight: 'bolder',
        boxSizing: 'border-box',
        padding: 20
    },
    systemAlert: {
        marginBottom: 10
    },
    uploadDetails: {
        backgroundColor: 'rgba(202,201,201,0.3)',
        boxSizing: 'border-box',
        padding: 20
    },
    downloadTempBtn: {
        marginRight: 5,
    }
}))

function BulkUpload() {
    const classes = useStyles()
    const navigate = useNavigate()

    const [selectedFile, setSelectedFile] = useState(null)
    const [errorAlerts, setErrorAlerts] = useState([])
    const [successAlerts, setSuccessAlerts] = useState([])

    const bulkUpload = data => {
        let apiPromise = axios.post(getURL('product/bulk'), data)
        apiPromise.then((res) => {
            if (!res.data.success) {
                setSelectedFile(null)
                setErrorAlerts(res.data.message)
                return
            }
            setErrorAlerts([])
            setSuccessAlerts([`${res.data.message}`])
        })
            .catch((err) => {
                setSelectedFile(null)
                setSuccessAlerts([])
                setErrorAlerts(Array.isArray(err.response.data.message) ? err.response.data.message : ["Failed to upload bulk products"])
            })
    }

    const downloadTemplate = () => {
        let apiPromise = axios.get(getURL('product/bulk-template'), {
            responseType: 'blob',
        })
        apiPromise.then((response) => {
            fileDownload(response.data, `Products ${moment().format('DD-MM-yyyy')}.xlsx`);
        })

    }
    return (
        <>
            <Grid container className={classes.root}>
                <Grid item xs={12} alignItems="center">
                    <Typography component="div" variant="h4" className={classes.heading}>Products Bulk Upload</Typography>
                </Grid>
                <Grid item xs={12} alignItems="center" className={classes.headerBtns}>
                    <Grid item xs={2}>
                        <ProductsCsvReader bulkUpload={bulkUpload} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                    </Grid>
                    <Grid item xs={2} className={classes.downloadTempBtn}>
                        <Button variant="contained" color="primary" size="small" fullWidth onClick={downloadTemplate}>Download Template</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" color="primary" size="small" fullWidth onClick={() => navigate('/administration/product')}>Back</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} alignItems="center">
                    <Typography component="div" variant="h4" className={classes.heading}>Bulk Upload Details</Typography>
                </Grid>
                <Grid item xs={12} className={classes.uploadDetails}>
                    {
                        errorAlerts?.map((alert) => {
                            return (
                                <Alert severity="error" className={classes.systemAlert}> {alert} </Alert>
                            )
                        })
                    }
                    {
                        successAlerts?.map((alert) => {
                            return (
                                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success"
                                    className={classes.systemAlert}> {alert}  </Alert>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </>
    )
}

export default BulkUpload
