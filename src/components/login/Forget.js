import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Forget.css';

const Forget = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <Form
            className="form"
            style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10%" }}
            name="normal_login"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}>
            <h1 className="h1">oware</h1>
            <p>Forget your Password? Enter your email address Or usename and we'll email you password reset link</p>

            <label htmlFor="username">Username or Email</label>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}>
                <Input placeholder="name@example.com" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="btn">Sent Reset Code</Button>
            </Form.Item>
        </Form >
    );
};

export default Forget;