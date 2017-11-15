import React from 'react';
import ProfilePicture from './profile-picture';
import EditableBio from './editable-bio';
import {Link} from 'react-router'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        return(
            <div id='profile-container'>
                <ProfilePicture userId={this.props.userId}/>
                <h1 className="user-name">{this.props.firstname} {this.props.lastname}</h1>
                <EditableBio />
                <Link to="/friends" className="profile-link">See your friend requests</Link>
                <Link to="/online-users" className="profile-link">See who's online</Link>
                <Link to="/chat" className="profile-link">Let's chat</Link>
            </div>
        )
    }
}
