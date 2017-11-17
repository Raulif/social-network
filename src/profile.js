import React from 'react';
import ProfilePicture from './profile-picture';
import EditableBio from './editable-bio';
import {Link} from 'react-router'
import FriendsContainer from './friends-container'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        let toggleMenu = this.props.showMenu ? 'show-menu' : 'hide-menu'
        console.log('props on profile: ', this.props);
        return(
            <div>
            <div id='link-container'>
                <div className={`${toggleMenu} link-subcontainer`}>

                    <Link to="/online-users" className="whos-online">
                        <p>WHO'S ONLINE
                            <i className="fa fa-wifi" style={{ariaHidden: true}}></i>
                        </p>
                    </Link>

                    <Link to="/chat" className="profile-link chat-link"><p>CHAT<i className="fa fa-comments" style={{ariaHidden: true}}></i></p></Link>

                    <Link to="/all-users" className="profile-link all-users-link">
                        <p>ALL USERS
                            <i className="fa fa-users" style={{ariaHidden: true}}></i>
                        
                        </p>


                    </Link>
                </div>

            </div>
                <div id='profile-container'>
                    <ProfilePicture userId={this.props.userId} picturename={this.props.picturename}/>
                    <h1 className="user-name">{this.props.firstname} {this.props.lastname}</h1>
                    <EditableBio />
                    <FriendsContainer id="friends-container" />
                </div>

            </div>
        )
    }
}
