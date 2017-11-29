import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { receiveFriendshipRequests, endFriendship, acceptFriendship } from '../actions/actions';
import Friend from './friend';


class FriendsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.clickHandlerPending = this.clickHandlerPending.bind(this)
        this.state = {
            showPending: false,
            showFriends: false
        }
    }

    componentDidMount() {
        //on mount we retrieve the list of friendships pending acceptance.
        this.props.dispatch(receiveFriendshipRequests())
    }

    clickHandlerPending(e){
        //on click we toggle the local state of 'showPending'

        if(this.state.showPending) {
            this.setState({ showPending: false })
        } else {
            this.setState({ showPending: true })
        }
    }
    clickHandlerAccepted(e){
        //on click we toggle the local state of 'showFriends'
        if(this.state.showFriends) {
            this.setState({ showFriends: false })
        } else {
            this.setState({ showFriends: true })
        }
    }

    render() {


        if(!this.props) {
            return null;
        }

        console.log('props at friends container: ', this.props);
        const { friends, requesters } = this.props;
        /*We display or hide the list of friends and the list of pending friendships
        according to the current state. We also change the icon between '+' and '-'.
        */
        let showPending = this.state.showPending ? 'showPending' : 'hidePending';
        let sideIconPending = this.state.showPending ? 'fa fa-minus' : 'fa fa-plus';
        let showFriends = this.state.showFriends ? 'showFriends' : 'hideFriends';
        let sideIconFriends = this.state.showFriends ? 'fa fa-minus' : 'fa fa-plus'

        return(
            <div id="friends">

                <div className='pending-friendships-title' onClick={() => this.clickHandlerPending()}>
                    {requesters && <h1>PENDING FRIENDSHIP REQUESTS <i className={sideIconPending} style={{ariaHidden: false}}/></h1>}
                    {!requesters && <h1>No pending friendship requests</h1>}
                </div>

                <div className={`pending-friendships ${showPending}`}>
                    {requesters && requesters.map(requester  => {
                        return (
                            <Friend requester={requester} acceptFriendship ={ (requester) => {
                                this.props.dispatch(acceptFriendship(requester))
                            }}/>
                        )})}
                </div>

                <div className='accepted-friendships-title' onClick={(e) => this.clickHandlerAccepted(e)}>
                    {friends && <h1>YOUR FRIENDS<i className={sideIconFriends} style={{ariaHidden: true}}></i></h1>}
                    {!friends && <h1>You have no friends yet</h1>}
                </div>

                <div className={`accepted-friendships ${showFriends}`}>
                    {friends && friends.map(friend => {
                        return (
                            <Friend friend={friend} endFriendship={ (friend) => {   this.props.dispatch(endFriendship(friend))
                        }}/>
                    )})}
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
