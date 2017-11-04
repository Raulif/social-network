import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Welcome from './welcome';
import Register from './register';
import Logo from './logo';
import Login from './login';
import App from './app'



const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Register} />
  	    </Route>
    </Router>
);

const loggedInRouter = <App/>

let router = location.pathname === '/welcome' ? notLoggedInRouter : loggedInRouter;

ReactDOM.render(
    router,
    document.querySelector('main')
);
