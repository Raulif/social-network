import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { Input, Button } from './reusables'

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
        if(!this.email || !this.password) {
            this.setState({error: true})
        }
        axios.post('/attemptlogin', {
            email: this.email,
            password: this.password

        }).then((resp) => {
            if (resp.data.success) {
                location.replace('/#/user')
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
            <div className="welcome-bottom-container">
                {this.state.error && <div className="warning">Error trying to login</div>}
                <Input type="text" name="email" onChange={e => this.inputHandler(e)} placeholder="email"/>
                <Input type="password" name="password" onChange={e => this.inputHandler(e)} placeholder="password"/>
                <Button onClick={ () => this.submit() }>Login!</Button>
                <p>Not yet a member? <Link className="link" to="/">Register</Link></p>
            </div>
        )
    }
}
