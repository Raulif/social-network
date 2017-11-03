import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Welcome from './welcome';
import Register from './register';
import Logo from './logo';
import Login from './login';
// import { App } from './app'



const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <Route path="/login" component={Login} />
            <IndexRoute component={Register} />
  	    </Route>
    </Router>
);

const loggedInRouter = (
    <Router history={hashHistory}>
        <Route path="/user" component={App}>
            <IndexRoute component={Logo} />
            <IndexRoute component={ProfilePicture}/>
        </Route>
    </Router>
)

// (
//     <Router history={hashHistory}>
//         <Route path="/user" component={App}>
//             <IndexRoute component={Logo} />
//         </Route>
//     </Router>
// )

let router = location.pathname === '/welcome' ? notLoggedInRouter : loggedInRouter;

ReactDOM.render(
    router,
    document.querySelector('main')
);
