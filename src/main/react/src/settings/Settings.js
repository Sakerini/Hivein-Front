import React, {useEffect, useState} from "react";
import {Form, Input, Button, notification} from "antd";
import {DingtalkOutlined} from "@ant-design/icons";
import {getCurrentUser, updateUser} from "../util/ApiUtil";
import "./Settings.css";
import {useRecoilState} from "recoil";
import {loggedInUser} from "../atom/globalState";

const Settings = (props) => {
    const [loading, setLoading] = useState(false);
    const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            props.history.push("/login");
        }
        loadCurrentUser();
        console.log({currentUser})
    }, []);

    const loadCurrentUser = () => {
        getCurrentUser()
            .then((response) => {
                setLoggedInUser(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const onFinish = (values) => {
        console.log({onFinish: values})
        // values.address = ``
        setLoading(true);
        updateUser(values)
            .then((response) => {
                notification.success({
                    message: "Success",
                    description: "Thank you! Your information have been updated successfully"
                });
                props.history.push("/")
                setLoading(false);
            })
            .catch((error) => {
                notification.error({
                    message: "Error",
                    description:
                        error.message || `Sorry! Something went wrong. Please try again!\n${error.message}`,
                });
                setLoading(false);
            });
    };

    return (
        <div className="login-container">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{...currentUser, remember: true}}
                onFinish={onFinish}
            >
                <Form.Item label="Username"
                           name="username"
                           rules={[{required: true, message: "Please enter your Username!"}]}
                >
                    <Input disabled size="large" placeholder="Please enter your Username!"/>
                </Form.Item>

                <Form.Item label="Display Name"
                           name="name"
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
                           name="birthday"
                           rules={[{required: true, message: "Please enter your birthDay (YYYY-mm-dd)!"}]}
                >
                    <Input size="large" placeholder="Please enter your birthDay (YYYY-mm-dd)!"/>
                </Form.Item>
                <Form.Item label="Picture"
                           name="profilePicture"
                           rules={[
                               {
                                   required: true,
                                   message: "Please enter your profile picture URL!",
                               },
                           ]}
                >
                    <Input size="large" placeholder="Profile picture url"/>
                </Form.Item>
                <Form.Item label="City"
                           name="city"
                           rules={[
                               {
                                   required: true,
                                   message: "Please enter your city!!!!",
                               },
                           ]}
                >
                    <Input size="large" placeholder="Profile picture url"/>
                </Form.Item>
                <Form.Item label="Address">
                    <Input.Group compact>
                        <Form.Item
                            name='country'
                            rules={[{required: true, message: "Please enter your country!"}]}
                        >
                            <Input size="large" placeholder="Country"/>
                        </Form.Item>

                        <Form.Item
                            name='zipCode'
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
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Settings;
