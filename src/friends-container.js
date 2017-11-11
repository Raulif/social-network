import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { receiveFriendshipRequests } from './actions';
import Friend from './friend';
import {endFriendship, acceptFriendship} from './actions';


class FriendsContainer extends React.Component {

    componentDidMount() {
        console.log('component did mount');
        this.props.dispatch(receiveFriendshipRequests())
    }

    render(props) {
        const { friends, requesters } = this.props;
        if(!friends || !requesters) {
            return null;
        }
        // console.log('right before return', users[0]);
        return(
            <div id="friends">
                <div className="friends-container requester">
                <h1>This people are your friends!</h1>
                    {friends.map( friend => {
                        console.log('friends will be: ', friends);
                        return <Friend friend={friend} endFriendship={ (friend) =>  this.props.dispatch(endFriendship(friend))}/>
                    })}
                </div>
                <div className="friends-container accepted">
                <h1>This people want to be your friends</h1>
                    {requesters.map( requester  => {
                        return <Friend requester={requester} acceptFriendship ={ (requester) =>  this.props.dispatch(acceptFriendship(requester))} />
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    friends: state.friendships && state.friendships.filter(friendships => friendships.status == 'accepted'),
    requesters: state.friendships && state.friendships.filter(friendships => friendships.status == 'pending')
})


export default connect(mapStateToProps)(FriendsContainer)
