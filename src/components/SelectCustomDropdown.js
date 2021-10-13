import { Button, FormControl, InputAdornment, makeStyles, MenuItem, Select, TextField } from '@material-ui/core'
import React from 'react'

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
function SelectCustomDropdown({ name, list, selectedType, setSelectedType, icon, resetFilters, setPage, open, setOpen }) {
    const classes = useStyles();
    // console.log(list[4].name)

    const handleChange = (event) => {
        // resetFilters()
        // if(event.target.value){
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
                    <MenuItem key={'index'} onClick={()=>setOpen(true)}>
                                    <span className={classes.dropdownListItem}>Custom</span>
                    </MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default SelectCustomDropdown
