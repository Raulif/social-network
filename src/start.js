import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Welcome from './welcome';
import Register from './register';
import Login from './login';
import App from './app';
import Profile from './profile';
import OtherUserProfile from './other-user-profile'



const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Register} />
  	    </Route>
    </Router>
);

const loggedInRouter = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Profile} />
            <Route path="/user/:id" component={OtherUserProfile}/>
        </Route>

    </Router>
);

let router = location.pathname === '/welcome' ? notLoggedInRouter : loggedInRouter;

ReactDOM.render(
    router,
    document.querySelector('main')
);
