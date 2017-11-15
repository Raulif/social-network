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
                <h1>{this.state.firstname} {this.state.lastname}</h1>
                <h2>My email is: {this.state.email}</h2>
                <img src={`https://s3.amazonaws.com/raulsbucket2/${this.state.picturename}`}/>
                <FriendshipButton otherUserId={this.props.params.id} />
            </div>
        )
    }
}
