import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import styled from 'styled-components';
import { Input, Button } from './reusables'

export default class Register extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            error: false,
        }
        this.submit = this.submit.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(e) {
        this[e.target.name] = e.target.value;
    }

    submit() {
        if(!this.firstname || !this.lastname || this.email || this.password) {
            this.setState({error: true})
        }

        axios.post('/newuser', {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password

        }).then((res) => {
            if (res.data.success) {
                location.replace('/')
            } else {
                this.setState({error: true})
            }
        }).catch(err => console.log("THERE WAS AN ERROR IN /newuser",err));
    }

    render() {
        console.log('in register');

        return (
            <div className="welcome-bottom-container">
                {!this.state.error ? <div className="filler"/> : <div className="warning">Uh oh, that FAILED</div> }
                <Input type="text" name="firstname" onChange={e => this.inputHandler(e)} placeholder="first name"/>
                <Input type="text" name="lastname" onChange={e => this.inputHandler(e)} placeholder="last name"/>
                <Input type="text" name="email" onChange={e => this.inputHandler(e)} placeholder="email"/>
                <Input type="password" name="password" onChange={e => this.inputHandler(e)} placeholder="password"/>
                <Button onClick={ () => this.submit() }>Submit!</Button>
                <p>Alredy a member? <Link className='link' to="/login">Login</Link></p>
            </div>
        )
    }
}
