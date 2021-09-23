import React, {useState} from "react";
import {useEffect} from "react";
import {verifyEmail} from "../util/ApiUtil";

const VerifyEmail = props => {
    const [errMsg, setErrMsg] = useState();
    useEffect(() => {
        const {token} = props.match.params;
        verifyEmail(token).then(result => {
            props.history.push("/");
        }).catch(err => {
            setErrMsg(err.message);
        });
    }, [props.match.params.token]);

    if (errMsg) {
        return (<div>Email verification failed: {errMsg}</div>);
    }

    return ( <div>Email verification...</div>);
}

export default VerifyEmail