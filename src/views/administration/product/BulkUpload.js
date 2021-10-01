import { Button, Grid, makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import axios from 'axios'
import React, { useState } from 'react'
import ProductsCsvReader from '../../../components/ProductsCsvReader'
import { getURL } from '../../../utils/common'
import CheckIcon from '@material-ui/icons/Check';
import { useNavigate } from 'react-router'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20,
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
            setSuccessAlerts(['Products have been added to system successfully.'])
        })
            .catch((err) => {
                setSelectedFile(null)
                setErrorAlerts(err.response.data.message)
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
                                <Alert severity="error"> {alert} </Alert>
                            )
                        })
                    }
                    {
                        successAlerts.map((alert) => {
                            return (
                                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success"
                                    action={
                                        <Button color="inherit" size="small" onClick={() => navigate('/administration/product')}>
                                            View Products
                                        </Button>
                                    }> {alert}  </Alert>
                            )
                        })
                    }
                </Grid>
            </Grid>
        </>
    )
}

export default BulkUpload
