import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { Input, Button } from '../../modules/reusables';

export default class Login extends React.Component {
    constructor(props){
        super(props),
        this.state = { error: false }
        this.submit = this.submit.bind(this);
    }

    inputHandler(e) {
        this[e.target.name] = e.target.value;
    }

    submit() {
        if(!this.email || !this.password) {
            /*If no email or no password is entered, 'error: true' will cause an
            error message to display*/
            this.setState({ error: true })
        }
        //Post email and password to server for auth.
        axios.post('/attempt-login', {
            email: this.email,
            password: this.password
        })

        .then((resp) => {
            //on successful auth, send user to home
            if (resp.data.success) {
                location.replace('/')
            }

            else {
                /*If auth fails, 'error: true' will cause an error message to
                display*/
                this.setState({ error: true })
            }
        })

        .catch(err => console.log("THERE WAS AN ERROR IN /trylogin",err));
    }

    render() {

        return (
            <div className="welcome-bottom-container">

                {!this.state.error ? <div className="filler"/> : <div className="warning">Uh oh, that FAILED</div> }

                <Input  type="text"
                        name="email"
                        onChange={e => this.inputHandler(e)}
                        placeholder="email"/>

                <Input  type="password"
                        name="password"
                        onChange={e => this.inputHandler(e)}
                        placeholder="password"/>

                <Button onClick={ () => this.submit() }>Login!</Button>

                <p>Not yet a member?
                    <Link className="link" to="/">Register</Link>
                </p>
            </div>
        )
    }
}
