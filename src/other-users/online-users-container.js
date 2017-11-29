import React from 'react'
import { connect } from 'react-redux'
import OnlineUsers from './online-users'

class OnlineUsersContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        const { onlineUsers, user } = this.props;

        if(!onlineUsers.length) {
            return(
                <div id="no-users-online">Currently no users online</div>
            )
        }

        return(
            <div>
                {onlineUsers && <OnlineUsers onlineUsers={onlineUsers} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    let otherOnlineUsers

    if(!state.onlineUsers) {
        otherOnlineUsers = []
    }
    else {
        //we filter the array of users sent to props, removing the current user.
        otherOnlineUsers = state.onlineUsers.filter((onlineUser) => onlineUser.id !== state.user.id)
    }

    return ({
        onlineUsers: otherOnlineUsers && otherOnlineUsers,
    })
}

export default connect(mapStateToProps)(OnlineUsersContainer)
