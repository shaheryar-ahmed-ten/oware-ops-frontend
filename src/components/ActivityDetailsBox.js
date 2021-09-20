import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexFlow: 'column',
        backgroundColor: 'rgba(202,201,201,0.3)',
        boxSizing: 'border-box',
        padding: '2rem 1rem',
        marginLeft: '10%',
        marginRight: '10%',
        borderRadius: '4px',
        marginBottom: 20
    },
}))


function ActivityDetailsBox({ payloadData, activityType }) {
    const classes = useStyles();
    return payloadData ?
        <>
            <div className={classes.root}>
                {
                    payloadData.map((data) => {
                        return (
                            <Typography variant="body"> {data} </Typography>
                        )
                    })
                }
            </div>
        </>
        :
        ''
}

export default ActivityDetailsBox
