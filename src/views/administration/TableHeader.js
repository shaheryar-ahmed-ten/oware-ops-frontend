import {
    Grid,
    Paper,
    Typography,
    makeStyles,
    InputBase
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'transparent',
    },
    pageHeader: {
        padding: theme.spacing(2),
        display: 'flex',

    },
    heading: {
        fontWeight: 'bolder',
    },
}))

const TableHeader = ({ title, buttons }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Paper elevation={0} square className={classes.root}>
                <div className={classes.pageHeader}>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Typography component="div" variant="h4" className={classes.heading}>{title}</Typography>
                        </Grid>
                        <Grid item>
                            {buttons}
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </React.Fragment >
    )
}

export default TableHeader
