import React from 'react'
import { connect } from 'react-redux'
import OnlineUsers from './online-users'

class OnlineUsersContainer extends React.Component {
    constructor(props) {
        super(props)
    }
    render(props) {
        const { onlineUsers } = this.props

        if(!onlineUsers) {
            return(
                <div>Current no users online</div>
            )
        }
        return(
            <div>
                <h1>Following users are currently online</h1>
                <OnlineUsers onlineUsers={onlineUsers}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        onlineUsers: state.onlineUsers && state.onlineUsers
    }
}

export default connect (mapStateToProps)(OnlineUsersContainer)
