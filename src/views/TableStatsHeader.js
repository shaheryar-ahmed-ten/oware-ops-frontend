import {
    Grid,
    Paper,
    Typography,
    makeStyles,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        // marginBottom: '20px',
    },
    pageHeader: {
        padding: theme.spacing(2),
        display: 'flex',

    },
    val: {
        fontWeight: 'bolder',
    },
}))


function TableStatsHeader({ stats }) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Paper elevation={0} square className={classes.root}>
                <div className={classes.pageHeader}>
                    <Grid container justify="flex-start" spacing={3}>
                        {
                            stats.map((stat) => {
                                return (
                                    <Grid item>
                                        <Typography variant="h4">{stat.label}</Typography>
                                        <Typography variant="h4" className={classes.val}>{stat.val}</Typography>
                                    </Grid>
                                )
                            })
                        }

                    </Grid>
                </div>
            </Paper>
        </React.Fragment >
    )
}

export default TableStatsHeader
