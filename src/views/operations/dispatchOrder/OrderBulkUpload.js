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
import OrdersCsvReader from '../../../components/OrdersCsvReader'
import { isPhone } from '../../../utils/validators'

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

function OrderBulkUpload() {
    const classes = useStyles()
    const navigate = useNavigate()

    const [fileUploaded, setfileUploaded] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [errorAlerts, setErrorAlerts] = useState([])
    const [successAlerts, setSuccessAlerts] = useState([])


    const bulkUpload = data => {
        setfileUploaded(true)
        // data sanitization 
        const sanitizationArray = dataSanitization(data.orders);

        if (sanitizationArray.length > 0) {
            setErrorAlerts(sanitizationArray)
            return
        }

        // restricting empty file upload.
        if (!(Array.isArray(data.orders) && data.orders.length > 0)) {
            setSelectedFile(null)
            setSuccessAlerts([])
            setErrorAlerts(["Can not upload file having zero dispatch orders."])
            return
        }
        let temp = [] // for same product in same order number.
        let tempTwo = [] // for same product in same order number.
        let count = 2 // to keep index count of loop.
        let errorsArray = [] // to add all the errors in a single fine.
        // validations
        for (let order of data.orders) {
            // stop duplicate products for each order
            if (temp.includes(`${order.orderNumber}${order.product}`)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having duplicate products in same order number.`
                }]
            }
            temp.push(`${order.orderNumber}${order.product}`)
            // verify receiver phone format
            if (!isPhone(`0${order.receiverPhone}`)) {
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Invalid phone number.`
                }]
            }
            // verify date format
            if (
                !moment(new Date(order.shipmentDate)).isValid()
                ||
                (!order.shipmentDate.includes("AM") && !order.shipmentDate.includes("PM"))
                ||
                (new Date().getTime() > new Date(order.shipmentDate).getTime())
            ) {
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Invalid shipment date.`
                }]
            }
            // verify same company,warehouse,referenceId,shipmentDate,receiverDetails on same order number
            if (tempTwo.find(el => el.orderNumber === order.orderNumber && el.company !== order.company)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having different company in same order number.`
                }]
            }
            if (tempTwo.find(el => (el.orderNumber === order.orderNumber) && el.warehouse !== order.warehouse)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having different warehouse in same order number.`
                }]
            }
            if (tempTwo.find(el => (el.orderNumber === order.orderNumber) && el.referenceId !== order.referenceId)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having different referenceId in same order number.`
                }]
            }
            if (tempTwo.find(el => (el.orderNumber === order.orderNumber) && el.shipmentDate !== order.shipmentDate)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having different shipmentDate in same order number.`
                }]
            }
            if (tempTwo.find(el => (el.orderNumber === order.orderNumber) && el.receiverName !== order.receiverName)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having different receiverName in same order number.`
                }]
            }
            if (tempTwo.find(el => (el.orderNumber === order.orderNumber) && el.receiverPhone !== order.receiverPhone)) {
                setSelectedFile(null)
                setSuccessAlerts([])
                errorsArray = [...errorsArray, {
                    row: count,
                    message: `Row ${count} : Can not upload file having different receiverPhone in same order number.`
                }]
            }

            errorsArray.length > 0 ?
                setErrorAlerts(errorsArray)
                :
                tempTwo.push(order)

            count++
        }

        let apiPromise = axios.post(getURL('dispatch-order/bulk'), data)
        apiPromise.then((res) => {
            if (!res.data.success) {
                setSelectedFile(null)
                setErrorAlerts()
                displayErrors([...errorsArray, ...res.data.message])
                return
            }
            setErrorAlerts([])
            setSuccessAlerts([`${res.data.message} `])
        })
            .catch((err) => {
                setSelectedFile(null)
                setSuccessAlerts([])
                if (Array.isArray(err.response.data.message)) {
                    displayErrors([...errorsArray, ...err.response.data.message])
                }
                else {
                    setErrorAlerts([...errorsArray, "Failed to upload bulk orders."])
                }
            })
    }

    const dataSanitization = (data) => {
        let count = 2;
        let sanitizationArray = [];
        for (let order of data) {
            if (!order['company']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Company is not provided.`
                }]
            }
            if (!order['orderNumber']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Order number is not provided.`
                }]
            }
            if (!order['warehouse']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Warehouse is not provided.`
                }]
            }
            if (!order['receiverName']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Receiver name is not provided.`
                }]
            }
            if (!order['shipmentDate']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Shipment date is not provided.`
                }]
            }
            if (!order['referenceId']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : ReferenceId is not provided.`
                }]
            }
            if (!order['product']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Product is not provided.`
                }]
            }
            if (!order['quantity']) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Quantity is not provided.`
                }]
            }
            if (order['quantity'] && Number.isInteger(order['quantity'])) {
                sanitizationArray = [...sanitizationArray, {
                    row: count,
                    message: `Row ${count} : Quantity is not valid.`
                }]
            }

            count++
        }
        return sanitizationArray
    }

    const displayErrors = (jointArray) => {
        const sortedMsgs = jointArray.sort(function (a, b) {
            var rowA = a.row;
            var rowB = b.row;
            if (rowA < rowB) {
                return -1;
            }
            if (rowA > rowB) {
                return 1;
            }
        });
        setErrorAlerts([...sortedMsgs])
    }

    const downloadTemplate = () => {
        let apiPromise = axios.get(getURL('dispatch-order/bulk-template'), {
            responseType: 'blob',
        })
        apiPromise.then((response) => {
            fileDownload(response.data, `Dispatch Orders ${moment().format('DD-MM-yyyy')}.xlsx`);
        })

    }
    return (
        <>
            <Grid container className={classes.root}>
                <Grid container item xs={12} alignItems="center" className={classes.topHeader}>
                    <Grid item xs={10}>
                        <Typography component="div" variant="h4" className={classes.heading}>Orders Bulk Upload</Typography>
                    </Grid>
                    <Grid item xs={2} className={classes.backBtn}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/operations/dispatch-order')}>Back</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} alignItems="center" className={classes.headerBtns}>
                    <Grid item xs={3} className={classes.downloadTempBtn}>
                        <Button variant="contained" color="primary" fullWidth onClick={downloadTemplate}>Download Template</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <OrdersCsvReader bulkUpload={bulkUpload} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
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
                                            <Alert severity="error" className={classes.systemAlert}> {alert.message ? alert.message : alert} </Alert>
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
                                <Alert severity="info" className={classes.guideLine}>Maximum of 1000 orders are allowed to be included for upload in a single file.</Alert>
                                {/* <Alert severity="info" className={classes.guideLine}>The following special characters are not allowed in product names -  !@#$%^\=\[\]{ };:\\|>\/?</Alert> */}
                                <Alert severity="info" className={classes.guideLine}>The Company and Warehouse values used for product rows in upload should already be added in the system before upload. Non exisiting values will result in a validation error.</Alert>
                                <Alert severity="info" className={classes.guideLine}>The products must be present in the selected company & warehouse.</Alert>
                                <Alert severity="info" className={classes.guideLine}>The template contains sample values for order rows which must be replaced with actual values before upload.</Alert>
                            </Grid>
                        </>
                }
            </Grid>
        </>
    )
}

export default OrderBulkUpload
