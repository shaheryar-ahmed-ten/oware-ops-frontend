import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import Forget from './Forget'



const url = "https://reqres.in/api/login"


const Login = () => {
  const [postRequest, setRequest] = useState(null);
  useEffect(() => {
    fetch(url).then(response => response.json())
      .then(data => setRequest(data));
  }, [])

  const mystyle = {
    color: 'black',
    width: "350px",
    display: 'block',
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "10%",
  };


  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form style={mystyle}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <h1 style={{ fontWeight: "bolder", fontSize: "40px", textAlign: "center", color: "blue" }}>oware</h1>
      <label htmlFor="username">Username or Email</label>
      <Form.Item
        id="username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input placeholder="name@example.com" />
      </Form.Item>

      <label htmlFor="username">Password</label>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          type="password"
          placeholder="*****"
        />
      </Form.Item>
      <Form.Item>
        <Link style={{ display: "block", textAlign: "center" }} className="login-form-forgot" to="/forget_password">Forget Password</Link>
      </Form.Item>

      <Form.Item>
        <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item >
    </Form >
  );
};

export default Login;