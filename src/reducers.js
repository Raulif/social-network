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

    if(action.type == 'STORE_USER_INFO') {
        state = Object.assign({}, state, {
            user: action.user
        })
    }

    if(action.type == 'UPDATE_ONLINE_USERS') {
        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        })
    }

    if(action.type == 'USER_JOINED') {
        if(state.onlineUsers && !state.onlineUsers.find(user => user.id == action.newUser.id)) {
            state = Object.assign({}, state, {
                onlineUsers: [...state.onlineUsers, action.newUser]
            })
        }
    }

    if(action.type == 'USER_LEFT') {
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter(onlineUser => onlineUser.id !== action.userId)
        })
        console.log('in reducers ', state.onlineUsers);
    }

    return state;
}
