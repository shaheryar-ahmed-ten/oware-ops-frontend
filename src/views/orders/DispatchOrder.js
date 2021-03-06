import React, { useState } from 'react'
import DispatchOrderForm from './DispatchOrderForm'
import PageHeader from '../PageHeader'
import { makeStyles, Paper } from '@material-ui/core'
import { AutorenewTwoTone } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    pageContent: {
        // margin: theme.spacing(3),
        display: 'block',
        margin: 'auto auto',
        padding: theme.spacing(2),
        width: 520,
    }
}))


const DispatchOrder = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <PageHeader title="Dispatch Order" />
            <Paper className={classes.pageContent}>
                <DispatchOrderForm />
            </Paper>
        </React.Fragment>
    )
}

export default DispatchOrder
