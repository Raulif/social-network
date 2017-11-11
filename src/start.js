import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Welcome from './welcome';
import Register from './register';
import Login from './login';
import App from './app';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import Profile from './profile';
import OtherUserProfile from './other-user-profile';
import reducer from './reducers'
import reduxPromise from 'redux-promise';
import FriendsContainer from './friends-container'
import Friend from './friend'
import * as io from 'socket.io-client';
import OnlineUsersContainer from './online-users-container'
import { composeWithDevTools } from 'redux-devtools-extension';


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
            </Route>
        </Router>
    </Provider>
);

let router = location.pathname === '/welcome' ? notLoggedInRouter : loggedInRouter;

ReactDOM.render(
    router,
    document.querySelector('main')
);
