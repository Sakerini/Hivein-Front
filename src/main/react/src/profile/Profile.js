import React, {useEffect} from "react";
import {Card, Avatar, Descriptions} from "antd";
import {useRecoilState} from "recoil";
import {loggedInUser} from "../atom/globalState";
import {LogoutOutlined} from "@ant-design/icons";
import {getCurrentUser} from "../util/ApiUtil";
import "./Profile.css";

const {Meta} = Card;

const Profile = (props) => {
    const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            props.history.push("/login");
        }
        loadCurrentUser();
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

    const logout = () => {
        localStorage.removeItem("accessToken");
        props.history.push("/login");
    };

    return (
        <div className="profile-container">
            <Card
                style={{width: 420, border: "1px solid #e1e0e0"}}
                actions={[<span onClick={logout}><LogoutOutlined/> Logout</span>]}
            >
                <Meta
                    avatar={
                        <Avatar
                            src={currentUser.profilePicture}
                            className="user-avatar-circle"
                        />
                    }
                    title={currentUser.name}
                    description="Age \n coo"
                />
                <br/>
                <br/>
                <Descriptions bordered title="User Information" size='small' column={1}>
                    <Descriptions.Item label='Display name'>{currentUser.name}</Descriptions.Item>
                    <Descriptions.Item label='First name'>{currentUser.firstName}</Descriptions.Item>
                    <Descriptions.Item label='Last name'>{currentUser.lastName}</Descriptions.Item>
                    <Descriptions.Item label='Birthday'>{currentUser.birthday}</Descriptions.Item>
                    <Descriptions.Item label='Country'>{currentUser.country}</Descriptions.Item>
                    <Descriptions.Item label='City'>{currentUser.city}</Descriptions.Item>
                    <Descriptions.Item label='Zip code'>{currentUser.zipCode}</Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default Profile;