import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Welcome from './welcome/welcome';
import Register from './welcome/register';
import Login from './welcome/login';
import App from './home/app';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Profile from './home/profile';
import OtherUserProfile from './other-users/other-user-profile';
import reducer from './reducers/reducers';
import reduxPromise from 'redux-promise';
import FriendsContainer from './friendships/friends-container';
import Friend from './friendships/friend';
import * as io from 'socket.io-client';
import OnlineUsersContainer from './other-users/online-users-container';
import ChatRoom from './chat/chat-room';
import { composeWithDevTools } from 'redux-devtools-extension';
import AllUsersContainer from './all-users/all-users-container';


export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));


const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Register} />
  	    </Route>
    </Router>
);

const loggedInRouter = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Profile} />
                <Route path="/user/:id" component={OtherUserProfile}/>
                <Route path="/friends" component={FriendsContainer} />
                <Route path="/online-users" component={OnlineUsersContainer} />
                <Route path="/chat" component={ChatRoom} />
                <Route path="/all-users" components={AllUsersContainer} />
            </Route>
        </Router>
    </Provider>
);

let router = location.pathname === '/welcome' ? notLoggedInRouter : loggedInRouter;

ReactDOM.render(
    router,
    document.querySelector('main')
);
