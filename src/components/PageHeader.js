import { InputBase, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { Button, Card } from 'react-bootstrap'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: "transparent",
        padding: theme.spacing(4),
        display: 'flex',
        marginBottom: theme.spacing(1),
    },
    title: {
        fontWeight: "bolder"
    },
    searchInput: {
        border: 'solid 1px 	#BEBEBE',
        borderRadius: '3px',
        marginRight: 8,
        opacity: '0.9',
        padding: '0px 8px',
        fontSize: '0.8rem'
    }
}))

function PageHeader(props) {
    const classes = useStyles();
    const { title } = props;
    return (
        <Paper elevation={0} className={classes.root} alignItems="center">
            <Typography
                variant="h6"
                component="div"
                className={classes.title}
            >{title}</Typography>
            <div align="right">
                <InputBase placeholder="Search" className={classes.searchInput} />
                <Button variant="contained">Add New</Button>
            </div>
        </Paper >
    )
}

export default PageHeader
