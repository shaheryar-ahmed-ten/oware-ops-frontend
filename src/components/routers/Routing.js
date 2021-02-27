import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Forget from '../login/Forget'
import Login from '../login/Login'

const Routing = () => {
    return (
        <BrowserRouter>
            <Route path="/login" component={Login} />
            <Route path="/forget_password" component={Forget} />
        </BrowserRouter>
    )
}

export default Routing;
