import { Button, Grid, Paper, Box, Typography, makeStyles, InputBase } from '@material-ui/core'
// import { findByLabelText } from '@testing-library/dom';
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
        fontWeight: 'bolder'
    },
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        padding: '0px 8px',
        marginRight: 7,
        height: 30,
    },
}))

const TableHeader = (props) => {
    const { title, buttons } = props;
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
                            <InputBase
                                placeholder="Search"
                                className={classes.searchInput}
                            />
                            {buttons}
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        </React.Fragment >
    )
}

export default TableHeader
