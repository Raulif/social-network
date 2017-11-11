import React from 'react'
import { connect } from 'react-redux'
import OnlineUsers from './online-users'

class OnlineUsersContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render(props) {
        const { onlineUsers, userId } = this.props;
        if(!onlineUsers) {
            return(
                <div>Currently no users online</div>
            )
        }
        return(
            <div>
                <h1>Following users are currently online</h1>
                {onlineUsers && <OnlineUsers onlineUsers={onlineUsers} userId={userId}/>}
            </div>
        )

    }
}

const mapStateToProps = state => ({
    onlineUsers: state && state.onlineUsers,
    userId: state && state.userId
})

export default connect(mapStateToProps)(OnlineUsersContainer)
