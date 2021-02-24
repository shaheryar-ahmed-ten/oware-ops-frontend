import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core'

const useStyles = makeStyles({
    sideMenu: {
        display: 'flex',
        flexDirection: 'column',
        position: "absolute",
        left: 0,
        width: 200,
        height: "100%",
        backgroundColor: "cadetblue",
    }
})


function SideMenu() {
    const classes = useStyles();
    return (
        <div className={classes.sideMenu}>

        </div>
    )
}

export default SideMenu
