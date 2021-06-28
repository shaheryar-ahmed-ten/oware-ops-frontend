import {
    Grid,
    Paper,
    Typography,
    makeStyles,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: '3px',
        boxShadow: "0 5px 5px -5px rgba(0, 0, 0, 1)"
    },
    pageHeader: {
        padding: theme.spacing(2),
        display: 'flex',
        paddingBottom: 0
    },
    val: {
        fontWeight: 'bolder',
    },
}))


function TableStatsHeader({ stats, filterButtons }) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Paper elevation={0} square className={classes.root}>
                <div className={classes.pageHeader}>
                    <Grid container justify="flex-start" spacing={8}>
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
                <div className={classes.pageHeader}>
                    <Grid container justify="flex-start" spacing={1}>
                        {
                            filterButtons.map((button) => {
                                return (
                                    <Grid item>
                                        {button}
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
