import React from 'react'
import SideMenu from '../components/SideMenu'
import Header from './Header';
import PageHeader from './PageHeader';
import DataGrid from './DataGrid'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    appMain: {
        paddingLeft: 200,
        width: '100%',
    }
})


const Layout = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <SideMenu />
            <div className={classes.appMain}>
                <Header />
                <PageHeader />
                <DataGrid />
            </div>
        </React.Fragment>
    )
}

export default Layout
