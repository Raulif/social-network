import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import styled from 'styled-components';

export default class Register extends React.Component {
    constructor(props){
        super(props),
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
        axios.post('/newuser', {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password

        }).then((resp) => {
            if (resp.data.success) {
                location.replace('/')
            } else {
                this.setState({
                    error: true
                })
            }
        }).catch(err => console.log("THERE WAS AN ERROR IN /newuser",err));
    }

    render() {
        console.log('in register');

        // const RegisterContainer = styled.div`
        //     width: 100%;
        //     height: 50vh;
        //     display: flex;
        //     flex-direction: column;
        //     background-color: #1899AD;
        //     margin: 0;
        //     align-items: center;
        // `

        const Input = styled.input`
            padding: 1%;
            height: 10%;
            width: 75%;
            color: #a51e72;
            background: #EFEFEF;
            border: none;
            border-radius: 3px;
            margin-bottom: 2%;
            font-size: 40px;
            text-align: center;
            outline-color: #a51e72;
            outline-width: thick;
        `

        const Button = styled.button`
            height: 7%;
            width: 30%;
            border: none;
            border-bottom: 5px solid #e683af;
            border-radius: 3px;
            background-color: #a51e72;
            color: white;
        `

        return (
            <div>
                <div>
                    {this.state.error && <div>Uh oh, that FAILED</div>}
                    <Input type="text" name="firstname" onChange={e => this.inputHandler(e)} placeholder="first name"/>
                    <Input type="text" name="lastname" onChange={e => this.inputHandler(e)} placeholder="last name"/>
                    <Input type="text" name="email" onChange={e => this.inputHandler(e)} placeholder="email"/>
                    <Input type="password" name="password" onChange={e => this.inputHandler(e)} placeholder="password"/>
                    <Button onClick={ () => this.submit() }>Submit!</Button>
                    <p>Alredy a member? </p>
                    <Link to="/login">Login</Link>

                </div>
            </div>
        )
    }
}
