export default function(state = {}, action) {

    if(action.type == 'RECEIVE_USERS') {
        console.log('action.friendships is: ',action.friendships);
        state = Object.assign({}, state, {
            friendships: action.friendships
        })
    }


    if(action.type == 'END_FRIENDSHIP') {
        state = Object.assign({}, state, {
            friendships: state.friendships.map((user) => {
                if(user.id != action.user.id) {
                    return user
                }
                return Object.assign({}, user, {
                    status: 'terminated'
                })
            })
        })
    }


    if(action.type == 'ACCEPT_FRIENDSHIP') {
        state = Object.assign({}, state, {
            friendships: state.friendships.map((user) => {
                if(user.id != action.user.id) {
                    return user
                }
                return Object.assign({}, user, {
                    status: 'accepted'
                })
            })
        })
    }

    if(action.type == 'CONNECT_LOGGEDIN_USER') {
        state = Object.assign({}, state, {
            userId: action.userId
        })
        return state
    }

    if(action.type == 'CREATE_ONLINE_USERS' || action.type == 'USER_JOINED') {
        console.log('in reducer create online users or user joined');
        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        })
        console.log('state in reducer create-online-users after object.assign is: ', state);
        return state
    }

    return state;
}
