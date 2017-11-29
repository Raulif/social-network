import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import FriendshipButton from '../friendships/friendship-button';

export default class OtherUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        /*in case the user entered his/her own #ID on the url, the app redirects
        home automatically*/
        if(this.props.params.id === this.props.id) {
            browserHistory.push('/')
            return
        }
    }

    componentDidMount() {

        const url = `/get-user/${this.props.params.id}`;

        axios.get(url)
            .then(({data}) => {
                this.setState({
                    userId: data.otherUser.id,
                    firstname: data.otherUser.firstname,
                    lastname: data.otherUser.lastname,
                    email: data.otherUser.email,
                    picturename: data.otherUser.picture_name,
                    bio: data.otherUser.bio

                })
            }).catch(err => console.log("THERE WAS AN ERROR IN /get-user/:id",err));
    }


    render() {
        return(
            <div id="other-user-profile">
            <div id="other-user-img-container">
                <img src={`https://s3.amazonaws.com/raulsbucket2/${this.state.picturename}`}/>
            </div>
                <h1 id='other-user-name'>{this.state.firstname} {this.state.lastname}</h1>
                <h2 className='other-user-tag-label'>My email is:</h2><h2 id='other-user-email'> {this.state.email}</h2>
                <h2 className='other-user-bio-label'>My bohemian thought of the day is:</h2>
                <p id='other-user-bio'>{this.state.bio}</p>
                <p id='other-user-friendship-status'>Friendship status:</p>
                <FriendshipButton otherUserId={this.props.params.id} />
            </div>
        )
    }
}
