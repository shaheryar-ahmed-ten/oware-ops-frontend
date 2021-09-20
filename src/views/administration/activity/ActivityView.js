import React, { useCallback, useEffect, useState } from 'react'
import { Grid, InputBase, makeStyles, Paper } from '@material-ui/core'
import TableHeader from '../../../components/TableHeader';
import ActivityDivider from '../../../components/ActivityDivider';
import { debounce } from 'lodash';
import { DEBOUNCE_CONST } from '../../../Config';
import axios from 'axios';
import { dividerDateFormat, dividerTimeFormat, getURL } from '../../../utils/common';
import ActivityDetailsBox from '../../../components/ActivityDetailsBox';
import { Pagination } from '@material-ui/lab';
import SelectDropdown from '../../../components/SelectDropdown';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';

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

function ActivityView() {
    const classes = useStyles();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [activityLogs, setActivityLogs] = useState([])

    const [days] = useState([{
        id: 1,
        name: '1 days'
    }, {
        id: 7,
        name: '7 days'
    }, {
        id: 14,
        name: '14 days'
    }, {
        id: 30,
        name: '30 days'
    }, {
        id: 60,
        name: '60 days'
    }])
    const [selectedDay, setSelectedDay] = useState(null)

    const [dateTrack, setDateTrack] = useState('')
    let dateTrackerArr = []
    // const [dateTrackerArr, setDateTrackerArr] = useState([])
    useEffect(() => {
        getAuditLogs(page, searchKeyword, selectedDay);
    }, [page, searchKeyword, selectedDay]);

    const _getAuditLogs = (page, searchKeyword, selectedDay) => {
        axios.get(getURL('audit-logs'), { params: { page, search: searchKeyword, days: selectedDay } })
            .then(res => {
                if (res.data && res.data.data && res.data.data.length > 0) {
                    setDateTrack(res.data.data[0].updatedAt)
                    setPageCount(res.data.pages)
                    setActivityLogs(res.data.data)
                }
                else {
                    setActivityLogs([])
                }
            });
    }

    const getAuditLogs = useCallback(debounce((page, searchKeyword, selectedDay) => {
        _getAuditLogs(page, searchKeyword, selectedDay)
    }, DEBOUNCE_CONST), [])

    const resetFilters = () => {
        setSelectedDay(null);
    }

    const searchInput = <InputBase
        placeholder="Search"
        className={classes.searchInput}
        id="search"
        label="Search"
        type="text"
        variant="outlined"
        value={searchKeyword}
        key={1}
        onChange={e => { setPage(1); setSearchKeyword(e.target.value) }}
    />;

    const daysSelect = <SelectDropdown icon={<CalendarTodayOutlinedIcon fontSize="small" />} resetFilters={resetFilters} type="Days" name="Select Days" list={[{ name: 'All' }, ...days]} selectedType={selectedDay} setSelectedType={setSelectedDay} setPage={setPage} />


    const headerButtons = [daysSelect, searchInput]

    return (
        <Paper className={classes.root}>
            <TableHeader title="Activity Logs" buttons={headerButtons} />
            {
                activityLogs.length > 0 ?
                    <>
                        <Grid container justifyContent="center" alignItems="center">
                            {
                                activityLogs.map((activityLog, idx) => {
                                    let allowDivider = false
                                    if (!dateTrackerArr.includes(dividerDateFormat(activityLog.updatedAt))) {
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
                                                            <ActivityDivider date={activityLog.updatedAt} />
                                                            :
                                                            ''
                                                    }
                                                    <ActivityDetailsBox activityType={activityLog.activityType} payloadData={payloadData} />
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
                                                                <ActivityDivider date={activityLog.updatedAt} />
                                                            </>
                                                            :
                                                            ''
                                                    }
                                                    <ActivityDetailsBox activityType={activityLog.activityType} payloadData={editPayloadData} />
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
                                                                <ActivityDivider date={activityLog.updatedAt} />
                                                            </>
                                                            :
                                                            ''
                                                    }
                                                    <ActivityDetailsBox activityType={activityLog.activityType} payloadData={deletePayloadData} />
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

export default ActivityView
