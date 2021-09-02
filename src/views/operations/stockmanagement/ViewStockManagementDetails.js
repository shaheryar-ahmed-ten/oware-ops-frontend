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
    },
    tableRow: {
        "&:last-child th, &:last-child td": {
            borderBottom: 0,
        },
    },
}));



function ViewStockManagementDetails() {
    const productsColumns = [
        {
            id: 'companyName',
            label: 'COMPANY',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.Company.name
        },
        {
            id: 'warehouseName',
            label: 'WAREHOUSE',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.Warehouse.name
        },
        {
            id: 'productName',
            label: 'PRODUCT',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.Product.name
        },
        {
            id: 'availableQty',
            label: 'ADJUSTMENT QUANTITY',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.AdjustmentDetails.adjustmentQuantity
        },
        {
            id: 'UOM',
            label: 'UoM',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.Product.UOM.name
        },
        {
            id: 'reasonType',
            label: 'REASON',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.AdjustmentDetails.WastagesType.name
        },
        {
            id: 'comment',
            label: 'COMMENT',
            minWidth: 'auto',
            className: '',
            format: (value, inventory) => inventory.AdjustmentDetails.comment || '-'
        }
    ]

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
                setSelectedInventoryWastages(res.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        selectedInventoryWastages ?
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
                                        className={classes.tableHeadText}>ADJUSTMENT DATE
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>ADJUSTMENT ID
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>ADJUSTED BY
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>CITY
                                    </TableCell>
                                    <TableCell
                                        className={classes.tableHeadText}>PRODUCTS
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow className={classes.tableRow}>
                                    <TableCell>
                                        {dateFormat(selectedInventoryWastages.updatedAt)}
                                    </TableCell>
                                    <TableCell>
                                        {selectedInventoryWastages.internalIdForBusiness}
                                    </TableCell>
                                    <TableCell>
                                        {selectedInventoryWastages.Admin.firstName + selectedInventoryWastages.Admin.lastName}
                                    </TableCell>
                                    <TableCell>
                                        {selectedInventoryWastages.Inventories[0].Warehouse.city}
                                    </TableCell>
                                    <TableCell>
                                        {selectedInventoryWastages.Inventories.length}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid item xs={12}>
                        <Typography variant="h4" className={classes.heading}>Products Details</Typography>
                    </Grid>
                    <TableContainer className={classes.parentContainer}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow className={classes.shadedTableHeader}>
                                    {productsColumns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, background: 'transparent', fontWeight: 'bolder', fontSize: '12px' }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    selectedInventoryWastages.Inventories.map((inventoryWastage) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={inventoryWastage.id}>
                                                {productsColumns.map((column) => {
                                                    const value = inventoryWastage[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}
                                                            className={column.className && typeof column.className === 'function' ? column.className(value) : column.className}>
                                                            {column.format ? column.format(value, inventoryWastage) : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </>
            :
            null
    )
}

export default ViewStockManagementDetails
