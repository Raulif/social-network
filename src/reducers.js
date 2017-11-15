export default function(state = {}, action) {

    if(action.type == 'RECEIVE_USERS') {
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
            onlineUsers: state.onlineUsers.filter(onlineUser => onlineUser.id !== action.userId.id)
        })
    }

    if(action.type == 'CHAT_MESSAGES') {
        state = Object.assign({}, state, {
            messages: action.messages
        })
    }

    if(action.type == 'INCOMING_MESSAGE') {
        console.log(action.message);
        state = Object.assign({}, state, {
            messages: [...state.messages, action.message]
        })
    }

    return state;
}
