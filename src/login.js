import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class Login extends React.Component {
    constructor(props){
        super(props),
        this.state = {error: false}
        this.submit = this.submit.bind(this);
    }

    inputHandler(e) {
        this[e.target.name] = e.target.value;
    }

    submit() {
        axios.post('/attemptlogin', {
            email: this.email,
            password: this.password

        }).then((resp) => {
            if (resp.data.success) {
                location.replace('/')
                // location.replace(`/user/${resp.data.user.firstname}`)
            } else {
                this.setState({
                    error: true
                })
            }
        }).catch(err => console.log("THERE WAS AN ERROR IN /trylogin",err));
    }

    render() {
        console.log('in login');

        return (
            <div>
                {this.state.error && <div>Error trying to login</div>}
                <input type="text" name="email" onChange={e => this.inputHandler(e)} placeholder="email"/>
                <input type="password" name="password" onChange={e => this.inputHandler(e)} placeholder="password"/>
                <button onClick={ () => this.submit() }>Login!</button>
                <p>Not yet a member? <Link to="/">Register</Link></p>
            </div>
        )
    }
}
