import React from 'react';
import axios from 'axios';
import ProfilePicture from './profile-picture';
import { socket } from './socket';
import { connect } from 'react-redux';
import { Link } from 'react-router';


class App extends React.Component {
    constructor(props) {
        super(props),
        this.state = {}
        this.socket = socket();
    }

    componentDidMount() {
        axios.get('/getUser')
        .then((queryResponse) => {
            let user = queryResponse.data.user;
            this.setState({
                userId: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email

            })
        }).catch(err => console.log("THERE WAS AN ERROR IN /app",err));
    }


    render() {
        const clonedChildren = React.cloneElement(
            this.props.children,
            {
                userId: this.state.userId,
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                emit: (e, payload) => this.socket.emit(e, payload)
            }
        )
        return (
            <div>
                <div id="topBar">
                    <Link to="/" id="home-link"></Link>
                    <ProfilePicture userId={this.state.userId} alt={`${this.state.firstname}-${this.state.lastname}`} />
                </div>
                {clonedChildren}

            </div>
        )
    }
}

let mapStateToProps = (state) => ({state})
export default connect(mapStateToProps)(App)
