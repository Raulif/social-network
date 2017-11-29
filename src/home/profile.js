import React from 'react';
import ProfilePicture from './profile-picture';
import EditableBio from './editable-bio';
import { Link } from 'react-router'
import FriendsContainer from '../friendships/friends-container'

export default function Profile(props) {

    if(!props) {
        return null
    }

    //the visibility of the navigation menu (link-container) is toggled on click
    let toggleMenu = props.showMenu ? 'show-menu' : 'hide-menu'

    return(
        <div>
            <div id='link-container'>
                <div className={`${toggleMenu} link-subcontainer`}>

                    <Link to="/online-users" className="whos-online">
                        <p>WHO'S ONLINE
                            <i className="fa fa-wifi" style={{ariaHidden: true}}></i>
                        </p>
                    </Link>

                    <Link to="/chat" className="profile-link chat-link">
                        <p>CHAT
                            <i className="fa fa-comments" style={{ariaHidden: true}}></i>
                        </p>
                    </Link>

                    <Link to="/all-users" className="profile-link all-users-link">
                        <p>ALL USERS
                            <i className="fa fa-users" style={{ariaHidden: true}}></i>
                        </p>
                    </Link>
                </div>
            </div>

            <div id='profile-container'>
                <ProfilePicture userId={props.userId} picturename={props.picturename}/>
                <h1 className="user-name">{props.firstname} {props.lastname}</h1>
                <EditableBio />
                <FriendsContainer id="friends-container" />
            </div>
        </div>
    )
}
