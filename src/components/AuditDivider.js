import { makeStyles } from '@material-ui/core'
import React from 'react'
import { dateFormat, dividerDateFormat } from '../utils/common';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        marginTop: 10,
        // marginBottom: 10
    },
    dividerLine: {
        height: 1,
        backgroundColor: 'orange',
        width: '100%',
    },
    labelDiv: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        bottom: 10,
        justifySelf: 'center',
        fontSize: 16
    }
}))

function AuditDivider({ label, date }) {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <div className={classes.dividerLine} style={{ flex: '1' }}></div>
                <div className={classes.labelDiv} style={{ flex: '1' }}>{dividerDateFormat(date)}</div>
                <div className={classes.dividerLine} style={{ flex: '6' }}></div>
            </div>
        </>
    )
}

export default AuditDivider
