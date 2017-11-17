import React from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import FriendshipButton from './friendship-button';

export default class OtherUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        if(this.props.params.id === this.props.id) {
            browserHistory.push('/')
            return
        }
    }

    componentDidMount() {
        console.log('id on did mount: ', this.props.params.id);
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


    render(props) {
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
