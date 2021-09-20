import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { dateFormat, dividerDateFormat } from '../utils/common';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        marginTop: 15,
        marginBottom: 15
    },
    dividerLine: {
        height: 1.5,
        backgroundColor: 'rgba(202,201,201,0.4)',
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

function ActivityDivider({ label, date }) {
    const classes = useStyles();
    return (
        <>
            <div className={classes.root}>
                <div className={classes.dividerLine} style={{ flex: '0.55' }}></div>
                <div className={classes.labelDiv} style={{ flex: '1' }}>
                    <Typography>{dividerDateFormat(date)}</Typography>
                </div>
                <div className={classes.dividerLine} style={{ flex: '6' }}></div>
            </div>
        </>
    )
}

export default ActivityDivider
