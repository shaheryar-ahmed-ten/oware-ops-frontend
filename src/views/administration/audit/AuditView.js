import React, { useCallback, useEffect, useState } from 'react'
import { Grid, InputBase, makeStyles, Paper } from '@material-ui/core'
import TableHeader from '../../../components/TableHeader';
import AuditDivider from '../../../components/AuditDivider';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import axios from 'axios';
import { dividerDateFormat, dividerTimeFormat, getURL } from '../../../utils/common';
import AuditDetailsBox from '../../../components/AuditDetailsBox';
import { Pagination } from '@material-ui/lab';
import { isRequired } from '../../../utils/validators';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginBottom: '20px',
        padding: 20,
    },
    container: {
        // maxHeight: 450,
        padding: 20,
    },
    active: {
        color: theme.palette.success.main
    },
    searchInput: {
        border: '1px solid grey',
        borderRadius: 4,
        opacity: 0.6,
        padding: '0px 8px',
        marginRight: 7,
        height: 30,
    },
}));

function AuditView() {
    const classes = useStyles();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [activityLogs, setActivityLogs] = useState([])

    const [dateTrack, setDateTrack] = useState('')
    let dateTrackerArr = []
    // const [dateTrackerArr, setDateTrackerArr] = useState([])
    useEffect(() => {
        getAuditLogs(page, searchKeyword);
    }, [page, searchKeyword]);

    const _getAuditLogs = (page, searchKeyword) => {
        axios.get(getURL('audit-logs'), { params: { page, search: searchKeyword } })
            .then(res => {
                if (res.data && res.data.data && res.data.data.length > 0) {
                    setDateTrack(res.data.data[0].updatedAt)
                    // dateTrackerArr = [...dateTrackerArr, res.data.data[0].updatedAt]
                    setPageCount(res.data.pages)
                    setActivityLogs(res.data.data)
                }
            });
    }

    const getAuditLogs = useCallback(debounce((page, searchKeyword) => {
        _getAuditLogs(page, searchKeyword)
    }, DEBOUNCE_CONST), [])


    const searchInput = <InputBase
        placeholder="Search"
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        onChange={e => setSearchKeyword(e.target.value)}
    />;

    const headerButtons = [searchInput]

    return (
        <Paper className={classes.root}>
            <TableHeader title="Audit Logs" buttons={headerButtons} />
            {
                activityLogs.length > 0 ?
                    <>
                        <Grid container justifyContent="center" alignItems="center">
                            {
                                activityLogs.map((activityLog, idx) => {
                                    let allowDivider = false
                                    if (!dateTrackerArr.includes(dividerDateFormat(activityLog.updatedAt))) {
                                        console.log(idx, dateTrackerArr, !dateTrackerArr.includes(dividerDateFormat(activityLog.updatedAt)))
                                        dateTrackerArr = [...dateTrackerArr, dividerDateFormat(activityLog.updatedAt)]
                                        allowDivider = true
                                    }
                                    switch (activityLog.activityType) {
                                        case 'ADD':
                                            const payloadData = [
                                                <span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            `${activityLog.User.firstName || ''} ${activityLog.User.lastName || ''} `
                                                        }
                                                    </span>
                                                    <span>
                                                        added
                                                    </span>
                                                    <span>
                                                        {
                                                            ` ${activityLog.ActivitySourceType.name || ''}`
                                                        }
                                                    </span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            ` ${activityLog.currentPayload.name || activityLog.currentPayload.internalIdForBusiness || ''} `
                                                        }
                                                    </span>
                                                    <span>
                                                        at
                                                    </span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            ` ${dividerTimeFormat(activityLog.updatedAt)}`
                                                        }
                                                    </span>
                                                </span>
                                            ]
                                            return (
                                                <Grid item container xs={12} justifyContent="center" key={idx} >
                                                    {
                                                        allowDivider && (dividerDateFormat(activityLog.updatedAt) !== dividerDateFormat(dateTrack) || idx === 0) ?
                                                            <AuditDivider date={activityLog.updatedAt} />
                                                            :
                                                            ''
                                                    }
                                                    <AuditDetailsBox activityType={activityLog.activityType} payloadData={payloadData} />
                                                </Grid>
                                            )
                                        case 'EDIT':
                                            const editPayloadData = [
                                                <span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            `${activityLog.User.firstName || ''} ${activityLog.User.lastName || ''} `
                                                        }
                                                    </span>
                                                    <span>
                                                        edited
                                                    </span>
                                                    <span>
                                                        {
                                                            ` ${activityLog.ActivitySourceType.name || ''}`
                                                        }
                                                    </span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            ` ${activityLog.currentPayload.name || activityLog.currentPayload.internalIdForBusiness || ''} `
                                                        }
                                                    </span>
                                                    <span>
                                                        at
                                                    </span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            ` ${dividerTimeFormat(activityLog.updatedAt)}`
                                                        }
                                                    </span>
                                                </span>
                                            ]
                                            return (
                                                <Grid item container xs={12} justifyContent="center" key={idx} >
                                                    {
                                                        allowDivider && (dividerDateFormat(activityLog.updatedAt) !== dividerDateFormat(dateTrack) || idx === 0) ?
                                                            <>
                                                                <AuditDivider date={activityLog.updatedAt} />
                                                            </>
                                                            :
                                                            ''
                                                    }
                                                    <AuditDetailsBox activityType={activityLog.activityType} payloadData={editPayloadData} />
                                                </Grid>
                                            )
                                        case 'DELETE':
                                            const deletePayloadData = [
                                                <span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            `${activityLog.User.firstName || ''} ${activityLog.User.lastName || ''} `
                                                        }
                                                    </span>
                                                    <span>
                                                        deleted
                                                    </span>
                                                    <span>
                                                        {
                                                            ` ${activityLog.ActivitySourceType.name || ''}`
                                                        }
                                                    </span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            ` ${activityLog.previousPayload.name || activityLog.previousPayload.internalIdForBusiness || ''} `
                                                        }
                                                    </span>
                                                    <span>
                                                        at
                                                    </span>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {
                                                            ` ${dividerTimeFormat(activityLog.updatedAt)}`
                                                        }
                                                    </span>
                                                </span>
                                            ]
                                            return (
                                                <Grid item container activityType={activityLog.activityType} xs={12} justifyContent="center" key={idx} >
                                                    {
                                                        allowDivider && (dividerDateFormat(activityLog.updatedAt) !== dividerDateFormat(dateTrack) || idx === 0) ?
                                                            <>
                                                                <AuditDivider date={activityLog.updatedAt} />
                                                            </>
                                                            :
                                                            ''
                                                    }
                                                    <AuditDetailsBox activityType={activityLog.activityType} payloadData={deletePayloadData} />
                                                </Grid>
                                            )
                                        default:
                                            return null
                                    }
                                })
                            }
                        </Grid>

                        <Grid container justify="space-between">
                            <Grid item></Grid>
                            <Grid item>
                                <Pagination
                                    component="div"
                                    shape="rounded"
                                    count={pageCount}
                                    color="primary"
                                    page={page}
                                    className={classes.pagination}
                                    onChange={(e, page) => setPage(page)}
                                // onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>
                    </>
                    :
                    ''
            }
        </Paper>
    )
}

export default AuditView
