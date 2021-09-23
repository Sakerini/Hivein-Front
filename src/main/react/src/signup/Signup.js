import React, {useEffect, useState} from "react";
import {Form, Input, Button, notification} from "antd";
import {DingtalkOutlined} from "@ant-design/icons";
import {signup} from "../util/ApiUtil";
import "./Signup.css";

const Signup = (props) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("accessToken") !== null) {
            props.history.push("/");
        }
    }, []);

    const onFinish = (values) => {
        setLoading(true);
        signup(values)
            .then((response) => {
                notification.success({
                    message: "Success",
                    description:
                        "Thank you! You're successfully registered. Please Login to continue!",
                });
                props.history.push("/login");
                setLoading(false);
            })
            .catch((error) => {
                notification.error({
                    message: "Error",
                    description:
                        error.message || "Sorry! Something went wrong. Please try again!",
                });
                setLoading(false);
            });
    };

    return (
        <div className="login-container">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{remember: true}}
                onFinish={onFinish}
            >
                <Form.Item label="Username"
                           name="username"
                           rules={[{required: true, message: "Please enter your Username!"}]}
                >
                    <Input size="large" placeholder="Please enter your Username!"/>
                </Form.Item>

                <Form.Item label="Password"
                           name="password"
                           rules={[{required: true, message: "Please enter your Password!"}]}
                >
                    <Input size="large" type="password" placeholder="Please enter your Password!"/>
                </Form.Item>
                <Form.Item label="Email"
                           name="email"
                           rules={[{required: true, message: "Please enter your email!"}]}
                >
                    <Input size="large" placeholder="Please enter your email!"/>
                </Form.Item>
                <Form.Item label="Display Name"
                           name="displayName"
                           rules={[{required: true, message: "Please enter your NickName!"}]}
                >
                    <Input size="large" placeholder="Please enter your NickName!"/>
                </Form.Item>
                <Form.Item label="First Name"
                           name="firstName"
                           rules={[{required: true, message: "Please enter your First Name!"}]}
                >
                    <Input size="large" placeholder="Please enter your First Name!"/>
                </Form.Item>
                <Form.Item label="Last Name"
                           name="lastName"
                           rules={[{required: true, message: "Please enter your Last Name!"}]}
                >
                    <Input size="large" placeholder="Please enter your Last Name!"/>
                </Form.Item>
                <Form.Item label="Birth Day"
                           name="birthDay"
                           rules={[{required: true, message: "Please enter your birthDay (YYYY-mm-dd)!"}]}
                >
                    <Input size="large" placeholder="Please enter your birthDay (YYYY-mm-dd)!"/>
                </Form.Item>
                <Form.Item label="Picture:"
                           name="profilePicUrl"
                           rules={[
                               {
                                   required: true,
                                   message: "Please enter your profile picture URL!",
                               },
                           ]}
                >
                    <Input size="large" placeholder="Profile picture url"/>
                </Form.Item>
                <Form.Item label="Address">
                    <Input.Group compact>
                        <Form.Item
                            name={['address', 'country']}
                            rules={[{required: true, message: "Please enter your country!"}]}
                        >
                            <Input size="large" placeholder="Country"/>
                        </Form.Item>

                        <Form.Item
                            name={['address', 'city']}
                            rules={[{required: true, message: "Please enter your city!"}]}
                        >
                            <Input size="large" placeholder="City"/>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item>
                    <Button
                        shape="round"
                        size="large"
                        htmlType="submit"
                        className="login-form-button"
                        loading={loading}
                    >
                        Signup
                    </Button>
                </Form.Item>
                Already a member?
                <a href="/login">Log in</a>
            </Form>
        </div>
    );
};

export default Signup;
