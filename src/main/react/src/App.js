import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Signin from "./signin/Signin";
import Signup from "./signup/Signup";
import Profile from "./profile/Profile";
import Chat from "./chat/Chat";
import "./App.css";
import VerifyEmail from "./email-verification/VerifyEmail";
import Settings from "./settings/Settings";

export const AppContext = React.createContext();
const App = (props) => {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/profile" render={(props) => <Profile {...props} />}/>
                    <Route
                        exact
                        path="/login"
                        render={(props) => <Signin {...props} />}
                    />
                    <Route
                        exact
                        path="/signup"
                        render={(props) => <Signup {...props} />}
                    />
                    <Route
                        exact
                        path="/verify/email/:token"
                        render={props => <VerifyEmail {...props}/>}
                    />
                    <Route
                        exact
                        path="/settings"
                        render={props => <Settings {...props} />}
                    />

                    <Route exact path="/" render={(props) => <Chat {...props} />}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
