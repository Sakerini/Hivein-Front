import jwt_decode from 'jwt-decode';

const GATEWAY = "http://hivein-gateway.herokuapp.com";

const request = (options) => {
    const headers = new Headers();

    if (options.setContentType !== false) {
        headers.append("Content-Type", "application/json");
    }

    if (localStorage.getItem("accessToken")) {
        headers.append(
            "Authorization",
            "Bearer " + localStorage.getItem("accessToken")
        );
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then((response) =>
        response.json().then((json) => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    return request({
        url: GATEWAY + "/auth/signin",
        method: "POST",
        body: JSON.stringify(loginRequest),
    });
}

export function facebookLogin(facebookLoginRequest) {
    return request({
        url: GATEWAY + "/facebook/signin",
        method: "POST",
        body: JSON.stringify(facebookLoginRequest),
    });
}

export function signup(signupRequest) {
    return request({
        url: GATEWAY + "/register/signup",
        method: "POST",
        body: JSON.stringify(signupRequest),
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    var token = localStorage.getItem("accessToken")
    var decoded = jwt_decode(token);

    return request({
        url: GATEWAY + "/user/find/" + decoded.sub,
        method: "GET",
    });
}

export function getUsers() {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    var token = localStorage.getItem("accessToken")
    var decoded = jwt_decode(token);

    return request({
        url: GATEWAY + "/user/find/summaries/" + decoded.sub,
        method: "GET",
    });
}

export function countNewMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: GATEWAY + "/chat" + "/messages/" + senderId + "/" + recipientId + "/count",
        method: "GET",
    });
}

export function findChatMessages(senderId, recipientId) {
    return fetchChatMessages(senderId, recipientId).then(result => {
        return fetchChatMessages(recipientId, senderId).then(result2 => {
            return [...result, ...result2].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
        })
    })
}

function fetchChatMessages(senderId, recipientId) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: GATEWAY + "/chat" + "/messages/" + senderId + "/" + recipientId,
        method: "GET",
    });
}

export function findChatMessage(id) {
    if (!localStorage.getItem("accessToken")) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: GATEWAY + "/chat" + "/messages/" + id,
        method: "GET",
    });
}
