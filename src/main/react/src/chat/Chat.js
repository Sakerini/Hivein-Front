import React, {useEffect, useState} from "react";
import {Button, message} from "antd";
import {
    getUsers,
    countNewMessages,
    findChatMessages,
    findChatMessage,
} from "../util/ApiUtil";
import {useRecoilValue, useRecoilState} from "recoil";
import {
    loggedInUser,
    chatActiveContact,
    chatMessages,
} from "../atom/globalState";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import {getCurrentUser} from "../util/ApiUtil";


var stompClient = null;
const Chat = (props) => {
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
    const [messages, setMessages] = useRecoilState(chatMessages);

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

    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            props.history.push("/login");
        }
        connect();
        loadContacts();
    }, []);

    useEffect(() => {
        //console.log({activeContact})
        if (activeContact === undefined) return;

        findChatMessages(activeContact.id, currentUser.id).then((msgs) => {
            setMessages(msgs)
            console.log({msgs})
        });

        loadContacts();
    }, [activeContact]);

    const connect = () => {
        const Stomp = require("stompjs");
        let SockJS = require("sockjs-client");
        SockJS = new SockJS("https://hivein-chatservice.herokuapp.com/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        //console.log("connected");
        //console.log(currentUser);
        stompClient.subscribe(
            "/user/" + currentUser.id + "/queue/messages",
            onMessageReceived
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const onMessageReceived = (msg) => {
        console.log({onMessageReceived: msg})
        const notification = JSON.parse(msg.body);
        const active = JSON.parse(sessionStorage.getItem("recoil-persist"))
            .chatActiveContact;

        if (active.id === +notification.senderId) {
            findChatMessage(notification.id).then((message) => {
                const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist"))
                    .chatMessages;
                newMessages.push(message);
                setMessages(newMessages);
            });
        } else {
            message.info("Received a new message from " + notification.senderName);
        }
        loadContacts();
    };

    const sendMessage = (msg) => {
        if (msg.trim() !== "") {
            const message = {
                senderId: currentUser.id,
                recipientId: activeContact.id,
                senderName: currentUser.name,
                recipientName: activeContact.name,
                content: msg,
                timestamp: new Date(),
            };
            stompClient.send("/app/chat", {}, JSON.stringify(message));

            const newMessages = [...messages];
            newMessages.push(message);
            setMessages(newMessages);
        }
    };

    const loadContacts = () => {
        const promise = getUsers().then((users) =>
            users.map((contact) =>
                countNewMessages(contact.id, currentUser.id).then((count) => {
                    contact.newMessages = count;
                    return contact;
                })
            )
        );

        promise.then((promises) =>
            Promise.all(promises).then((users) => {
                setContacts(users);
                if (activeContact === undefined && users.length > 0) {
                    setActiveContact(users[0]);
                }
            })
        );
    };

    const goToProfile = () => {
        props.history.push("/profile");
    }

    return (
        <div id="frame">
            <div id="sidepanel">
                <div id="profile">
                    <div class="wrap">
                        <img
                            id="profile-img"
                            src={currentUser.profilePicture}
                            class="online"
                            alt=""
                        />
                        <p>{currentUser.name}</p>
                        <div id="status-options">
                            <ul>
                                <li id="status-online" class="active">
                                    <span class="status-circle"></span>
                                    <p>Online</p>
                                </li>
                                <li id="status-away">
                                    <span class="status-circle"></span>
                                    <p>Away</p>
                                </li>
                                <li id="status-busy">
                                    <span class="status-circle"></span>
                                    <p>Busy</p>
                                </li>
                                <li id="status-offline">
                                    <span class="status-circle"></span>
                                    <p>Offline</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="search"/>
                <div id="contacts">
                    <ul>
                        {contacts.map((contact) => (
                            <li
                                onClick={() => setActiveContact(contact)}
                                class={
                                    activeContact && contact.id === activeContact.id
                                        ? "contact active"
                                        : "contact"
                                }
                            >
                                <div class="wrap">
                                    {
                                        // <span class="contact-status online"></span>
                                    }
                                    <img id={contact.id} src={contact.profilePicture} alt=""/>
                                    <div class="meta">
                                        <p class="name">{contact.name}</p>
                                        {contact.newMessages !== undefined &&
                                        contact.newMessages > 0 && (
                                            <p class="preview">
                                                {contact.newMessages} new messages
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="bottom-bar">
                    <button id="btnprofile" onClick={goToProfile}>
                        <i class="fa fa-user fa-fw" aria-hidden="true"></i>
                        {" "}
                        <span>Profile</span>
                    </button>
                    <button id="settings">
                        <i class="fa fa-cog fa-fw" aria-hidden="true"></i>
                        {" "}
                        <span>Settings</span>
                    </button>
                </div>
            </div>
            <div class="content">
                <div class="contact-profile">
                    <img src={activeContact && activeContact.profilePicture} alt=""/>
                    <p>{activeContact && activeContact.name}</p>
                </div>
                <ScrollToBottom className="messages">
                    <ul>
                        {messages.map((msg) => (
                            <li class={+msg.senderId === +currentUser.id ? "sent" : "replies"}>
                                {+msg.senderId !== +currentUser.id && (
                                    <img src={activeContact.profilePicture} alt=""/>
                                )}
                                <p>{msg.content}</p>
                            </li>
                        ))}
                    </ul>
                </ScrollToBottom>
                <div class="message-input">
                    <div class="wrap">
                        <input
                            name="user_input"
                            size="large"
                            placeholder="Write your message..."
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    sendMessage(text);
                                    setText("");
                                }
                            }}
                        />

                        <Button
                            icon={<i class="fa fa-paper-plane" aria-hidden="true"></i>}
                            onClick={() => {
                                sendMessage(text);
                                setText("");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
