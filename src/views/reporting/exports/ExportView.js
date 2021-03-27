import React from 'react'
import { Box, Button, Grid, makeStyles, Paper } from '@material-ui/core'
import TableHeader from '../../TableHeader'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
    },
    gridTwo: {
        alignSelf: 'center',
        marginTop: '30px'
    }
}))

const handleClick = _ => {

}

const ExportView = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <TableHeader title="Export" />
            </Grid>

            <Grid item className={classes.gridTwo} xs={12}>
                <Button variant="contained" color="primary" onClick={handleClick}>Export To Excel</Button>
            </Grid>
        </Grid>
    )
}


export default ExportView
