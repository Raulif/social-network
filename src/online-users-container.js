import React from 'react'
import { connect } from 'react-redux'
import OnlineUsers from './online-users'

class OnlineUsersContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render(props) {
        const { onlineUsers, user } = this.props;
        if(onlineUsers.length == 0) {
            return(
                <div>Currently no users online</div>
            )
        }
        return(
            <div>
                <h1>Following users are currently online</h1>
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
        otherOnlineUsers = state.onlineUsers.filter((onlineUser) => onlineUser.id !== state.user.id)
    }

    return ({
        onlineUsers: otherOnlineUsers && otherOnlineUsers,
    })
}

export default connect(mapStateToProps)(OnlineUsersContainer)
