import React from 'react';
import AllUsers from './all-users';
import { connect } from 'react-redux';


class AllUsersContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        let {allUsers} = this.props
        if(allUsers.length == 0) {
            return(
                <div className='no-users-in-db'>
                    You are the only Bohemian here!
                </div>
            )
        }
        return(
            <div>
                <AllUsers allUsers={allUsers} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    let allUsers = !state.allUsers ? [] : state.allUsers.filter(user => user.id !== state.user.id)

    return({
        allUsers: allUsers
    })
}

export default connect(mapStateToProps)(AllUsers)
