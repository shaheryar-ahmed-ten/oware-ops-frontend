import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../login/LoginForm'
import ForgetPassword from '../login/ForgetPassword'
import Layout from '../Layout';

const Routing = () => {
    return (
        <BrowserRouter>
            <Route path="/login" component={Login} />
            <Route path="/layout" component={Layout} />
            {/* <Route path="/forget_password" component={ForgetPassword} /> */}
        </BrowserRouter>
    )
}
export default Routing;
