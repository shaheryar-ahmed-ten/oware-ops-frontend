import { FormControl, InputAdornment, makeStyles, MenuItem, Select } from '@material-ui/core'
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
function SelectDropdown({ name, list, selectedType, setSelectedType, icon, resetFilters, setPage }) {
    const classes = useStyles();

    const handleChange = (event) => {
        setPage(1)
        // resetFilters()
        setSelectedType(event.target.value);
    };
    return (
        <>
            <FormControl className={classes.formControl}>
                <Select
                    value={selectedType} git
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

                                    {/* <ListItemText primary={item.name || ''} classes={{ root: classes.dropdownListItem }} /> */}
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </>
    )
}

export default SelectDropdown
