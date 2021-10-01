import { Grid, makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useState } from 'react'
import ProductsCsvReader from '../../../components/ProductsCsvReader'
import { getURL } from '../../../utils/common'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20,
    }
}))

function BulkUpload() {
    const classes = useStyles()

    const [selectedFile, setSelectedFile] = useState(null)
    const [errorAlerts, setErrorAlerts] = useState([])

    const bulkUpload = data => {
        let apiPromise = axios.post(getURL('product/bulk'), data)
        apiPromise.then((res) => {
            if (!res.data.success) {
                setSelectedFile(null)
                setErrorAlerts([{
                    message: `${res.data.message || 'Invalid file data.'}`
                }])
                return
            }
        })
            .catch((err) => {
                setSelectedFile(null)
                setErrorAlerts([{
                    message: `${err.response.data.message || 'Invalid file data.'}`
                }])
            })
    }

    // const addBulkProductsButton = <ProductsCsvReader bulkUpload={bulkUpload} />;
    return (
        <>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <ProductsCsvReader bulkUpload={bulkUpload} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                </Grid>
                <Grid item xs={12}>
                    {
                        errorAlerts.map((alert) => {
                            return (
                                <Alert severity="error"> {alert.message} </Alert>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </>
    )
}

export default BulkUpload
