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
    topHeader: {
        boxSizing: 'border-box',
        paddingRight: 5
    },
    heading: {
        fontWeight: 'bolder',
        boxSizing: 'border-box',
        padding: 20
    },
    subHeading: {
        fontWeight: 'normal',
        boxSizing: 'border-box',
        padding: 20,
        fontSize: 18
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
    },
    backBtn: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    subHeadingGuideline: {
        fontWeight: 'normal',
        boxSizing: 'border-box',
        padding: 20,
        fontSize: 18,
        paddingBottom: 0
    },
    guidelines: {
        boxSizing: 'border-box',
        padding: 20
    },
    guideLine: {
        marginTop: 5
    }
}))

function BulkUpload() {
    const classes = useStyles()
    const navigate = useNavigate()

    const [fileUploaded, setfileUploaded] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [errorAlerts, setErrorAlerts] = useState([])
    const [successAlerts, setSuccessAlerts] = useState([])


    const bulkUpload = data => {
        
        setfileUploaded(true)
        let temp = []
        
        if (!(Array.isArray(data.products) && data.products.length > 0)) {
            setSelectedFile(null)
            setSuccessAlerts([])
            setErrorAlerts(["Can not upload file having zero product inwards."])
            return
        }
        let apiPromise = axios.post(getURL('product-inward/bulk'), data.products)
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
                setErrorAlerts(Array.isArray(err.response.data.message) ? err.response.data.message : ["Failed to upload bulk product inwards"])
            })
    }

    const downloadTemplate = () => {
        let apiPromise = axios.get(getURL('product-inward/bulk-template'), {
            responseType: 'blob',
        })
        apiPromise.then((response) => {
            fileDownload(response.data, `Product Inwards ${moment().format('DD-MM-yyyy')}.xlsx`);
        })
    }
    return (
        <>
            <Grid container className={classes.root}>
                <Grid container item xs={12} alignItems="center" className={classes.topHeader}>
                    <Grid item xs={10}>
                        <Typography component="div" variant="h4" className={classes.heading}>Product Inward Bulk Upload</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.backBtn}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/operations/product-inward')}>Back</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} alignItems="center" className={classes.headerBtns}>
                    <Grid item xs={3} className={classes.downloadTempBtn}>
                        <Button variant="contained" color="primary" fullWidth onClick={downloadTemplate}>Download Template</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <ProductsCsvReader bulkUpload={bulkUpload} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                    </Grid>
                </Grid>
                {
                    fileUploaded ?
                        <>
                            <Grid item xs={12} alignItems="center">
                                <Typography component="div" className={classes.subHeading}>Bulk Upload Details</Typography>
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
                        </>
                        :
                        <>
                            <Grid item xs={12} alignItems="center">
                                <Typography component="div" className={classes.subHeadingGuideline}>Bulk Upload Guidelines</Typography>
                            </Grid>
                            <Grid item xs={12} alignItems="center" className={classes.guidelines}>
                                <Alert severity="info" className={classes.guideLine}>Maximum of 1000 product inwards are allowed to be included for upload in a single file.</Alert>
                                <Alert severity="info" className={classes.guideLine}>The following special characters are not allowed in product names -  !@#$%^\=\[\]{ };:\\|>\/?</Alert>
                                <Alert severity="info" className={classes.guideLine}>The Company, Warehouse & Product values must exist in the system before being used in bulk upload.</Alert>
                                <Alert severity="info" className={classes.guideLine}>The template contains sample value for product inward rows which must be replaced with actual values before upload.</Alert>
                            </Grid>
                        </>
                }
            </Grid>
        </>
    )
}

export default BulkUpload
