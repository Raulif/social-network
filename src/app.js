import React from 'react';
import axios from 'axios';
import ProfilePicture from './profile-picture';
import {socket} from './socket';
import { Link } from 'react-router';

export default class App extends React.Component {
    constructor(props) {
        super(props),
        this.state = {}
        socket();
    }

    componentDidMount() {
        axios.get('/getUser')
        .then((queryResponse) => {
            let user = queryResponse.data.user;
            this.setState({
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email

            })
        }).catch(err => console.log("THERE WAS AN ERROR IN /app",err));
    }

    render() {
        const clonedChildren = React.cloneElement(
            this.props.children,
            {
                userId: this.state.userId,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            }
        )
        return (
            <div>
                <div id="topBar">
                    <Link to="/" id="home-link"></Link>
                    <ProfilePicture userId={this.state.userId} alt={`${this.state.firstName}-${this.state.lastName}`} />
                </div>
                {clonedChildren}

            </div>
        )
    }
}
