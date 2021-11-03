import { Button, FormControl, InputAdornment, makeStyles, MenuItem, Select, TextField } from '@material-ui/core'
import React from 'react'
import moment from 'moment';
import { useState } from 'react';
const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 160,
        boxSizing: 'border-box',
        marginRight: 10
    },
    placeholderText: {
        color: "#CAC9C9",
        '& .MuiSelect-outlined': {
            paddingTop: '7px',
            paddingBottom: '6px',
        },
    },
    dropdownListItem: {
        fontSize: 14,
    },
    inputAdronmentStyle: {
        '& .MuiInputAdornment-positionStart': {
            margin: '0',
            padding: '0',
            backgroundColor: 'green'
        },
        '& .MuiInputAdornment-root': {
            margin: '0',
            padding: '0',
            backgroundColor: 'green'
        }
    }
}));
function SelectCustomDropdown({ name, list, selectedType, setSelectedType, icon, resetFilters, setPage, open, setOpen ,startDate, endDate}) {
    const classes = useStyles();
    const [trackDateFilterOpen, setTrackDateFilterOpen] = useState(false);
    // console.log(list[4].name)

    const handleChange = (event) => {
        // resetFilters()
        // if(event.target.value){
            // setSelectedType('');
            setPage(1)
            resetFilters()
            setSelectedType(event.target.value);
        // }
    };

    const handleOpen = () =>{
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
      };
    return (
        <>
            <FormControl className={classes.formControl}>
                <Select
                    value={selectedType}
                    variant="outlined"
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    className={classes.placeholderText}
                    startAdornment={
                        <InputAdornment position="start" classes={{ positionStart: classes.inputAdronmentStyle, root: classes.inputAdronmentStyle }}>
                            {icon}
                        </InputAdornment>
                    }
                    onOpen={() => setTrackDateFilterOpen(true)}
                    onClose={() => setTrackDateFilterOpen(false)}
                >
                    <MenuItem value={null} disabled>
                        <span className={classes.dropdownListItem}>{name}</span>
                        {/* <ListItemText primary={name} classes={{ root: classes.dropdownListItem }} /> */}
                    </MenuItem>

                    {
                        list.map((item, index) => {
                            return (
                                <MenuItem key={index} value={item.id}>
                                    <span className={classes.dropdownListItem}>{item.name || ''}</span>
                                </MenuItem>
                            )
                            
                        })
                    }
                    <MenuItem key={'custom'} value={'custom'} onClick={()=>setOpen(true)}>
                         <span className={classes.dropdownListItem}>{startDate !== "-" && startDate !== null && endDate !== null && !trackDateFilterOpen ? moment(startDate).format("DD/MM/YYYY")+" - "+moment(endDate).format("DD/MM/YYYY") : "Custom"}</span>
                    </MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default SelectCustomDropdown
