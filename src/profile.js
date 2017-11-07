import React from 'react';
import ProfilePicture from './profile-picture';
import EditableBio from './editable-bio';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        return(
            <div id='profile-container'>
                <ProfilePicture userId={this.props.userId}/>
                <h1 className="user-name">{this.props.firstName} {this.props.lastName}</h1>
                <EditableBio />
            </div>
        )
    }
}
