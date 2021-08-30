import {
    Box,
    Grid,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { dateFormat, getURL } from '../../../utils/common';
import PrintIcon from '@material-ui/icons/Print';
import { useLocation, useParams } from 'react-router';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    parentContainer: {
        boxSizing: 'border-box',
        padding: "30px 30px",
    },
    pageHeading: {
        fontWeight: 600
    },
    pageSubHeading: {
        fontWeight: 300
    },
    heading: {
        fontWeight: 'bolder'
    },
    shadedTableHeader: {
        backgroundColor: 'rgba(202,201,201,0.3)'
    },
    tableHeadText: {
        background: 'transparent', fontWeight: 'bolder', fontSize: '12px'
    }
}));



function ViewStockManagementDetails() {
    const classes = useStyles();
    const { uid } = useParams();
    const [selectedInventoryWastages, setSelectedInventoryWastages] = useState(null); // selected one to view
    const componentRef = useRef(); // for printing

    // If uid exists than fetch details of the selecteInventoryWastages  
    useEffect(() => {
        if (uid)
            _getInventoryWastage(); // only in case of edit 
    }, [uid]);

    const _getInventoryWastage = () => {
        axios.get(getURL(`inventory-wastages/${uid}`))
            .then((res) => {
                console.log(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        !selectedInventoryWastages ?
            <>
                {/* Only for Displaying */}
                <Grid container className={classes.parentContainer} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" className={classes.heading}>Stock Adjustment Details
                            <IconButton aria-label="print" onClick={handlePrint}>
                                <PrintIcon />
                            </IconButton>
                        </Typography>
                    </Grid>
                    <TableContainer className={classes.parentContainer}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        className={classes.tableHeadText}>ADJUSTMENT ID
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>ADJUSTED BY
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>COMPANY
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>WAREHOUSE
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>CITY
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>PRODUCTS
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>ADJUSTED AT
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Grid>
            </>
            :
            null
    )
}

export default ViewStockManagementDetails
