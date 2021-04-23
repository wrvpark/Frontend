import React, { Component } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import { Redirect} from 'react-router-dom'

import "./login.less";
// import { userLogin } from '../../api/apifunction'

export default class Login extends Component {
  state = { admin: "" };
  onFinish = async (values) => {
    //get the username and password from the the from
    const { username, password } = values;
    //call the userLogin method

    if (username === "isabel") {
      this.props.history.replace("/");
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    //check if the user already login

    return (
      <div className="login">
        <header className="login-header">
          {/* must import the image logo first, then use it here */}
          {/* <img src={logo} alt="logo" /> */}
          <h1>Wendy's RV Park</h1>
        </header>

        <section className="login-content">
          <h3>User Login</h3>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="www.baidu.com">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <a href="www.baidu.com">register now!</a>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
