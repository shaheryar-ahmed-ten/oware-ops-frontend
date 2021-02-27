import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../login/LoginForm'
import ForgetPassword from '../login/ForgetPassword'

const Routing = () => {
    return (
        <BrowserRouter>
            <Route path="/login" component={Login} />
            {/* <Route path="/forget_password" component={ForgetPassword} /> */}
        </BrowserRouter>
    )
}
export default Routing;
