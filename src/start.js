import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { Welcome, Register, Login } from './welcome';
import { Logo } from './logo';

const isLoggedIn = location.pathname != '/welcome'

let component = <Welcome />

if (isLoggedIn) {
    component = <Logo />
}

ReactDOM.render(
    component,
    document.querySelector('main')
);
//
// const router = (
//     <Router history={hashHistory}>
//         <Route path="/" component={Welcome}>
//             <Route path="/login" component={Login} />
//             <IndexRoute component={Register} />
//   	    </Route>
//     </Router>
// );
//
// ReactDOM.render(
//     router,
//     document.querySelector('main')
// );
