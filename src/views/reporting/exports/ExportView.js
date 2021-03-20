import React from 'react'
import { Box, Button, Grid, makeStyles, Paper } from '@material-ui/core'
import TableHeader from '../../administration/TableHeader'
import { Table } from 'react-bootstrap'

const useStyles = makeStyles(theme => ({
    root: {
        // width: '100%',
        flexGrow: 1,
    },
    gridOne: {
        display: ''
    }
}))

const ExportView = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <TableHeader title="Export" />
            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" color="primary">Export To Excel</Button>
            </Grid>
        </Grid>
    )
}


export default ExportView
