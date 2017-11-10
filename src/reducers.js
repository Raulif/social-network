export default function(state = {}, action) {

    if(action.type == 'RECEIVE_USERS') {
        console.log('inside reducer receive users');
        console.log('action.friendships is: ',action.friendships);
        state = Object.assign({}, state, {
            friendships: action.friendships
        })
    }


    if(action.type == 'END_FRIENDSHIP') {
        console.log('state on end friendship', state);
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
        console.log('state on accept friendship', state);
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
        return
    }

    if(action.type == 'CREATE_ONLINE_USERS') {
        console.log('in reducer create online users');
        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        })
        return state
    }

    return state;
}
